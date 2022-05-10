import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IWire } from '../../interfaces/interfaces';
import { SimpleTrashElement } from '../float-remove-btn/FloatRemoveBtn';
import useChipLayer from '../stores/useChipLayer';

const LineToWrap = styled.div`
    width: 1px;
    height: 100px;
    box-sizing: border-box;
    background-color: #2d2d2d;
    position: absolute;
    z-index: 1;
    border: .5px solid transparent;
    border-left-width: 0px;
    border-right-width: 0px;
`;

const LineToBox = styled.div`
    width: 50px;
    height: 50px;
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
            left: rect.left + window.pageXOffset-345,
            top: rect.top + window.pageYOffset-54,
            width: rect.width || el.offsetWidth,
            height: rect.height || el.offsetHeight
        };
    }

    const adjustLine = useCallback((fromElem: HTMLElement, toElem: HTMLElement, line: HTMLElement) => {
        const thickness = 4;
        const off1 = getOffset(fromElem);
        const off2 = getOffset(toElem);
        // bottom right
        const x1 = off1.left + (off1.width / 2);
        const y1 = off1.top + (off1.height / 2);
        // top right
        const x2 = off2.left + (off2.width / 2);
        const y2 = off2.top + (off2.height / 2);
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
        if(!!line && !!fromElem && !!toElem){
            const {x,y} = adjustLine(
                fromElem, 
                toElem,
                line
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
                style={{backgroundColor: active ? '#a00' : '#2d2d2d', borderColor: isSelected ? 'yellow' : 'transparent'}}
                ref={elRef}
                onClick={onClick}
            >
                
            </LineToWrap>
            <LineToBox ref={helperElRef}>
                {isSelected && (
                    <SimpleTrashElement onClick={onRemoveWire}/>
                )}
            </LineToBox>
        </>

    );
}


export default LineTo;