import { useEffect, useState } from 'react';
import styled from 'styled-components';
import colors from '../../ui/colors';
import trashIcon from '../assets/trash-10-16.png';

const SimpleTrashElement = styled.div`
    position: absolute;
    width: 2rem;
    height: 2rem;
    background-color: ${colors['red.100']};
    background-image: url(${trashIcon});
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 50%;
    cursor: pointer;
    z-index: 3;
`;

const TrashTransparentBox = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top:0;
    bottom:0;
`;

const TrashElement: React.FC<{
    onClick: () => void,
    top: number,
    left?: number,
    right?: number,
}> = ({onClick, top, left, right}) => {
    const [parentRef, setParentRef] = useState(null as null | HTMLDivElement);
    const [isVisible, setIsVisible] = useState(false);
    const style = {
        top: `${top}rem`,
        opacity: 1,
    } as React.CSSProperties;

    if(typeof left === 'number'){
        style.left = `${left}rem`;
    }else if(typeof right === 'number'){
        style.right = `${right}rem`;
    }

    useEffect(() => {
        const onClickParent = (evt: MouseEvent) => {
            const target = evt.target as HTMLElement;
            if(isVisible && !!target && target.getAttribute('data-trash-item')){
                onClick();
            }else{
                setIsVisible(oldState => !oldState);
            }
        }
        if(parentRef){
            parentRef.addEventListener('click', onClickParent);
        }
        return () => {
            if(parentRef){
                parentRef.removeEventListener('click', onClickParent);
            }
        }
    }, [parentRef, isVisible, onClick]);

    const onClickHandle = (event: React.MouseEvent<HTMLElement>) => {
        if(!!parentRef){
            setIsVisible(oldState => !oldState);
            return;
        }
        const target = event.target as HTMLDivElement;
        if(target.parentElement){
            setParentRef(target.parentElement as HTMLDivElement);
        }
        setIsVisible(oldState => !oldState);
    }

    if(isVisible){
        return (
            <SimpleTrashElement
                onClick={evt => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    onClick();
                }}
                style={style}
                data-trash-item="trash-element"
            />
        );
    }
    return (
        <TrashTransparentBox
            onClick={onClickHandle}
        />
    )
}

export default TrashElement;

export {SimpleTrashElement};
