import React from 'react';
import styled from 'styled-components';
import { IInputOutputPoint } from '../../interfaces/interfaces';
import { debounce } from '../../util/debounce';
import TrashElement from '../float-remove-btn/FloatRemoveBtn';
import useChipLayer from '../stores/useChipLayer';

const BasicInputOutputPoint = styled.div`
    width: 50px;
    height: 50px;
    background-color: #2d2d2d;
    border-radius: 50%;
    border: 1px solid transparent;
    z-index: 1;
    position: relative;
`;

const InputOutputPoint = styled(BasicInputOutputPoint)``;

const OutputPointWrap = styled(InputOutputPoint)``;

const InputPointAddBox = styled(BasicInputOutputPoint)`
    background-color: #518a8a;
    font-size: 2.4rem;
    color: white;
    text-align: center;
    cursor: pointer;
`

const InputOutputPointActive = styled(InputOutputPoint)`
    background-color: #a00;
`

const OutputPointActive = styled(OutputPointWrap)`
    background-color: #a00;
`;

interface LabelProps {
    borderColor: string;
}

const InputOutputLabel = styled.label<LabelProps>`
    width: 100px;
    height: 20px;
    background-color: #2d2d2d;
    color: white;
    border-radius: .2rem;
    padding:.2rem;
    text-align: center;
    position: absolute;
    top: 11px;
    border: 1px solid ${({borderColor}) => borderColor};
    > input[type=text] {
        color: white;
        background-color: #2d2d2d;
        border: 0px;
        width: calc(100% - .5rem);
        overflow: hidden;
    }
    display: flex;
    flex-direction: row;
    align-items: center;
`

const InputLabel = styled(InputOutputLabel)<LabelProps>`
    left: 45px;
    border-left-color: transparent;
`

const OutputLabel = styled(InputOutputLabel)<LabelProps>`
    right: 45px;
    border-left-color: ${({borderColor}) => borderColor};
`

interface LabelSpinProps {
    bgColor: string;
}

const InputLabelSpin = styled.div<LabelSpinProps>`
    width: 15px;
    height: 15px;
    background-color: ${({bgColor}) => bgColor};
    border-radius: 50%;
    margin-right: -20px;
`;

const OutputLabelSpin = styled(InputLabelSpin)`
    margin-right: 0;
    margin-left: -12px;
`;

const InnerInputLabel: React.FC<{defaultText: string, onChangeLabel: (newLabel: string) => void}> = ({defaultText, onChangeLabel}) => {
    const onChangeNameHandler = async ({target}:React.ChangeEvent<HTMLInputElement>) => {
        onChangeLabel(target.value);
    }
    return (
        <input
            type="text"
            defaultValue={defaultText}
            onClick={evt => {
                evt.preventDefault();
                evt.stopPropagation();
            }}
            onInput={debounce<React.ChangeEvent<HTMLInputElement>>(onChangeNameHandler, 500)}
        />
    )
}

const InputPointAdd: React.FC = () => {
    const addPoint = () => {
        useChipLayer.getState().addInpuPoint({
            id: '',
            active: false,
            label: '',
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
            label: '',
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

const InputPoint: React.FC<IInputOutputPoint> = ({id, active, label}) => {
    const selectedOutputId = useChipLayer(state => state.selectedOutputId);
    const isSelected = selectedOutputId ===  id;
    const borderColor =  isSelected ? 'yellow' : 'transparent';

    const onSetInputPoint = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        evt.preventDefault();
        useChipLayer.getState().setSelectedOutputId(id);
    }
    const setActiveInactive = () => {
        useChipLayer.getState().activateInputSource(id, !active);
    }
    const onRemovePoint = () => {
        useChipLayer.getState().removeInput(id);
        setTimeout(() => {
            globalThis.dispatchEvent(
                new CustomEvent('chip:move', {})
            );
        }, 10);
    }

    const onChangeLabel = (newLabel: string) => {
        useChipLayer.getState().changeInputLabel(id, newLabel);
    }

    if(active){
        return (
            <InputOutputPointActive 
                onClick={setActiveInactive}
                style={{ borderColor }}              
            >
                <InputLabel
                    borderColor={isSelected ? borderColor : '#a00'}
                >
                    <InnerInputLabel onChangeLabel={onChangeLabel} defaultText={label}/>
                    <InputLabelSpin
                        id={id}
                        onClick={onSetInputPoint}
                        bgColor={isSelected ? borderColor : '#a00'}
                    />
                 </InputLabel>
                <TrashElement top={-1} right={-1} onClick={onRemovePoint}/>
            </InputOutputPointActive>
        );
    }
    return (
        <InputOutputPoint
            onClick={setActiveInactive}
            style={{ borderColor }}
        >
            <InputLabel borderColor={borderColor}>
                <InnerInputLabel onChangeLabel={onChangeLabel} defaultText={label}/>
                <InputLabelSpin
                    id={id}
                    onClick={onSetInputPoint}
                    bgColor={isSelected ? borderColor : '#2d2d2d'}
                />
            </InputLabel>
            <TrashElement top={-1} right={-1} onClick={onRemovePoint}/>
        </InputOutputPoint>
    );
}

const OutputPoint: React.FC<IInputOutputPoint> = ({id: outputPointId, active, label}) => { 
    const wires = useChipLayer(state => state.wires);
    let bgColor = '#2d2d2d';
    const wire = wires.find(({chipInputId}) => chipInputId === outputPointId);
    if(wire?.active){
        bgColor = '#a00';
    }
    const onConnectPoint = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        evt.preventDefault();
        useChipLayer.getState().connectPoints(outputPointId);
    }

    const onRemovePoint = () => {
        useChipLayer.getState().removeOutput(outputPointId);
        setTimeout(() => {
            globalThis.dispatchEvent(
                new CustomEvent('chip:move', {})
            );
        }, 10);
    }

    const onChangeLabel = (newLabel: string) => {
        useChipLayer.getState().changeOutputLabel(outputPointId, newLabel);
    }

    if(active){
        return (
            <OutputPointActive
                style={{
                    backgroundColor: bgColor,
                }}
            >
                <OutputLabel borderColor={bgColor}>
                    <OutputLabelSpin
                        id={outputPointId}
                        onClick={onConnectPoint}
                        bgColor={bgColor}
                    />
                    <InnerInputLabel onChangeLabel={onChangeLabel} defaultText={label}/>
                </OutputLabel>
                <TrashElement top={-1} left={-1} onClick={onRemovePoint}/>
            </OutputPointActive>
        );
    }
    return (
        <OutputPointWrap
            style={{
                backgroundColor: bgColor,
            }} 
        >
            <OutputLabel borderColor={bgColor}>
                <OutputLabelSpin
                    id={outputPointId}
                    onClick={onConnectPoint}
                    bgColor={bgColor}
                />
                <InnerInputLabel onChangeLabel={onChangeLabel} defaultText={label}/>
            </OutputLabel>
            <TrashElement top={-1} left={-1} onClick={onRemovePoint}/>
        </OutputPointWrap>
    );
}

export {InputPoint, OutputPoint, InputPointAdd, OutputPointAdd};
