import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { IWire } from '../../interfaces/interfaces';
import useChipLayer from '../stores/useChipLayer';

const LineToWrap = styled.div`
    width: 1px;
    height: 100px;
    background-color: #323232;
    position: absolute;
    z-index:0;
`;

const LineTo: React.FC<IWire> = ({chipInputId, chipOutputId, id}) => {
    const elRef = useRef<HTMLDivElement>(null);
    const getOffset = ( el: HTMLElement ) => {
        var rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.pageXOffset-345,
            top: rect.top + window.pageYOffset,
            width: rect.width || el.offsetWidth,
            height: rect.height || el.offsetHeight
        };
    }

    const adjustLine = useCallback((fromElem: HTMLElement, toElem: HTMLElement, line: HTMLElement) => {
        const thickness = 4;
        var off1 = getOffset(fromElem);
        var off2 = getOffset(toElem);
        // bottom right
        var x1 = off1.left + (off1.width / 2);
        var y1 = off1.top + (off1.height / 2);
        // top right
        var x2 = off2.left + (off2.width / 2);
        var y2 = off2.top + (off2.height / 2);
        // distance
        var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
        // center
        var cx = ((x1 + x2) / 2) - (length / 2);
        var cy = ((y1 + y2) / 2) - (thickness / 2);
        // angle
        var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
        
        line.style.height = `${thickness}px`;
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.top    = `${cy}px`;
        line.style.left   = `${cx}px`;        
    }, []);

    const organizeLine = useCallback(() => {
        const line = elRef.current;
        const fromElem = document.getElementById(chipOutputId);
        const toElem =  document.getElementById(chipInputId);
        if(!!line && !!fromElem && !!toElem){
            adjustLine(
                fromElem, 
                toElem,
                line
            );
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

    return (<LineToWrap onDoubleClick={onRemoveWire} ref={elRef}/>);
}


export default LineTo;