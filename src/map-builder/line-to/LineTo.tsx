import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IWire } from '../../interfaces/interfaces';
import colors from '../../ui/colors';
import { SimpleTrashElement } from '../float-remove-btn/FloatRemoveBtn';
import useChipLayer from '../stores/useChipLayer';

const LineToWrap = styled.div`
    width: 1px;
    height: 100px;
    box-sizing: border-box;
    background-color: ${colors['blue.300']};
    position: absolute;
    z-index: 0;
    border: .5px solid transparent;
    border-left-width: 0px;
    border-right-width: 0px;
    border-radius: 4px;
`;

const LineToBox = styled.div`
    width: 30px;
    height: 30px;
    position: absolute;
    z-index: 1;
`;

const LineTo: React.FC<IWire> = ({chipInputId, chipOutputId, id, active}) => {
    const [isSelected, setIsSelected] = useState(false);
    const elRef = useRef<HTMLDivElement>(null);
    const helperElRef = useRef<HTMLDivElement>(null);
    const getOffset = ( el: HTMLElement ) => {
        var rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.pageXOffset,
            top: rect.top + window.pageYOffset,
            width: rect.width || el.offsetWidth,
            height: rect.height || el.offsetHeight
        };
    }

    const adjustLine = useCallback((fromElem: HTMLElement, toElem: HTMLElement, line: HTMLElement, boxParent: HTMLElement) => {
        const boxParentRect = boxParent.getBoundingClientRect(); 
        const thickness = 4;
        const off1 = getOffset(fromElem);
        const off2 = getOffset(toElem);
        // bottom right
        const x1 = off1.left + (off1.width / 1) + (boxParent.scrollLeft - boxParentRect.left - 70);
        const y1 = off1.top + (off1.height / 2) + (boxParent.scrollTop - boxParentRect.top);
        // top right
        const x2 = off2.left + (off2.width / 5) + (boxParent.scrollLeft - boxParentRect.left - 70);
        const y2 = off2.top + (off2.height / 2) + (boxParent.scrollTop - boxParentRect.top);
        // distance
        const length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
        // center
        const cx = ((x1 + x2) / 2) - (length / 2);
        const cy = ((y1 + y2) / 2) - (thickness / 2);
        // angle
        const angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
        
        line.style.height = `${thickness}px`;
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.top    = `${cy}px`;
        line.style.left   = `${cx}px`;
        return {
            x: cx + (length/2),
            y: cy,  
        }
    }, []);

    const organizeLine = useCallback(() => {
        const line = elRef.current;
        const fromElem = document.getElementById(chipOutputId);
        const toElem =  document.getElementById(chipInputId);
        const boxParent = document.getElementById('center_panel_box');

        if(!!line && !!fromElem && !!toElem && !!boxParent){
            const {x,y} = adjustLine(
                fromElem, 
                toElem,
                line,
                boxParent,
            );

            const helper = helperElRef.current;
            if(!!helper){
                helper.style.top = `${y}px`;
                helper.style.left = `${x}px`;
            }
        }
    }, [chipInputId, chipOutputId, adjustLine]);

    useEffect(() => {
        organizeLine();
    }, [organizeLine]);

    useEffect(() => {
        globalThis.addEventListener('chip:move', organizeLine);
        return () => {
            globalThis.removeEventListener('chip:move', organizeLine);
        }
    }, [organizeLine]);

    const onRemoveWire = () => {
        useChipLayer.getState().removeWire(id)
    }

    const onClick = () => {
        setIsSelected(!isSelected);
    }

    return (
        <>
            <LineToWrap 
                style={{backgroundColor: active ? colors['blue.200'] : colors['blue.300'], borderColor: isSelected ? colors['yellow.100'] : 'transparent'}}
                ref={elRef}
                onClick={onClick}
            />
            <LineToBox style={{display: isSelected ? 'block' : 'none'}} ref={helperElRef}>
                {isSelected && (
                    <SimpleTrashElement onClick={onRemoveWire}/>
                )}
            </LineToBox>
        </>

    );
}


export default LineTo;