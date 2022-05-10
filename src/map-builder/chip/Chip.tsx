import React, { useRef } from 'react';
import styled from 'styled-components';
import { IChip } from '../../interfaces/interfaces';
import colors from '../../ui/colors';
import { Draggable, IDroppableEvent } from '../../ui/Draggable';
import TrashElement from '../float-remove-btn/FloatRemoveBtn';
import useChipLayer from '../stores/useChipLayer';
import useChipLayers from '../stores/useChipLayers';

const ChipWrapper = styled.div`
    width: auto;
    height: auto;
    background-color: ${colors['gray.900']};
    padding: 0rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor:move;
    border-radius: .4rem;
    border: 2px solid ${colors['black.100']};
    z-index: 0;
    position: relative;
`;

const ChipDescription = styled.div`
    width: auto;
    height: 100%;
    color: white;
    padding: .5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-transform: uppercase;
    font-size: .8rem;
`
const ChipDescriptionVersion = styled.label`
    width: 50px;
    height: 100%;
    font-size: .5rem;
    overflow: hidden;
`

const ChipInputBox = styled.div`
    width: auto;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 2;
`;

const ChipInputRightBox = styled(ChipInputBox)``;

const ChipInputOutput = styled.div`
    width: 10px;
    height: 10px;
    background-color: ${colors['gray.100']};
    border-radius: 50%;
    margin:.4rem;
    border: 1px solid transparent;
    z-index:4;
`;

const ChipEndurenceWrap = styled(ChipWrapper)`

`;

const LCDChipDisplay = styled.div`
    font-family:'lcd_font';
    font-size: 3rem;
    color: ${colors['red.100']};
    margin-bottom: 0.1rem;
    width: 100%;
    text-align: center;
`;

const ChipInput:React.FC<{inputId: string, active: boolean}> = ({inputId, active}) => {
    const bgColor = active ? colors['red.100'] : colors['gray.100'];
    const onSetInputId = () => {
        useChipLayer.getState().connectPoints(inputId);
    }

    return (
        <ChipInputOutput 
            style={{
                backgroundColor: bgColor,
            }} 
            id={inputId} 
            onClick={onSetInputId}
        />
    );
}


const ChipOutput:React.FC<{outputId: string, originLayerId: string, chipId: string, active: boolean, isSelectedOutputId: boolean}> = ({outputId, active}) => {
    const selectedOutputId = useChipLayer(state => state.selectedOutputId);
    const bgColor = active ? colors['red.100'] : colors['gray.100'];
    const borderColor =  selectedOutputId === outputId ? colors['yellow.100'] : 'transparent';

    const connectPoints = () => {
        useChipLayer.getState().setSelectedOutputId(outputId);
    }

    return (
        <ChipInputOutput style={{ borderColor, backgroundColor: bgColor }} onClick={connectPoints} id={outputId}/>
    );
}

const ChipEndurence: React.FC<IChip> = ({id, name, version, inputs, outputs, originLayerId}) => {
    const customInputs = [...inputs];
    const customOutputs = [...outputs];
    const wires = useChipLayer(state => state.wires);

    const getWireByInputId = (inputId: string) => wires.filter(({chipInputId}) => chipInputId === inputId);
    const getWireByOutputId = (outputId: string) => wires.filter(({chipOutputId}) => chipOutputId === outputId);
    customInputs.forEach(input => {
        const wiresIn = getWireByInputId(input.id);
        wiresIn.forEach(wire => {
            if(!!wire && wire.active){
                input.active = wire.active;
            }else{
                input.active = false;
            }
        })
    });

    const outputProcesseds: boolean[] = [];
    const customChip = useChipLayers.getState().getLayerAsFunction(originLayerId);
    if(!!customChip){
        outputProcesseds.push(...customChip(...customInputs.map(input => input.active)));
    }

    customOutputs.forEach((output, outputIndex) => {
        const outputProcessed = outputProcesseds[outputIndex];
        if(!!outputProcessed){
            output.active = outputProcessed;
        }else{
            output.active = false;
        }
        const wiresOut = getWireByOutputId(output.id);
        wiresOut.forEach(wire => {
            if(!!wire && wire.active !== outputProcessed){
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
            <TrashElement onClick={onRemoveChip} top={-1.5} right={-1.5}/>
            <ChipInputBox>
                {customInputs.map((input) => (
                    <ChipInput 
                        key={`${id}_in_${input.id}`} 
                        inputId={input.id}
                        active={input.active}
                    />
                ))}
            </ChipInputBox>
            {originLayerId === 'binary_display' && ( 
                <ChipDescription>            
                    <LCDChipDisplay>
                        {parseInt( outputProcesseds.map(v => v ? '1' : '0').join('') , 2)}
                    </LCDChipDisplay>
                    <ChipDescriptionVersion>version: {version}</ChipDescriptionVersion>
                </ChipDescription>
            )}
            {originLayerId !== 'binary_display' && (
                <ChipDescription>
                    {name}
                    <ChipDescriptionVersion>version: {version}</ChipDescriptionVersion>
                </ChipDescription>
            )}

            <ChipInputRightBox>
                {customOutputs.map((output) => (
                    <ChipOutput 
                        key={`${id}_out_${output.id}`} 
                        chipId={id} 
                        originLayerId={originLayerId} 
                        outputId={output.id}
                        active={output.active}
                        isSelectedOutputId={true}
                    />
                ))}
            </ChipInputRightBox>
        </ChipEndurenceWrap>
    );
}


const Chip: React.FC<IChip> = (chip) => {
    const {position} = chip;
    let newPosX = 0, newPosY = 0, startPosX = 0, startPosY = 0;
    const elRef = useRef<HTMLDivElement>(null);

    function mouseMove(e: MouseEvent) {
        // calculate the new position
        newPosX = startPosX - e.clientX;
        newPosY = startPosY - e.clientY;
    
        // with each move we also want to update the start X and Y
        startPosX = e.clientX;
        startPosY = e.clientY;

        const el = elRef.current;
        if(el){
            // set the element's new position:
            el.style.top = (el.offsetTop - newPosY) + "px";
            el.style.left = (el.offsetLeft - newPosX) + "px";
        }
        globalThis.dispatchEvent(
            new CustomEvent('chip:move', {})
        );
    }
    const onMouseOverHandler = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        evt.preventDefault();
    
        // get the starting position of the cursor
        startPosX = evt.clientX;
        startPosY = evt.clientY;
        
        document.addEventListener("mousemove", mouseMove);

        const mouseUpHandler = function(){
            document.removeEventListener("mousemove", mouseMove);
            const el = elRef.current;
            if(el){
                // set the element's new position:
                useChipLayer.getState().moveChip({
                    ...chip,
                    position: {
                        x: (el.offsetLeft - newPosX),
                        y: (el.offsetTop - newPosY),
                    },
                });
            }
            document.removeEventListener("mouseup", mouseUpHandler);
        }
        
        document.addEventListener("mouseup", mouseUpHandler);
    }

    return (
        <div 
            ref={elRef} 
            style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
                position: 'absolute',
                zIndex: 1,
            }} 
            onMouseDown={onMouseOverHandler}
        >
            <ChipEndurence {...chip}/>
        </div>
    );
}

const ChipPreview: React.FC<IChip> = (chip) => {
    const dragRef = useRef<HTMLDivElement>(null);
    const {id, name, version, inputs, outputs, originLayerId} = chip;
    const handlerDrop = (dataStr: string, event: IDroppableEvent) => {
        const { target, mousePosition } = event;
        if(target && !!dataStr){
            if(!!dataStr){
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
        if(['not', 'and', 'binary_display'].includes(chip.originLayerId)){
            return;
        }
        const layerId = chip.id;
        const {activeLayerId, setActiveLayerId, getActiveLayer, updateLayer: updateLayerOnLayers} = useChipLayers.getState();
        if(activeLayerId === layerId){
            return;
        }
        const {updateLayer, getLayer} = useChipLayer.getState();
        const layer = getLayer();
        if(layer.version < 1){
            updateLayerOnLayers(layer);
        }
        setActiveLayerId(layerId);
        const activeLayer = getActiveLayer();
        if(!!activeLayer){
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
                ref={dragRef}
                onDoubleClick={setActiveLayer}
            >
                <ChipInputBox>
                    {inputs.map((input) => (
                        <ChipInput 
                            key={`${id}_in_${input.id}`}
                            inputId={input.id}
                            active={input.active}
                        />
                    ))}
                </ChipInputBox>
                <ChipDescription>
                        {name}
                    <ChipDescriptionVersion>
                        version: {version}
                    </ChipDescriptionVersion>
                </ChipDescription>
                <ChipInputRightBox>
                    {outputs.map((output) => (
                        <ChipOutput 
                            key={`${id}_out_${output.id}`}
                            chipId={id}
                            originLayerId={originLayerId}
                            outputId={output.id}
                            active={output.active}
                            isSelectedOutputId={false}
                        />
                    ))}
                </ChipInputRightBox>
            </ChipWrapper>
        </Draggable>
    );
}

export {ChipPreview}

export default Chip;