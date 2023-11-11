import React, { useEffect, useRef } from 'react';
import dropCursor from './assets/cursor/chip_icon_32x32.png';
import styled from 'styled-components';
import { ReactProps } from '../interfaces/interfaces';

export interface IDroppableEvent {
    target: HTMLElement,
    currentTarget?: EventTarget & HTMLElement | null;
    mousePosition: {
        x: number,
        y: number,
    },
}

export interface IDraggable {
    data: string;
    refElement: React.RefObject<HTMLElement>;
    onDrop?: (data: string, event: IDroppableEvent) => void,
}

export interface IDroppable {
    onDrop: (data: string, event: IDroppableEvent) => void,
    refElement: React.RefObject<HTMLElement>;
}

const DraggableImg = styled.img`
    position: fixed;
    z-index: 99999;
    display: none;
`;

// let touchDataTransfer = '';
const TOUCH_DROP_EVENT = 'TOUCH:DROP';
const DROP_END_EVENT = 'DROP:END';

const Draggable: React.FC<IDraggable & ReactProps> = ({children, refElement, data, onDrop}) => {
    const refDragImag = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const currentElement = refElement.current;
        if(currentElement){
            currentElement.setAttribute('draggable', 'true');
        }
        function onDragStartHandler (evt: DragEvent) {
            if(!evt.dataTransfer){
                return;
            }
            const dragImg = new Image();
            dragImg.src = dropCursor;
            evt.dataTransfer.setDragImage(dragImg, 15, 15);
            evt.dataTransfer.setData("text", data);
        }

        function onDrag (evt: Event) {
            evt.preventDefault();
        }

        function onTouchMove (evt: TouchEvent) {
            const imageElement = refDragImag.current;
            if(evt.targetTouches && imageElement){
                const touch = evt.targetTouches[0]; 
                imageElement.style.left = touch.pageX-10 + 'px';
                imageElement.style.top = touch.pageY-10 + 'px';
            }
            // evt.preventDefault();
        }

        function onTouchStart (evt: TouchEvent) {
            // touchDataTransfer = data;
            const imageElement = refDragImag.current;
            if(imageElement){
                const touch = evt.targetTouches[0];
                imageElement.style.left = touch.pageX-10 + 'px';
                imageElement.style.top = touch.pageY-10 + 'px';
                imageElement.style.display = 'block';
            }
            // evt.preventDefault();
        }

        function onTouchEnd (event: TouchEvent) {
            // event.preventDefault();
            const imageElement = refDragImag.current;
            if(imageElement){
                imageElement.style.display = 'none';
                const target = event.target as HTMLElement;
                if(data && target){
                    const evt = event.changedTouches[0];
                    const { pageX, pageY } = evt;
                    const dropElement = document.elementFromPoint(pageX, pageY);
                    
                    if(dropElement){
                        const detail = { 
                            text: data,
                            event: { 
                                target: dropElement,
                                mousePosition: {
                                    x: evt.clientX,
                                    y: evt.clientY,
                                }
                            } as IDroppableEvent,
                        };

                        if(onDrop){
                            onDrop(detail.text, detail.event);
                        }

                        dropElement.dispatchEvent(
                            new CustomEvent(TOUCH_DROP_EVENT, { 
                                detail,
                                bubbles: true,
                            })
                        );
                    }
                }
            }
        }

        function onDropEndHandler(e: Event){
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            const {detail} = e as CustomEvent<{text: string, event: IDroppableEvent}>;
            if(detail && detail.text && onDrop){
                onDrop(detail.text, detail.event);
            }
        }
    
        if(currentElement){
            currentElement.addEventListener('drag', onDrag);
            currentElement.addEventListener('dragstart', onDragStartHandler);
            currentElement.addEventListener('touchmove', onTouchMove,  {passive: true});
            currentElement.addEventListener('touchstart', onTouchStart,  {passive: true});
            currentElement.addEventListener('touchend', onTouchEnd,  {passive: true});
            globalThis.addEventListener(DROP_END_EVENT, onDropEndHandler);
        }

        return () => {
            if(currentElement){
                currentElement.removeEventListener('drag', onDrag);
                currentElement.removeEventListener('dragstart', onDragStartHandler);
                currentElement.removeEventListener('touchmove', onTouchMove);
                currentElement.removeEventListener('touchstart', onTouchStart);
                currentElement.removeEventListener('touchend', onTouchEnd);
                globalThis.removeEventListener(DROP_END_EVENT, onDropEndHandler);
            }
        }

    }, [refElement, data, onDrop]);

    return (
        <>
            <DraggableImg alt="teste" src={dropCursor} ref={refDragImag}/>
            {children}
        </>
    );
}

const Droppable: React.FC<IDroppable & ReactProps> = ({children, refElement, onDrop}) => {

    useEffect(() => {
        const currentElement = refElement.current;
        function onDragOver (evt: Event) {
            evt.preventDefault();
        }

        function onDropHandler (evt: DragEvent) {
            evt.preventDefault();
            if(!evt.dataTransfer){
                return;
            }
            const dataText = evt.dataTransfer.getData("text");
            if(dataText){
                const target = evt.target as HTMLDivElement;
                const {currentTarget} = evt;              
                onDrop(dataText, {
                    target, 
                    currentTarget: currentTarget as HTMLElement | null,
                    mousePosition: {
                        x: evt.clientX,
                        y: evt.clientY,
                    },
                });

                const detail = { 
                    text: dataText,
                    event: { 
                        target,
                        mousePosition: {
                            x: evt.clientX,
                            y: evt.clientY,
                        },
                    } as IDroppableEvent,
                };

                globalThis.dispatchEvent(
                    new CustomEvent(DROP_END_EVENT, { 
                        detail,
                        bubbles: true,
                    })
                );
            }
        }

        function onTouchDropEvent (e: Event) {
            const {detail} = e as CustomEvent<{text: string, event: IDroppableEvent}>;
            if(detail && detail.text){
                onDrop(detail.text, detail.event);
            }
        }

    
        if(currentElement){
            currentElement.addEventListener('dragover', onDragOver, false);
            currentElement.addEventListener('drop', onDropHandler, false);
            currentElement.addEventListener(TOUCH_DROP_EVENT, onTouchDropEvent);
        }

        return () => {
            if(currentElement){
                currentElement.removeEventListener('dragover', onDragOver);
                currentElement.removeEventListener('drop', onDropHandler);
                currentElement.removeEventListener(TOUCH_DROP_EVENT, onTouchDropEvent);
            }
        }
    }, [refElement, onDrop]);

    return (
        <>
            {children}
        </>
    );
}

export {Draggable, Droppable};