import React from 'react';
import tileImg from './assets/select-arrow.png';

const EmptyTile: React.FC<{selected:boolean,onClick:() => void}> = ({onClick, selected}) => {
    return (
        <div onClick={onClick} className={`a-selection-tool ${selected ? 'is-selected':''}`}>
            <img draggable={false} alt={``} src={tileImg}/>
        </div>
    );
}

export default EmptyTile;