import React, { useEffect, useRef, useState } from 'react';
import ToolSet from './tools/ToolSet';
import ProjectProperties from './project-properties/ProjectProperties';
import styled from 'styled-components';
import Chip from './chip/Chip';
import LineTo from './line-to/LineTo';
import { InputPoint, InputPointAdd, OutputPoint, OutputPointAdd } from './point/InputOutputPoint';
import useChipLayer from './stores/useChipLayer';
import { IChip } from '../interfaces/interfaces';
import { Droppable, IDroppableEvent } from '../ui/Draggable';
import LayerOperations from './layer-operations/LayerOperations';
import colors from '../ui/colors';
import useResolution from './stores/useResolution';

const BuilderWrap = styled.div`
    box-sizing: border-box;
    position: relative;
    // width: 1024px;
    // height: 768px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row no-wrap;
    overflow: hidden;
    background: rgb(1,106,234);
    background: radial-gradient(circle, rgba(1,106,234,1) 0%, rgba(0,25,65,1) 100%);  
`;

const Panel = styled.div`
    box-sizing: border-box;
    position: relative;
    height: 100vh;
    background-color: transparent;
    display: flex;
    flex-flow: row no-wrap;
    flex-direction: column;
    overflow: hidden;
    width: 250px;
    box-sizing: border-box;
`

const CenterPanelBox = styled.div`
    position: relative;
    overflow: auto;
    height: calc(100vh - 54px);
`;

const BoxStage = styled.div`
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
    background-color: ${colors['gray.50']};
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

const CenterPanelWrap = styled.div`
    flex-grow: 1;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100vh;
    width: calc(100vw - 200px);
`;

const CenterPanel: React.FC = () => {
    const stageRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const stageCurrent = stageRef.current;
        if(stageCurrent){
            const rect = stageCurrent.getBoundingClientRect();
            // console.log('rect', rect);
            useResolution.getState().setResolution({
                width: rect.width,
                height: rect.height,
            });
        }
    }, []);
    
    return (
        <CenterPanelWrap>
            <LayerOperations/>
            <CenterPanelBox ref={stageRef} id="center_panel_box">                
                <LayerRender/>
            </CenterPanelBox>
        </CenterPanelWrap>
    )
}

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
    const resolution = useChipLayer(state => state.resolution); 
    return (
        <BoxStage
            draggable={false}
            style={{
                width: `${resolution.width}px`,
                height: `${resolution.height}px`,
            }}
         >
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
            <CenterPanel/>
        </BuilderWrap>
    );
}

export default Builder;
