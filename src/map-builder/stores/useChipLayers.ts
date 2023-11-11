import create from 'zustand';

import { IChipLayer, IInputOutputPoint } from '../../interfaces/interfaces';
import {LAYERS_STORE_KEY, openLayerStore} from '../../stores/idb-layers-store';
import { nextUID } from '../../util/uuid';

type layerAsFunction = (...inputs: boolean[]) => boolean[];

interface ILayersContext{
    layers: IChipLayer[];
    activeLayerId: string;
    layerFns:{[key:string]: Function};
    setActiveLayerId:(layerId:string) => void;
    getActiveLayer: () => IChipLayer | undefined;
    getLayerById: (layerId:string) => IChipLayer | undefined;
    getLayerAsFunction: (layerId: string) => undefined | layerAsFunction;
    addLayer: (layer: IChipLayer) => void;
    updateLayer: (layer: IChipLayer) => void;
    publishLayer: (layer: IChipLayer) => Promise<IChipLayer>;
    publishNewLayerVersion: (layer: IChipLayer) => Promise<IChipLayer>;
    getNewLayer: () => IChipLayer;
    removeLayer: (layerId: string) => void;
    setLayers: (layers:IChipLayer[]) => void;
    addLayers: (layers:IChipLayer[]) => void;
}

const basicLayerFns = {
    fn_not: (firstArg: boolean) => {
        // console.log('firs:', firstArg);
        if(!!firstArg){
            return [false];
        }
        return [true];
    },
    fn_and: (firstArg: boolean, secondArg: boolean) => {
        if(!!firstArg && !!secondArg){
            return [true];
        }
        return [false];
    },
    fn_decimal_display: (...args: boolean[]) => {
        return args;
    },
}

export default create<ILayersContext>((set, get) => ({
    layerFns:{...basicLayerFns},
    activeLayerId: '',
    layers: [],
    resolution: {
        width: 1024,
        height: 768,
    },
    setLayers: (layers:IChipLayer[]) => {
        const {publishLayer} = get();
        set({
            layerFns: {...basicLayerFns},
            layers: [...layers],
        });
        layers.forEach((layer) => {
            if(layer.version > 0){
                layer.version -= 1;
                publishLayer(layer);
            }
        });      
    },
    addLayers: (newLayers:IChipLayer[]) => {
        const {publishLayer, layers} = get();
        const publishedLayers = newLayers.filter(layer => layer.version > 0);
        set({
            layerFns: {...basicLayerFns},
            layers: [...publishedLayers, ...layers],
        });
        [...publishedLayers, ...layers].forEach((layer) => {
            if(layer.version > 0){
                layer.version -= 1;
                publishLayer(layer);
            }
        });
    },   
    getNewLayer: () => {
        const nextId = `${nextUID()}`;
        return  {
            id: nextId,
            name: '',
            version: 0,
            visible: true,
            inputs: [],
            outputs: [],
            chips: [],
            wires: [],
            resolution: {
                width: 0,
                height: 0,
            },
        };
    },
    removeLayer: (layerId: string) => {
        const {layers, activeLayerId, layerFns} = get();
        const layerIndex = layers.findIndex((layer) => layer.id === layerId);
        if(layerIndex > -1){
            const layer = layers[layerIndex];
            if(layer.version > 0){
                layers.splice(layerIndex, 1);
                delete layerFns[`fn_${layerId}`];
                if(layer.id === activeLayerId){
                    set({
                        layerFns: {
                            ...layerFns,
                        },
                        activeLayerId: '',
                        layers: [...layers],
                    })
                }else{
                    set({
                        layerFns: {
                            ...layerFns,
                        },
                        layers: [...layers],
                    })
                }
            }
        }
    },
    publishNewLayerVersion: async (layerToPublish: IChipLayer) => {
        const {publishLayer} = get();
        return publishLayer(layerToPublish);
    },

    publishLayer: async (layerToSave: IChipLayer) => {
        const {layers, layerFns} = get();
        const generateFunctionFromLayer = (pLayer: IChipLayer) => {
            let fnBody = `
                const _this = this;
            `;
            const {wires, chips, outputs, inputs: inputPoints} = pLayer;
            const outputsLength = outputs.length;
            const chipsLength = chips.length;
            const getWire = (inputId: string) => wires.find(({chipInputId, chipOutputId}) => [chipInputId, chipOutputId].includes(inputId));
            const getChipByOutputId = (outputId: string) => {
                const chip = chips.find(chip => chip.outputs.find(chipOutput => chipOutput.id === outputId));
                const chipOutputIndex = chip?.outputs.findIndex(chipOutput => chipOutput.id === outputId);
                if(typeof chipOutputIndex === 'number' && chipOutputIndex > -1){
                    return {
                        chip,
                        chipOutputIndex,
                    }
                }
                return null;
            }
            const getArgments = (inputs: { id: string}[]) => {
                let chipArgsStr: string[] = [];
                for(let x = 0; x < inputs.length; x++){
                    const wire = getWire(inputs[x].id);
                    if(wire && wire.chipOutputId){
                        const inputLayerIndex = inputPoints.findIndex(inp => inp.id === wire.chipOutputId);
                        if(inputLayerIndex > -1){
                            chipArgsStr.push(`inputs[${inputLayerIndex}]`);
                        }else{
                            const shipOutput = getChipByOutputId(wire.chipOutputId);
                            chipArgsStr.push(`chip_inst_${shipOutput?.chip?.id}.getOutput(${shipOutput?.chipOutputIndex})`);
                        }
                    }else{
                        chipArgsStr.push('false');
                    }
                }

                return chipArgsStr.join(',');
            };


            const inputPointIds = inputPoints.map(({id}) => id);
            const concatInputIds = (chipInputs: IInputOutputPoint[]) => {
                return chipInputs.map(({id}) => {
                    const wire = getWire(id);
                    if(!!wire && wire.chipInputId === id){
                        return wire.chipOutputId;
                    }
                    return '';
                }).filter(rs => rs !== '');
            }

            chips.forEach(chip => {
                const concatenedInputsIds = concatInputIds(chip.inputs);
                const chipsFromOutputs = chips
                    .filter(chipOutPut => {
                        const chipOutputIdsConcated =  chipOutPut.outputs.map(output_item => output_item.id);
                        return concatenedInputsIds.some(concatedId => chipOutputIdsConcated.includes(concatedId));
                    })
                    .map(chipOutput => chipOutput.id);
                
                chip.instInputDeps = [
                    ...chipsFromOutputs
                ];
            });

            chips.sort((chipA, chipB) => {
                const inputIdsA = concatInputIds(chipA.inputs);
                const onlyInputs = inputIdsA.every(inputId => inputPointIds.includes(inputId));
                if(onlyInputs){
                    return -1;
                }else{
                    if(chipB.instInputDeps.includes(chipA.id)){
                        return -1;
                    }
                }              
                return 1;
            });

            for(let i = 0; i < chipsLength; i++){
                const chipInst = chips[i];
                const chipInstVar = `chip_inst_${chipInst.id}`;
                fnBody += `
                    const ${chipInstVar} = {
                        outputs: Array.from({length: ${chipInst.outputs.length}}, () => false),
                        inputs: Array.from({length: ${chipInst.inputs.length}}, () => false),
                        setInputs:(...values) => {
                            if(values.length === ${chipInstVar}.inputs.length){
                                ${chipInstVar}.inputs = [...values];
                                ${chipInstVar}.outputs = [
                                    ..._this.fn_${chipInst.originLayerId}(
                                        ...${chipInstVar}.inputs
                                    )
                                ]
                            }
                        },
                        getOutput: (posi) => {
                            if(posi < ${chipInstVar}.outputs.length){
                                return ${chipInstVar}.outputs[posi];
                            }
                            return false;
                        },
                    }
                `;
            }
            for(let i = 0; i < chipsLength; i++){
                const chipInst = chips[i];
                const chipInstVar = `chip_inst_${chipInst.id}`;
                fnBody += `
                    ${chipInstVar}.setInputs(
                        ${ getArgments(chipInst.inputs) }
                    );
                `;
            }
            fnBody += `
                const outputs = [];
            `;
            for(let x = 0; x < outputsLength; x++){
                fnBody += `outputs.push(${ getArgments(outputs) });`;
            }

            fnBody += `return outputs`;
            const chipFn = new Function('...inputs', fnBody || 'return null');
            return chipFn as (...inputs: boolean[]) => boolean[];
        };

        layerToSave.visible = false;

        const layerIndex = layers.findIndex((layer) => layer.id === layerToSave.id);
        layerToSave.version += 1;
        layerToSave.inputs.forEach(input => input.active = false);
        layerToSave.outputs.forEach(output => output.active = false);
        layers[layerIndex] = {
            ...layerToSave,
        };
        set({
            layers: [...layers],
            layerFns: {
                ...layerFns,
                [`fn_${layerToSave.id}`]:  generateFunctionFromLayer(layerToSave),
            }
        });
        return {...layerToSave};
    },
    saveLayers: async (layer: IChipLayer) => {
        const {layers} = get();
        layers.push(layer);

        const dbPromise = openLayerStore();
        (await dbPromise).add(LAYERS_STORE_KEY, layer, layer.id);
        (await dbPromise).close();        
    },
    addLayer: (layerToSave: IChipLayer) => {
        const {layers} = get();
        const layerIndex = layers.findIndex(layer => layer.id === layerToSave.id);
        if(layerIndex > -1){
            layers[layerIndex] = {
                ...layerToSave
            }
            set({
                layers: [...layers]
            });
            return;
        }
        set({
            layers: [...layers, layerToSave]
        });      
    },
    updateLayer: (layer: IChipLayer) => {
        const {layers} = get();
        const layerIndex = layers.findIndex(({id}) => id === layer.id);
        if(layerIndex){
            layers[layerIndex] = { 
                ...layer
            };
            set({
                layers: [...layers]
            });
        }
    },
    getLayerAsFunction: (layerId: string) => {
        const {layerFns} = get()
        if(layerFns[`fn_${layerId}`]){
            const encapsuled =  (...inputs: boolean[]) => {
                const customFn = layerFns[`fn_${layerId}`];
                return customFn.apply(layerFns, inputs);
            };
            return encapsuled as layerAsFunction;
        }
        return undefined;
    },
    getActiveLayer: () => {
        const {layers, activeLayerId} = get();
        return layers.find(layer => layer.id === activeLayerId);
    },
    getLayerById: (layerId:string) => {
        const {layers} = get();
        return layers.find(layer => layer.id === layerId);
    },
    setActiveLayerId: (layerId:string) => {
        const {layers} = get();
        set({
            layers: [...layers.map(layer => {
                layer.visible = false;
                if(layerId === layer.id){
                    layer.visible = true;
                }
                return layer;
            })],
            activeLayerId: layerId,
        });
    },
}));
