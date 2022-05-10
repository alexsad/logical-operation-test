import React, { useEffect, useRef, useState } from 'react';
import ToolSet from './tools/ToolSet';
import ProjectProperties from './project-properties/ProjectProperties';
import styled from 'styled-components';
import buildBgEditor from './assets/bg-build.png';
import Chip from './chip/Chip';
import LineTo from './line-to/LineTo';
import { InputPoint, InputPointAdd, OutputPoint, OutputPointAdd } from './point/InputOutputPoint';
import useChipLayer from './stores/useChipLayer';
import { IChip } from '../interfaces/interfaces';
import { Droppable, IDroppableEvent } from '../ui/Draggable';
import LayerOperations from './layer-operations/LayerOperations';

const BuilderWrap = styled.div`
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: #f0f0f0;
    display: flex;
    flex-flow: row no-wrap;
    overflow: hidden;
`;

const Panel = styled.div`
    box-sizing: border-box;
    position: relative;
    height: 100vh;
    background-color: #f0f0f0;
    display: flex;
    flex-flow: row no-wrap;
    flex-direction: column;
    overflow: hidden;
    width: 275px;
    box-sizing: border-box; 
`

const CenterPanel = styled.div`
    box-sizing: border-box;
    position: relative;
    height: 100vh;
    background-color: #f0f0f0;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
    box-sizing: border-box; 
`

const BoxStage = styled.div`
    flex-grow: 1;
    box-sizing: border-box;
    background-image: url(${buildBgEditor});
    background-color: #999999;
    overflow: auto;
    position: relative;
    display: flex;
    flex-direction: row;    
`;

const SubStageBox = styled.div`
    flex-grow: 1;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: row;
`;

const InputOutputBox = styled.div`
    width: auto;
    height: 100%;
    padding: .5rem;
    box-sizing: border-box;
    background-color: rgba(0,0,0,.5);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

`;

const InputsBox = styled(InputOutputBox)`
    left: 0;
`;

const OutputsBox = styled(InputOutputBox)`
    right: 0;
`;

const DropStage: React.FC = () => {
    const dropRef = useRef<HTMLDivElement>(null);
    const onDropHandler = (dataStr: string, { target }: IDroppableEvent) => {};

    return (
        <Droppable refElement={dropRef} onDrop={onDropHandler}>
            <SubStageBox draggable={false} ref={dropRef}>
                <Chips/>
                <Wires/>
            </SubStageBox>
        </Droppable>
    );
}

const Outputs: React.FC = () => {
    const outputs = useChipLayer(state => state.outputs);
    return (
        <OutputsBox>
            <OutputPointAdd/>
            {outputs.map(output => (
                <OutputPoint key={`${output.id}`} active={output.active} id={output.id} label={output.label}/>
            ))}
        </OutputsBox>
    );
}

const Inputs: React.FC = () => {
    const inputs = useChipLayer(state => state.inputs);
    return (
        <InputsBox>
            <InputPointAdd/>
            {inputs.map(input => (
                <InputPoint key={`${input.id}`} active={input.active} id={input.id} label={input.label}/>
            ))}
        </InputsBox>
    );
}

const Chips: React.FC = () => {
    const [chips, setChips] = useState([] as IChip[]);
    useEffect(() => {
        const unSub = useChipLayer.subscribe((currChips: IChip[]) => {
            if(currChips.length !== chips.length){
                setChips(() => [...currChips]);
            }
        }, state => state.chips);
        return () => {
            unSub()
        }
    }, [chips]);
    return (
        <>
            {chips.map(chip => (
                <Chip 
                    key={`${chip.id}`}
                    {...chip}
                />
            ))}
        </>
    );
}

const Wires: React.FC = () => {
    const wires = useChipLayer(state => state.wires);
    return (
        <>
            {wires.map(wire => (
                <LineTo 
                    key={`${wire.chipOutputId}_${wire.chipInputId}`}
                    id={wire.id}
                    chipOutputId={wire.chipOutputId}
                    chipInputId={wire.chipInputId}
                    active={wire.active}
                />
            ))}
        </>
    );
}


const LayerRender: React.FC = () => {
    return (
        <BoxStage draggable={false}>
            <Inputs/>
            <DropStage/>
            <Outputs/>
        </BoxStage>
    );
}

const Builder: React.FC = () => { 
    return (
        <BuilderWrap>
            <Panel>
                <ProjectProperties/>
                <ToolSet/>
            </Panel>
            <CenterPanel>
                <LayerOperations/>
                <LayerRender/>
            </CenterPanel>
        </BuilderWrap>
    );
}

export default Builder;
