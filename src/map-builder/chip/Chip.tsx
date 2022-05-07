import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { IChip } from '../../interfaces/interfaces';
import { Draggable, IDroppableEvent } from '../../ui/Draggable';
import TrashElement from '../float-remove-btn/FloatRemoveBtn';
import useChipLayer from '../stores/useChipLayer';
import useChipLayers from '../stores/useChipLayers';

const ChipWrapper = styled.div`
    width: auto;
    height: auto;
    background-color: #4d4d4d;
    padding: 0rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    top:150px;
    left:150px;
    cursor:move;
    border-radius: .4rem;
    border: 2px solid #181818;
    z-index:1;
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
`;

const ChipInputRightBox = styled(ChipInputBox)``;

const ChipInputOutput = styled.div`
    width: 10px;
    height: 10px;
    background-color: gray;
    border-radius: 50%;
    margin:.4rem;
    border: 1px solid transparent;
`;

const ChipEndurenceWrap = styled(ChipWrapper)`

`;

const ChipInput:React.FC<{inputId: string, active: boolean}> = ({inputId, active}) => {
    const bgColor = active ? '#a00' : 'gray';
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
    const bgColor = active ? '#a00' : 'gray';
    const borderColor =  selectedOutputId === outputId ? 'yellow' : 'transparent';

    const connectPoints = () => {
        useChipLayer.getState().setSelectedOutputId(outputId);
    }

    return (
        <ChipInputOutput style={{ borderColor, backgroundColor: bgColor }} onClick={connectPoints} id={outputId}/>
    );
}

const ChipEndurence: React.FC<IChip> = ({id, name, version, inputs, outputs, originLayerId}) => {
    const [isMouseOver, setIsMouseOver] = useState(false);
    const customInputs = [...inputs];
    const customOutputs = [...outputs];
    const wires = useChipLayer(state => state.wires);

    const getWireByInputId = (inputId: string) => wires.find(({chipInputId}) => chipInputId === inputId);
    const getWireByOutputId = (outputId: string) => wires.find(({chipOutputId}) => chipOutputId === outputId);
    customInputs.forEach(input => {
        const wire = getWireByInputId(input.id);
        if(!!wire && wire.active){
            input.active = wire.active;
        }else{
            input.active = false;
        }
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
        const wire = getWireByOutputId(output.id);
        if(!!wire && wire.active !== outputProcessed){
            setTimeout(() => {
                useChipLayer.getState().activateWire(wire.id, !!outputProcessed);
            }, 1000);
        }
    });

    const onRemoveChip = () => {
        useChipLayer.getState().removeChip(id);
    }

    return (
        <ChipEndurenceWrap onMouseOver={() => setIsMouseOver(true)} onMouseLeave={() => setIsMouseOver(false)}>
            {isMouseOver && (
                <TrashElement onClick={onRemoveChip} style={{top: '-1.5rem', right: '-1rem'}}/>
            )}
            <ChipInputBox>
                {customInputs.map((input) => (
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
                    {version}_{id}
                </ChipDescriptionVersion>
            </ChipDescription>
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
    const newChip = (pchip: IChip) => {
        const newChipId = `chip_inst_${new Date().getTime()}`;
        return {
            ...pchip,
            ...{
                id: newChipId,
                outputs: pchip.outputs.map((output, output_index) => ({
                    ...output,
                    id: `${newChipId}_${output_index}_out`,
                })),
                inputs: pchip.inputs.map((input, input_index) => ({
                    ...input,
                    id: `${newChipId}_${input_index}_inp`,
                }))
            }
        }
    }

    return (
        <Draggable onDrop={handlerDrop} data={JSON.stringify(newChip(chip))} refElement={dragRef}>
            <ChipWrapper 
                style={{
                    position: 'relative',
                    top: `0px`,
                    left: `0px`,
                }}
                ref={dragRef}
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
                        {version}_{id}
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