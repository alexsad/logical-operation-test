export interface IPosition {
    x: number;
    y: number;
}

export interface IInputOutputPoint {
    active: boolean;
    id: string;
    label: string;
}

export interface IWire {
    id: string;
    chipInputId: string;
    chipOutputId: string;
    active: boolean;
}

export interface IChip {
    id: string;
    name: string;
    version: number;
    position: IPosition;
    inputs: IInputOutputPoint[];
    outputs: IInputOutputPoint[];
    instInputDeps: string[];
    originLayerId: string;
}

export interface IChipLayer {
    id: string;
    name: string;
    version: number;
    visible: boolean;
    inputs: IInputOutputPoint[];
    outputs: IInputOutputPoint[];
    chips: IChip[];
    wires: IWire[];
}
