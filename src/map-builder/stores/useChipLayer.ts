import create from 'zustand';
import { IChip, IChipLayer, IInputOutputPoint } from '../../interfaces/interfaces';

interface ILayersContext extends IChipLayer{
    selectedOutputId: string | null;
    addChip: (chip: IChip) => void;
    moveChip: (chip: IChip) => void;
    addInpuPoint: (point: IInputOutputPoint) => void;
    addOutPoint: (point: IInputOutputPoint) => void;
    connectPoints: (inputId: string) => void;
    setSelectedOutputId: (outputId: string) => void;
    activateInputSource: (inputId: string, active: boolean) => void;
    activateWire: (wireId: string, active: boolean) => void;
    changeLayerName: (newLayerName: string) => Promise<IChipLayer>;
    getLayer:() => IChipLayer;
    updateLayer: (layer: IChipLayer) => void;
    removeWire: (idWire: string) => void;
    removeChip: (idChip: string) => void;
    removeOutput: (idOutput: string) => void;
    removeInput: (idInput: string) => void;
}


const firstLayerId =  `${new Date().getTime()}`;

export default create<ILayersContext>((set, get) => ({
    selectedOutputId: null,
    id: firstLayerId,
    name: '*',
    version: 0,
    visible: true,
    inputs: [],
    outputs: [],
    chips: [],
    wires: [],
    getLayer: () => {
        const {
            id,
            name, 
            version,
            visible, 
            inputs, 
            outputs, 
            chips, 
            wires,
        } = get();
        return {
            id,
            name,
            version,
            visible,
            inputs,
            outputs,
            chips,
            wires,
        };
    },
    removeOutput: (idOutput: string) => {
        const {outputs, wires, removeWire} = get();
        const index = outputs.findIndex(({id}) => id === idOutput);
        if(index > -1){
            wires
                .filter(({chipInputId, chipOutputId}) => [chipInputId, chipOutputId].includes(idOutput))
                .forEach(wire => {
                    removeWire(wire.id);
                });            
            outputs.splice(index, 1);
            set({
                outputs: [...outputs],
            })
        }
    },
    removeInput: (idInput: string) => {
        const {inputs, wires, removeWire} = get();
        const index = inputs.findIndex(({id}) => id === idInput);
        if(index > -1){
            wires
                .filter(({chipInputId, chipOutputId}) => [chipInputId, chipOutputId].includes(idInput))
                .forEach(wire => {
                    removeWire(wire.id);
                });            
                inputs.splice(index, 1);
            set({
                inputs: [...inputs],
            })
        }
    },
    removeChip: (idChip: string) => {
        const {chips, wires, removeWire} = get();
        const index = chips.findIndex(({id}) => id === idChip);
        if(index > -1){
            const {inputs, outputs} = chips[index];
            const points = [...inputs, ...outputs].map(point => point.id);
            wires
                .filter(({chipInputId, chipOutputId}) => points.includes(chipInputId) || points.includes(chipOutputId))
                .forEach(wire => {
                    removeWire(wire.id);
                });            
            chips.splice(index, 1);
            set({
                chips: [...chips],
            })
        }
    },
    removeWire: (idWire: string) => {
        const {wires} = get();
        const wireIndex = wires.findIndex(({id}) => id === idWire);
        if(wireIndex > -1){
            wires.splice(wireIndex, 1);
            set({
                wires: [...wires],
            })
        }
    },
    updateLayer:(layer:IChipLayer) => {
        set({
            ...layer,
        });
    },
    changeLayerName: async (newLayerName: string) => {
        const {getLayer} = get();
        set({
            name: newLayerName
        });
        return {
            ...getLayer(),
            name: newLayerName,
        }
    },
    activateInputSource: (inputId: string, active: boolean) => {
        const {inputs, wires} = get();
        const inputIndex = inputs.findIndex(({id}) => inputId === id);
        if(inputIndex > -1){
            inputs[inputIndex].active = active;
            const wire = wires.find(({chipOutputId}) => inputId === chipOutputId);
            if(wire){
                wire.active = active;
                set({
                    wires: [...wires],
                    inputs: [...inputs],
                });
            }else{
                set({
                    inputs: [...inputs],
                });
            }
        }      
    },
    activateWire: (wireId: string, active: boolean) => {
        const {wires} = get();
        const wire = wires.find(({id}) => id === wireId);
        if(wire){
            wire.active = active;
            set({
                wires: [...wires]
            });
        }
    },
    addChip: (chip: IChip) => {
        const {chips, id: layerId} = get();
        chips.push({
            ...chip,
            id: `${layerId}_${new Date().getTime()}`,
        });
        set({
            chips: [...chips]
        });
    },
    moveChip: (chip: IChip) => {
        const {chips} = get();
        const chipIndex = chips.findIndex(({id}) => chip.id === id);
        if(chipIndex > -1){
            chips[chipIndex] = {...chip};
            set({
                chips: [...chips]
            });
        }
    },
    addInpuPoint: (point: IInputOutputPoint) => {
        const {inputs, id: layerId} = get();
        inputs.push({
            ...point,
            id: `${layerId}_${new Date().getTime()}`,
        });
        set({
            inputs: [...inputs]
        });
    },
    addOutPoint: (point: IInputOutputPoint) => {
        const {outputs, id: layerId} = get();
        outputs.push({
            ...point,
            id: `${layerId}_${new Date().getTime()}`,
        });
        set({
            outputs: [...outputs]
        });
    },
    setSelectedInputId: (inputId: string) => {
        set({
            selectedOutputId: inputId,
        });
    },
    setSelectedOutputId: (outputId: string) => {
        const {wires} = get();
        const wire = wires.find(wire => [wire.chipInputId, wire.chipOutputId].includes(outputId));
        if(!wire){
            set({
                selectedOutputId: outputId,
            });
        }
    },
    connectPoints: (inputId: string) => {
        const {selectedOutputId, wires} = get();
        if(!!selectedOutputId){
            const wire = wires.find(wire => [wire.chipInputId, wire.chipOutputId].includes(inputId));
            if(!wire){
                wires.push({
                    ...{
                        chipInputId: inputId,
                        chipOutputId: selectedOutputId,
                        active: false,
                        id: `${selectedOutputId}_${selectedOutputId}`,
                    },
                });
                set({
                    wires: [...wires],
                    selectedOutputId: null,
                });
            }
        }
    },
}));
