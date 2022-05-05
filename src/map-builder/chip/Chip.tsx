import React, { useRef } from 'react';
import styled from 'styled-components';
import { IChip } from '../../interfaces/interfaces';
import useChipLayers from '../stores/useChipLayers';

const ChipWrapper = styled.div`
    width: auto;
    height: auto;
    background-color: #4d4d4d;
    padding: 0rem;
    position: absolute;
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

const ChipInput:React.FC<{inputId: string, active: boolean}> = ({inputId, active}) => {
    const bgColor = active ? 'red' : 'gray';
    const onSetInputId = () => {
        useChipLayers.getState().connectPoints(inputId);
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


const ChipOutput:React.FC<{outputId: string, originLayerId: string, chipId: string, active: boolean, isSelectedOutputId: boolean}> = ({outputId, originLayerId, chipId, active, isSelectedOutputId}) => {
    const bgColor = active ? 'red' : 'gray';
    // const {selectedOutputId, setSelectedOutputId, getActiveLayer, activeWire, getLayerAsFunction} = useChipLayers();
    const borderColor =  isSelectedOutputId ? 'yellow' : 'transparent';
    // let backgroundColor = 'gray';
    // const setActiveBackgrounColor = (active: boolean) => {
    //     backgroundColor = active ? 'red' : 'gray';
    // }
    // const activeLayer = getActiveLayer();
    // if(activeLayer){
    //     if(['not', 'and'].includes(originLayerId)){
    //         const {wires, chips} = activeLayer;
    //         const chip = chips.find(chip => chip.id === chipId);
    //         if(chip){
    //             const [firstInput, secondInput] = chip.inputs;
    //             if(firstInput){
    //                 if(originLayerId === 'not'){
    //                     const wireOut = wires.find(({chipOutputId}) => outputId === chipOutputId);
    //                     const wireIn = wires.find(({chipInputId}) => firstInput.id === chipInputId);
    //                     if(!!wireOut && wireOut.active === wireIn?.active){
    //                         setActiveBackgrounColor(!wireIn?.active);
    //                         activeWire(wireOut.id, !wireIn?.active);
    //                     }
    //                 }else if(originLayerId === 'and' && !!secondInput){
    //                     const wireOut = wires.find(({chipOutputId}) => outputId === chipOutputId);
    //                     const wiresIn = wires.filter(({chipInputId}) => [firstInput.id, secondInput.id].includes(chipInputId) );
    //                     const allTrue = !!(wiresIn.every(wire => wire.active) && wiresIn.length === 2);
    //                     if(!!wireOut && wireOut.active !== allTrue){
    //                         setActiveBackgrounColor(allTrue);
    //                         activeWire(wireOut.id, allTrue);
    //                     }
    //                 }
    //             }
    //         }
    //     }else{
    //         // // is a commom chip
    //         // const customChip = getLayerAsFunction(originLayerId);
    //         // // console.log('common?:',  customChip.call(LAYER_FNS, true, true, true));
    //         // if(!!customChip){
    //         //     console.log('ja tem?:', customChip, customChip(true, true, true));
    //         // }
    //     }
    // }


    const connectPoints = () => {
        useChipLayers.getState().setSelectedOutputId(outputId);
    }

    return (
        <ChipInputOutput style={{ borderColor, backgroundColor: bgColor }} onClick={connectPoints} id={outputId}/>
    );
}

const ChipEndurence: React.FC<IChip> = (chip) => {
    const {id, name, version, inputs, outputs, originLayerId} = chip;
    const {getActiveLayer, getLayerAsFunction, activeWire} = useChipLayers();
    const activeLayer = getActiveLayer();
    const customInputs = [...inputs];
    const customOutputs = [...outputs];
    if(activeLayer){
        const {wires} = activeLayer;
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
        const customChip = getLayerAsFunction(originLayerId);
        if(!!customChip){
            outputProcesseds.push(...customChip( ...customInputs.map(input => input.active)));
            console.log('ja tem?:', customChip, customChip( ...customInputs.map(input => input.active)  ));
            // output.active = wire.active;
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
                activeWire(wire.id, !!outputProcessed);
            }
        });
        
    }


    return (
        <>
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
        </>
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
                useChipLayers.getState().moveChip({
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
        <ChipWrapper ref={elRef} style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
        }} onMouseDown={onMouseOverHandler}>
            <ChipEndurence {...chip}/>
        </ChipWrapper>
    );
}

const ChipPreview: React.FC<IChip> = (chip) => {
    const {id, name, version, inputs, outputs, originLayerId} = chip;
    const onDoubleClick = () => {
        const newChipId = `chip_inst_${new Date().getTime()}`;
        useChipLayers.getState().addChip({
            ...chip,
            ...{
                id: newChipId,
                outputs: chip.outputs.map((output, output_index) => ({
                    ...output,
                    id: `${newChipId}_${output_index}_out`,
                })),
                inputs: chip.inputs.map((input, input_index) => ({
                    ...input,
                    id: `${newChipId}_${input_index}_inp`,
                }))
            }
        });
    }

    return (
        <ChipWrapper 
            style={{
                position: 'relative',
                top: `0px`,
                left: `0px`,
            }}
            onDoubleClick={onDoubleClick}
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
    );
}

export {ChipPreview}

export default Chip;