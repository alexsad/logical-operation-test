import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { IChip, IInputOutputPoint } from '../../interfaces/interfaces';
import { Draggable, IDroppableEvent } from '../../ui/Draggable';
import colors from '../../ui/colors';
import TrashElement from '../float-remove-btn/FloatRemoveBtn';
import useChipLayer from '../stores/useChipLayer';
import useChipLayers from '../stores/useChipLayers';

const ChipWrapper = styled.div`
    width: auto;
    height: auto;
    padding: 0rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    z-index: 2;
    position: relative;
    align-items: stretch;
`;

const ChipDescription = styled.div`
    width: auto;
    color: white;
    padding: .5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-transform: uppercase;
    background-color: transparent;
    border-radius: .2rem;
    border: 2px solid ${colors['blue.300']};
    z-index: 2;
    cursor:move;
    position: relative;
`;

const ChipDescriptionName = styled.label`
    width: 100%;
    font-size: .8rem;
    overflow: hidden;
    cursor:move;
`;

const ChipDescriptionVersion = styled.label`
    width: 100%;
    font-size: .5rem;
    overflow: hidden;
    cursor:move;
`;

const ChipInputBox = styled.div`
    width: auto;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: -2;
`;

const ChipInputRightBox = styled(ChipInputBox)``;

interface ChipInputProps {
    $borderColor: string;
    $bgColor: string;
}

const ChipInputOutput = styled.div<ChipInputProps>`
    width: 10px;
    height: 10px;
    background-color: ${({ $bgColor }) => $bgColor};
    border-radius: 50%;
    margin:.4rem;
    border: 2px solid ${({ $borderColor }) => $borderColor};
    position: relative;
    z-index: 1;
    &:after{
        content: '';
        display: block;
        position: absolute;
        width: 8px;
        height: 5px;
        top: 2px;
        background-color: ${colors['blue.300']};
        z-index: -2;
    }
`;

const ChipInputPoint = styled(ChipInputOutput)`
    &:after{
        left: 10px;
    }
`;

const ChipOutputPoint = styled(ChipInputOutput)`
    &:after{
        right: 10px;
    }
`;

const ChipEndurenceWrap = styled(ChipWrapper)`

`;

const LCDChipDisplay = styled.div`
    font-family:'lcd_font';
    font-size: 3rem;
    color: ${colors['white.100']};
    margin-bottom: 0.1rem;
    width: 100%;
    text-align: center;
`;

const ChipInput: React.FC<IInputOutputPoint> = ({ id: inputId, active, label }) => {
    const bgColor = active ? colors['blue.200'] : 'transparent';
    const borderColor = active ? colors['blue.200'] : colors['blue.300'];
    const onSetInputId = () => {
        useChipLayer.getState().connectPoints(inputId);
    }

    return (
        <ChipInputPoint
            style={{
                backgroundColor: bgColor,
            }}
            $bgColor={bgColor}
            $borderColor={borderColor}
            id={inputId}
            onClick={onSetInputId}
            title={label}
        />
    );
}


const ChipOutput: React.FC<IInputOutputPoint> = ({ active, id: outputId, label }) => {
    const selectedOutputId = useChipLayer(state => state.selectedOutputId);
    const bgColor = active ? colors['blue.200'] : 'transparent';
    const borderColor = selectedOutputId === outputId ? colors['yellow.100'] : active ? colors['blue.200'] : colors['blue.300'];
    const connectPoints = () => {
        useChipLayer.getState().setSelectedOutputId(outputId);
    }

    return (
        <ChipOutputPoint
            $borderColor={borderColor}
            $bgColor={bgColor}
            onClick={connectPoints} id={outputId}
            title={label}
        />
    );
}

const LCDDisplay: React.FC<{ inputs: boolean[] }> = ({ inputs }) => {
    // const [firstInput, ...others] = inputs;
    // if(firstInput){
    //     const decimalResult = parseInt(others.map(v => v ? '1' : '0').join('') , 2);
    //     return (
    //         <LCDChipDisplay>
    //             -{8 - decimalResult}
    //         </LCDChipDisplay>
    //     );
    // }
    return (
        <LCDChipDisplay>
            {parseInt(inputs.map(v => v ? '1' : '0').join(''), 2).toString(16)}
        </LCDChipDisplay>
    );
}

const ChipEndurence: React.FC<IChip & { chipRef: React.RefObject<HTMLDivElement> }> = ({ id, name, version, inputs, outputs, originLayerId, chipRef }) => {
    const customInputs = [...inputs];
    const customOutputs = [...outputs];
    const wires = useChipLayer(state => state.wires);

    const getWireByInputId = (inputId: string) => wires.filter(({ chipInputId }) => chipInputId === inputId);
    const getWireByOutputId = (outputId: string) => wires.filter(({ chipOutputId }) => chipOutputId === outputId);
    customInputs.forEach(input => {
        const wiresIn = getWireByInputId(input.id);
        wiresIn.forEach(wire => {
            if (!!wire && wire.active) {
                input.active = wire.active;
            } else {
                input.active = false;
            }
        })
    });

    const outputProcesseds: boolean[] = [];
    const customChip = useChipLayers.getState().getLayerAsFunction(originLayerId);
    if (!!customChip) {
        outputProcesseds.push(...customChip(...customInputs.map(input => input.active)));
    }

    customOutputs.forEach((output, outputIndex) => {
        const outputProcessed = outputProcesseds[outputIndex];
        if (!!outputProcessed) {
            output.active = outputProcessed;
        } else {
            output.active = false;
        }
        const wiresOut = getWireByOutputId(output.id);
        wiresOut.forEach(wire => {
            if (!!wire && wire.active !== outputProcessed) {
                setTimeout(() => {
                    useChipLayer.getState().activateWire(wire.id, !!outputProcessed);
                }, 500);
            }
        });
    });

    const onRemoveChip = () => {
        useChipLayer.getState().removeChip(id);
    }

    return (
        <ChipEndurenceWrap>
            <ChipInputBox>
                {customInputs.map((input) => (
                    <ChipInput
                        key={`${id}_in_${input.id}`}
                        {...input}
                    />
                ))}
            </ChipInputBox>
            {originLayerId === "decimal_display" && (
                <ChipDescription ref={chipRef}>
                    <TrashElement onClick={onRemoveChip} top={-1.8} right={1.5} />
                    <LCDDisplay inputs={outputProcesseds} />
                    <ChipDescriptionVersion>version: {version}</ChipDescriptionVersion>
                </ChipDescription>
            )}
            {originLayerId !== "decimal_display" && (
                <ChipDescription ref={chipRef}>
                    <TrashElement onClick={onRemoveChip} top={-1.8} right={1.5} />
                    <ChipDescriptionName>
                        {name}
                    </ChipDescriptionName>
                    <ChipDescriptionVersion>version: {version}</ChipDescriptionVersion>
                </ChipDescription>
            )}

            <ChipInputRightBox>
                {customOutputs.map((output) => (
                    <ChipOutput
                        key={`${id}_out_${output.id}`}
                        {...output}
                    />
                ))}
            </ChipInputRightBox>
        </ChipEndurenceWrap>
    );
}


const Chip: React.FC<IChip> = (chip) => {
    const { position } = chip;

    const elRef = useRef<HTMLDivElement>(null);
    const chipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let newPosX = 0,
            newPosY = 0,
            startPosX = 0,
            startPosY = 0;

        function mouseMove(e: MouseEvent) {
            const x = e.clientX;
            const y = e.clientY;
            // calculate the new position
            newPosX = startPosX - x;
            newPosY = startPosY - y;

            // with each move we also want to update the start X and Y
            startPosX = x;
            startPosY = y;

            const el = elRef.current;
            if (el) {
                const top = (el.offsetTop - newPosY);
                const left = (el.offsetLeft - newPosX);
                // set the element's new position:
                if (top < 0 || left < 0) {
                    return;
                }
                el.style.top = top + "px";
                el.style.left = left + "px";
            }
            globalThis.dispatchEvent(
                new CustomEvent('chip:move', {})
            );
        }

        const onMouseOverHandler = (evt: MouseEvent) => {
            // event.preventDefault();

            // const evt = event as React.MouseEvent<HTMLDivElement, MouseEvent>;

            evt.preventDefault();

            // get the starting position of the cursor
            startPosX = evt.clientX;
            startPosY = evt.clientY;

            document.addEventListener("mousemove", mouseMove);

            const mouseUpHandler = function () {
                document.removeEventListener("mousemove", mouseMove);
                const el = elRef.current;
                if (el) {
                    const x = (el.offsetLeft - newPosX);
                    const y = (el.offsetTop - newPosY);
                    if (y < 0 || x < 0) {
                        return;
                    }
                    // set the element's new position:
                    useChipLayer.getState().moveChip({
                        ...chip,
                        position: {
                            x,
                            y,
                        },
                    });
                }
                document.removeEventListener("mouseup", mouseUpHandler);
            }

            document.addEventListener("mouseup", mouseUpHandler);
        }

        const chipCurrent = chipRef.current;
        if (chipCurrent) {
            chipCurrent.addEventListener('mousedown', onMouseOverHandler)
        }
        return () => {
            if (chipCurrent) {
                chipCurrent.removeEventListener('mousedown', onMouseOverHandler)
            }
        }
    }, [chip]);

    return (
        <div
            ref={elRef}
            style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
                position: 'absolute',
                zIndex: 1,
            }}
        // onMouseDown={onMouseOverHandler}
        >
            <ChipEndurence {...chip} chipRef={chipRef} />
        </div>
    );
}

const ChipPreview: React.FC<IChip> = (chip) => {
    const dragRef = useRef<HTMLDivElement>(null);
    const { id, name, version, inputs, outputs } = chip;
    const handlerDrop = (dataStr: string, event: IDroppableEvent) => {
        const { target, mousePosition } = event;
        if (target && !!dataStr) {
            if (!!dataStr) {
                try {
                    const data = JSON.parse(dataStr) as IChip;
                    data.position = {
                        x: mousePosition.x - 345,
                        y: mousePosition.y,
                    };
                    useChipLayer.getState().addChip(data);
                } catch (error) {

                }
            }
        }
    }

    const setActiveLayer = () => {
        if (['not', 'and', 'decimal_display'].includes(chip.originLayerId)) {
            return;
        }
        const layerId = chip.id;
        const { activeLayerId, setActiveLayerId, getActiveLayer, updateLayer: updateLayerOnLayers } = useChipLayers.getState();
        if (activeLayerId === layerId) {
            return;
        }
        const { updateLayer, getLayer } = useChipLayer.getState();
        const layer = getLayer();
        if (layer.version < 1) {
            updateLayerOnLayers(layer);
        }
        setActiveLayerId(layerId);
        const activeLayer = getActiveLayer();
        if (!!activeLayer) {
            updateLayer(activeLayer);
        }
    }

    return (
        <Draggable onDrop={handlerDrop} data={JSON.stringify(chip)} refElement={dragRef}>
            <ChipWrapper
                style={{
                    position: 'relative',
                    top: `0px`,
                    left: `0px`,
                }}
                onDoubleClick={setActiveLayer}
            >
                <ChipInputBox>
                    {inputs.map((input) => (
                        <ChipInput
                            key={`${id}_in_${input.id}`}
                            {...input}
                            active={false}
                        />
                    ))}
                </ChipInputBox>
                <ChipDescription ref={dragRef}>
                    <ChipDescriptionName>
                        {name}
                    </ChipDescriptionName>
                    <ChipDescriptionVersion>
                        version: {version}
                    </ChipDescriptionVersion>
                </ChipDescription>
                <ChipInputRightBox>
                    {outputs.map((output) => (
                        <ChipOutput
                            key={`${id}_out_${output.id}`}
                            {...output}
                        />
                    ))}
                </ChipInputRightBox>
            </ChipWrapper>
        </Draggable>
    );
}

export { ChipPreview };

export default Chip;