import { useEffect, useState } from 'react';
import styled from 'styled-components';
import trashIcon from '../assets/trash-10-16.png';

const SimpleTrashElement = styled.div`
    position: absolute;
    width: 2rem;
    height: 2rem;
    background-color: black;
    background-image: url(${trashIcon});
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 50%;
    cursor: pointer;
`;

const TrashTransparentBox = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
`;

const TrashElement: React.FC<{
    onClick: () => void,
    top: number,
    left?: number,
    right?: number,
}> = ({onClick, top, left, right}) => {
    const [parentRef, setParentRef] = useState(null as null | HTMLDivElement);
    const [isMouseOver, setIsMouseOver] = useState(false);
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
        const mouseLeave = () => {
            setIsMouseOver(false);
        }
        const mouseOver = () => {
            setIsMouseOver(true);
        }
        if(parentRef){
            parentRef.addEventListener('mouseleave', mouseLeave);
            parentRef.addEventListener('mouseover', mouseOver);
        }
        return () => {
            if(parentRef){
                parentRef.removeEventListener('mouseleave', mouseLeave);
                parentRef.removeEventListener('mouseover', mouseOver);
            }
        }
    }, [parentRef]);

    const onMouseOver = (event: React.MouseEvent<HTMLElement>  ) => {
        if(!!parentRef){
            setIsMouseOver(true);
            return;
        }
        const target = event.target as HTMLDivElement;
        if(target.parentElement){
            setParentRef(target.parentElement as HTMLDivElement);
        }
        setIsMouseOver(true);
    }

    if(isMouseOver){
        return (
            <SimpleTrashElement
                onClick={onClick}
                style={style}
                onMouseLeave={() => setIsMouseOver(false)}
            />
        );
    }
    return (
        <TrashTransparentBox
            onMouseOver={onMouseOver}
        />
    )
}

export default TrashElement;

export {SimpleTrashElement};
