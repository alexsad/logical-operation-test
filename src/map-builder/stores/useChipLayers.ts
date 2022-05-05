import create from 'zustand';

import { IChip, IChipLayer, IInputOutputPoint } from '../../interfaces/interfaces';
import {LAYERS_STORE_KEY, openLayerStore} from '../../stores/idb-layers-store';

type layerAsFunction = (...inputs: boolean[]) => boolean[];

interface ILayersContext{
    layers: IChipLayer[];
    selectedOutputId: string | null;
    activeLayerId: string;
    layerFns:{[key:string]: Function};
    addChip: (chip: IChip) => void;
    moveChip: (chip: IChip) => void;
    addInpuPoint: (point: IInputOutputPoint) => void;
    addOutPoint: (point: IInputOutputPoint) => void;
    connectPoints: (inputId: string) => void;
    setSelectedOutputId: (outputId: string) => void;
    setVisibility:(layerId:string, visibility: boolean) => void;
    activeInputSource: (inputId: string, active: boolean) => void;
    getActiveLayer: () => IChipLayer | undefined;
    getLayerById: (layerId:string) => IChipLayer | undefined;
    activeWire: (wireId: string, active: boolean) => void;
    getLayerAsFunction: (layerId: string) => undefined | layerAsFunction;
    // saveLayers: () => Promise<void>;
    addLayer: (layer: IChipLayer) => Promise<void>;
    changeLayerName: (layerId: string, newLayerName: string) => void;
    publishLayer: (layerId: string) => void;
}

const firstLayerId =  `${new Date().getTime()}`;

export default create<ILayersContext>((set, get) => ({
    layerFns:{
        fn_not: (firstArg: boolean) => {
            console.log('firs:', firstArg);
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
    },
    activeLayerId: firstLayerId,
    selectedOutputId: null,
    layers: [
        {
            id: firstLayerId,
            name: '*',
            version: 0,
            visible: true,
            inputs: [],
            outputs: [],
            chips: [],
            wires: [],
        },
    ] as IChipLayer[],
    changeLayerName: (layerId: string, newLayerName: string) => {
        const {layers} = get(); 
        const layer = layers.find(layer => layer.id === layerId);
        if(layer){
            layer.name = newLayerName;
            set({
                layers: [...layers]
            });
        }
    },
    publishLayer: (layerId: string) => {
        const {layers, layerFns} = get(); 
        const layer = layers.find(layer => layer.id === layerId);
        const generateFunctionFromLayer = (layerId: string) => {
            const {layers} = get();
            const layer = layers.find(layer => layer.id === layerId);
            let fnBody = ``;
            if(layer){
                const outputsLength = layer.outputs.length;
                const chipsLength = layer.chips.length;
                const getWire = (inputId: string) => layer.wires.find(({chipInputId, chipOutputId}) => [chipInputId, chipOutputId].includes(inputId));
                const getChipByOutputId = (outputId: string) => {
                    const chip = layer.chips.find(chip => chip.outputs.find(chipOutput => chipOutput.id === outputId));
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
                            const inputLayerIndex = layer.inputs.findIndex(inp => inp.id === wire.chipOutputId)
                            if(inputLayerIndex > -1){
                                chipArgsStr.push(`inputs[${inputLayerIndex}]`);
                            }else{
                                const shipOutput = getChipByOutputId(wire.chipOutputId);
                                chipArgsStr.push(`chip_inst_${shipOutput?.chip?.id}[${shipOutput?.chipOutputIndex}]`);
                            }
                        }else{
                            chipArgsStr.push('false');
                        }
                    }
    
                    return chipArgsStr.join(',');
                };
    
                for(let i = 0; i < chipsLength; i++){
                    const chipInst = layer.chips[i];
                    const chipInstVar = `chip_inst_${chipInst.id}`;
                    fnBody += `const ${chipInstVar} =  this.fn_${chipInst.originLayerId}(
                        ${ getArgments(chipInst.inputs) }
                    );\n`;
                }
                fnBody += `const outputs = [];\n`;
                for(let x = 0; x < outputsLength; x++){
                    fnBody += `outputs.push([${ getArgments(layer.outputs) }]);\n`;
                }
    
                fnBody += `return outputs`;
            }
            const chipFn = new Function('inputs', fnBody || 'return null');
            return chipFn as (...inputs: boolean[]) => boolean[];
        };

        if(layer){
            layer.version = layer.version + 1;
            layer.visible = false;
            const nextId = `${new Date().getTime()}`;
            layers.push(
                {
                    id: nextId,
                    name: '*',
                    version: 0,
                    visible: true,
                    inputs: [],
                    outputs: [],
                    chips: [],
                    wires: [],
                }
            );
            
            set({
                layers: [...layers],
                activeLayerId: nextId,
                layerFns: {
                    ...layerFns,
                    [`fn_${layerId}`]:  generateFunctionFromLayer(layerId),
                }
            });
        }
    },
    addLayer: async (layer: IChipLayer) => {
        const {layers} = get();
        layers.push(layer);

        const dbPromise = openLayerStore();
        (await dbPromise).add(LAYERS_STORE_KEY, layer, layer.id);
        (await dbPromise).close();        
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
    activeInputSource: (inputId: string, active: boolean) => {
        const {layers, activeLayerId} = get();
        const layer = layers.find(layer => layer.id === activeLayerId);
        if(!!layer){
            const inputIndex = layer.inputs.findIndex(({id}) => inputId === id);
            if(inputIndex > -1){
                layer.inputs[inputIndex].active = active;
                const wire = layer.wires.find(({chipOutputId}) => inputId === chipOutputId);
                // console.log('wire:', wire);
                if(wire){
                    wire.active = active;
                }
                set({
                    layers: [...layers]
                });
            }
        }       
    },
    activeWire: (wireId: string, active: boolean) => {
        const {layers, activeLayerId} = get();
        const layer = layers.find(layer => layer.id === activeLayerId);
        if(!!layer){
            const wire = layer.wires.find(({id}) => id === wireId);
            // console.log('wire:', wire);
            if(wire){
                wire.active = active;
            }
            set({
                layers: [...layers]
            });
        }       
    },
    addChip: (chip: IChip) => {
        const {layers, activeLayerId} = get();
        const layer = layers.find(layer => layer.id === activeLayerId);
        if(!!layer){
            layer?.chips.push({
                ...chip,
                id: `${layer.id}_${new Date().getTime()}`,
            });
            set({
                layers: [...layers]
            });
        }
    },
    moveChip: (chip: IChip) => {
        const {layers, activeLayerId} = get();
        const layer = layers.find(layer => layer.id === activeLayerId);
        if(!!layer){
            const chipIndex = layer.chips.findIndex(({id}) => chip.id === id);
            if(chipIndex > -1){
                layer.chips[chipIndex] = {...chip};
                set({
                    layers: [...layers]
                });
            }
        }
    },
    addInpuPoint: (point: IInputOutputPoint) => {
        const {layers, activeLayerId} = get();
        const layer = layers.find(layer => layer.id === activeLayerId);
        if(!!layer){
            layer?.inputs.push({
                ...point,
                id: `${layer.id}_${new Date().getTime()}`,
            });
            set({
                layers: [...layers]
            });
        }
    },
    addOutPoint: (point: IInputOutputPoint) => {
        const {layers, activeLayerId} = get();
        const layer = layers.find(layer => layer.id === activeLayerId);
        if(!!layer){
            layer?.outputs.push({
                ...point,
                id: `${layer.id}_${new Date().getTime()}`,
            });
            set({
                layers: [...layers]
            });
        }
    },
    setSelectedInputId: (inputId: string) => {
        set({
            selectedOutputId: inputId,
        });
    },
    setSelectedOutputId: (outputId: string) => {
        const {layers, activeLayerId} = get();
        const layer = layers.find(layer => layer.id === activeLayerId);
        if(!!layer){
            const wire = layer.wires.find(wire => [wire.chipInputId, wire.chipOutputId].includes(outputId));
            if(!wire){
                set({
                    selectedOutputId: outputId,
                });
            }
        }
    },
    connectPoints: (inputId: string) => {
        const {layers, activeLayerId, selectedOutputId} = get();
        const layer = layers.find(layer => layer.id === activeLayerId);
        if(!!layer && !!selectedOutputId){
            const wire = layer.wires.find(wire => [wire.chipInputId, wire.chipOutputId].includes(inputId));
            if(!wire){
                layer.wires.push({
                    ...{
                        chipInputId: inputId,
                        chipOutputId: selectedOutputId,
                        active: false,
                        id: `${selectedOutputId}_${selectedOutputId}`,
                    },
                });
                set({
                    layers: [...layers],
                    selectedOutputId: null,
                });
            }
        }
    },
    setVisibility: (layerId:string, visibility:boolean) => {
        const {layers} = get();
        set({
            layers: [...layers.map(layer => {
                layer.visible = false;
                if(layerId === layer.id){
                    layer.visible = visibility;
                }
                return layer;
            })]
        });
    },
}));
