import React from 'react';
import styled from 'styled-components';
import useChipLayers from '../stores/useChipLayers';

const InputOutputPoint = styled.div`
    width: 50px;
    height: 50px;
    background-color: gray;
    border-radius: 50%;
    border: 1px solid transparent;
`
const InputPointAddBox = styled(InputOutputPoint)`
    background-color: #518a8a;
    font-size: 2.4rem;
    color: white;
    text-align: center;
    cursor: pointer;
`

const InputOutputPointActive = styled(InputOutputPoint)`
    background-color: red;
`

const InputPointAdd: React.FC = () => {
    const addPoint = () => {
        useChipLayers.getState().addInpuPoint({
            id: '',
            active: false,
        });
    }
    return (
        <InputPointAddBox onClick={addPoint}>+</InputPointAddBox>
    );
}

const OutputPointAdd: React.FC = () => {
    const addPoint = () => {
        useChipLayers.getState().addOutPoint({
            id: '',
            active: false,
        });
    }
    return (
        <InputPointAddBox onClick={addPoint}>+</InputPointAddBox>
    );
}

const InputPoint: React.FC<{inputPointId: string, active: boolean}> = ({inputPointId, active}) => {
    const {selectedOutputId, setSelectedOutputId, activeInputSource} = useChipLayers();
    const borderColor =  selectedOutputId === inputPointId ? 'yellow' : 'transparent';
    const onSetInputPoint = () => {
        setSelectedOutputId(inputPointId);
    }
    const setActiveInactive = () => {
        activeInputSource(inputPointId, !active);
    }
    if(active){
        return (<InputOutputPointActive onDoubleClick={setActiveInactive} style={{ borderColor }} id={inputPointId} onClick={onSetInputPoint}/>);
    }
    return (<InputOutputPoint onDoubleClick={setActiveInactive} style={{ borderColor }} id={inputPointId} onClick={onSetInputPoint}/>);
}

const OutputPoint: React.FC<{outputPointId: string, active: boolean}> = ({outputPointId, active}) => {
    const {connectPoints, getActiveLayer} = useChipLayers();
    const activeLayer = getActiveLayer();
    let bgColor = 'gray';

    if(activeLayer){
        const {wires} = activeLayer;
        const wire = wires.find(({chipInputId}) => chipInputId === outputPointId);
        if(wire?.active){
            bgColor = 'red';
        }
    }

    const onConnectPoint = () => {
        connectPoints(outputPointId);
    }
    if(active){
        return (
            <InputOutputPointActive
                style={{
                    backgroundColor: bgColor,
                }} 
                onClick={onConnectPoint}
                id={outputPointId}
            />
        );
    }
    return (
        <InputOutputPoint
            style={{
                backgroundColor: bgColor,
            }} 
            onClick={onConnectPoint}
            id={outputPointId}
        />
    );
}

export {InputPoint, OutputPoint, InputPointAdd, OutputPointAdd};
