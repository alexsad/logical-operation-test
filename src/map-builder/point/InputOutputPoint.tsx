import React, { useState } from 'react';
import styled from 'styled-components';
import TrashElement from '../float-remove-btn/FloatRemoveBtn';
import useChipLayer from '../stores/useChipLayer';

const InputOutputPoint = styled.div`
    width: 50px;
    height: 50px;
    background-color: gray;
    border-radius: 50%;
    border: 1px solid transparent;
    z-index: 1;
    position: relative;
`
const InputPointAddBox = styled(InputOutputPoint)`
    background-color: #518a8a;
    font-size: 2.4rem;
    color: white;
    text-align: center;
    cursor: pointer;
`

const InputOutputPointActive = styled(InputOutputPoint)`
    background-color: #a00;
`

const InputPointAdd: React.FC = () => {
    const addPoint = () => {
        useChipLayer.getState().addInpuPoint({
            id: '',
            active: false,
        });
        setTimeout(() => {
            globalThis.dispatchEvent(
                new CustomEvent('chip:move', {})
            );
        }, 10);
    }
    return (
        <InputPointAddBox onClick={addPoint}>+</InputPointAddBox>
    );
}

const OutputPointAdd: React.FC = () => {
    const addPoint = () => {
        useChipLayer.getState().addOutPoint({
            id: '',
            active: false,
        });
        setTimeout(() => {
            globalThis.dispatchEvent(
                new CustomEvent('chip:move', {})
            );
        }, 10);
    }
    return (
        <InputPointAddBox onClick={addPoint}>+</InputPointAddBox>
    );
}

const InputPoint: React.FC<{inputPointId: string, active: boolean}> = ({inputPointId, active}) => {
    const [isMouseOver, setIsMouseOver] = useState(false);  
    const selectedOutputId = useChipLayer(state => state.selectedOutputId);
    const borderColor =  selectedOutputId ===  inputPointId ? 'yellow' : 'transparent';

    const onSetInputPoint = () => {
        useChipLayer.getState().setSelectedOutputId(inputPointId);
    }
    const setActiveInactive = () => {
        useChipLayer.getState().activateInputSource(inputPointId, !active);
    }
    const onRemovePoint = () => {
        useChipLayer.getState().removeInput(inputPointId);
    }
    if(active){
        return (
            <InputOutputPointActive 
                onDoubleClick={setActiveInactive}
                style={{ borderColor }}
                id={inputPointId}
                onClick={onSetInputPoint}
                onMouseOver={() => setIsMouseOver(true)} 
                onMouseLeave={() => setIsMouseOver(false)}
            >
                {isMouseOver && (
                    <TrashElement style={{top: '-1rem', right: '-1rem'}} onClick={onRemovePoint}/>
                )}
            </InputOutputPointActive>
        );
    }
    return (
        <InputOutputPoint
            onDoubleClick={setActiveInactive}
            style={{ borderColor }}
            id={inputPointId}
            onClick={onSetInputPoint}
            onMouseOver={() => setIsMouseOver(true)} 
            onMouseLeave={() => setIsMouseOver(false)}
        >
            {isMouseOver && (
                <TrashElement style={{top: '-1rem', right: '-1rem'}} onClick={onRemovePoint}/>
            )}
        </InputOutputPoint>
    );
}

const OutputPoint: React.FC<{outputPointId: string, active: boolean}> = ({outputPointId, active}) => { 
    const [isMouseOver, setIsMouseOver] = useState(false);   
    const wires = useChipLayer(state => state.wires);
    let bgColor = 'gray';
    const wire = wires.find(({chipInputId}) => chipInputId === outputPointId);
    if(wire?.active){
        bgColor = '#a00';
    }
    const onConnectPoint = () => {
        useChipLayer.getState().connectPoints(outputPointId);
    }

    const onRemovePoint = () => {
        useChipLayer.getState().removeOutput(outputPointId);
    }

    if(active){
        return (
            <InputOutputPointActive
                style={{
                    backgroundColor: bgColor,
                }} 
                onClick={onConnectPoint}
                id={outputPointId}
                onMouseOver={() => setIsMouseOver(true)} 
                onMouseLeave={() => setIsMouseOver(false)}
            >
                {isMouseOver && (
                    <TrashElement style={{top: '-1rem', left: '-1rem'}} onClick={onRemovePoint}/>
                )}
            </InputOutputPointActive>
        );
    }
    return (
        <InputOutputPoint
            style={{
                backgroundColor: bgColor,
            }} 
            onClick={onConnectPoint}
            id={outputPointId}
            onMouseOver={() => setIsMouseOver(true)} 
            onMouseLeave={() => setIsMouseOver(false)}
        >
            {isMouseOver && (
                <TrashElement style={{top: '-1rem', left: '-1rem'}} onClick={onRemovePoint}/>
            )}  
        </InputOutputPoint>
    );
}

export {InputPoint, OutputPoint, InputPointAdd, OutputPointAdd};
