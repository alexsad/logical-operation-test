import React, { useState } from 'react';
import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';
import { IInputOutputPoint } from '../../interfaces/interfaces';
import colors from '../../ui/colors';
import TrashElement from '../float-remove-btn/FloatRemoveBtn';
import useChipLayer from '../stores/useChipLayer';

const BasicInputOutputPoint = styled.div`
    width: 45px;
    height: 45px;
    background-color: ${colors['blue.300']};
    border-radius: 50%;
    border: 4px solid transparent;
    z-index: 2;
    position: relative;
`;

const InputOutputPoint = styled(BasicInputOutputPoint)``;

const OutputPointWrap = styled(InputOutputPoint)``;

const InputPointAddBox = styled(BasicInputOutputPoint)`
    background-color: ${colors['blue.300']};
    font-size: 2.4rem;
    color: white;
    text-align: center;
    cursor: pointer;
    padding:0;
    padding-top: 0rem;

    > label {
        padding: 0;
    }

`;

interface LabelProps {
    $borderColor: string;
}

const InputOutputLabel = styled.label<LabelProps>`
    width: 100px;
    height: 20px;
    background-color: ${colors['blue.300']};
    color: white;
    padding:.2rem;
    text-align: center;
    position: absolute;
    top: 9px;
    border: 1px solid ${({ $borderColor }) => $borderColor};
    display: flex;
    flex-direction: row;
    align-items: center;
    > input[type=text] {
        color: white;
        background-color: ${colors['blue.300']};
        border: 0px;
        width: calc(100% - .5rem);
        overflow: hidden;
    }
`

const InputLabel = styled(InputOutputLabel) <LabelProps>`
    left: 45px;
    border-left-color: transparent;
    border-radius: 0 .2rem .2rem 0;
`

const OutputLabel = styled(InputOutputLabel) <LabelProps>`
    right: 45px;
    border-left-color: ${({ $borderColor }) => $borderColor};
    border-radius: .2rem 0 0 .2rem;
`

interface LabelSpinProps {
    $bgColor: string;
    $active: boolean;
}

const InputLabelSpin = styled.div<LabelSpinProps>`
    width: 15px;
    height: 15px;
    background-color: ${({ $bgColor }) => $bgColor};
    filter:blur(${({ $active }) => $active ? '2px' : '0px'}px);
    border-radius: 50%;
    margin-right: -20px;
    border: 2px solid ${({ $bgColor }) => $bgColor};
`;

const OutputLabelSpin = styled(InputLabelSpin)`
    margin-right: 0;
    margin-left: -15px;
`;

const InnerInputLabel: React.FC<{ defaultText: string, onChangeLabel: (newLabel: string) => void }> = ({ defaultText, onChangeLabel }) => {

    const debounceChangeChipName = useDebouncedCallback(async (value) => {
        onChangeLabel(value);
    }, 500);

    const onChangeNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        debounceChangeChipName(event.target.value);
    }

    return (
        <input
            type="text"
            defaultValue={defaultText}
            onClick={evt => {
                evt.preventDefault();
                evt.stopPropagation();
            }}
            onInput={onChangeNameHandler}
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
        <InputPointAddBox onClick={addPoint}>
            <label>+</label>
        </InputPointAddBox>
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
        <InputPointAddBox onClick={addPoint}>
            <label>+</label>
        </InputPointAddBox>
    );
}

const InputPoint: React.FC<IInputOutputPoint> = ({ id, active, label }) => {
    const selectedOutputId = useChipLayer(state => state.selectedOutputId);
    const [isActive, setIsActive] = useState(false);
    const isSelected = selectedOutputId === id;
    const onSetInputPoint = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        evt.preventDefault();
        useChipLayer.getState().setSelectedOutputId(id);
    }
    const setActiveInactive = () => {
        setIsActive(oldState => !oldState);
        useChipLayer.getState().activateInputSource(id, !isActive);
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
    const outBorderColor = isSelected ? colors['yellow.100'] : isActive ? colors['blue.300'] : colors['blue.300'];
    const innerBGColor = isActive ? colors['blue.300'] : 'transparent';
    const innerSpinBGColor = isActive ? colors['blue.200'] : colors['blue.300'];
    return (
        <InputOutputPoint
            onClick={setActiveInactive}
            style={{
                borderColor: outBorderColor,
                backgroundColor: innerBGColor,
            }}
        >
            <InputLabel $borderColor={outBorderColor}>
                <InnerInputLabel onChangeLabel={onChangeLabel} defaultText={label} />
                <InputLabelSpin
                    id={id}
                    onClick={onSetInputPoint}
                    $bgColor={innerSpinBGColor}
                    $active={isActive}
                />
            </InputLabel>
            <TrashElement top={-1} right={-1} onClick={onRemovePoint} />
        </InputOutputPoint>
    );
}

const OutputPoint: React.FC<IInputOutputPoint> = ({ id: outputPointId, active, label }) => {
    const wires = useChipLayer(state => state.wires);
    let isActive = false;
    const wire = wires.find(({ chipInputId }) => chipInputId === outputPointId);
    if (wire?.active) {
        isActive = true;
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
    const outBorderColor = isActive ? colors['blue.300'] : colors['blue.300'];
    const innerBGColor = isActive ? colors['blue.300'] : 'transparent';
    const innerSpinBGColor = isActive ? colors['blue.200'] : colors['blue.300'];
    return (
        <OutputPointWrap
            style={{
                borderColor: outBorderColor,
                backgroundColor: innerBGColor,
            }}
        >
            <OutputLabel $borderColor={outBorderColor}>
                <OutputLabelSpin
                    id={outputPointId}
                    onClick={onConnectPoint}
                    $bgColor={innerSpinBGColor}
                    $active={isActive}
                />
                <InnerInputLabel onChangeLabel={onChangeLabel} defaultText={label} />
            </OutputLabel>
            <TrashElement top={-1} left={-1} onClick={onRemovePoint} />
        </OutputPointWrap>
    );
}

export { InputPoint, InputPointAdd, OutputPoint, OutputPointAdd };

