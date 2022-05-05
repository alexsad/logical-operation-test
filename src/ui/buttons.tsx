import React, { ReactElement } from 'react';
import styled from 'styled-components';
import pointCursorImg from './assets/cursor/point.png';
import RingAudioCenter from './RingCenter';

const CloseButton = styled.div`
    width: 1.5rem;
    height: 1.5rem;
    background-color: #d14649;
    border: 1px solid #afafaf;
    border-radius: 50%;
    overflow: hidden;
    box-sizing: border-box;
    &:before,
    &:after {
        content: '';
        position: absolute;
        top: .6rem;
        left: .3rem;
        width: 58%;
        height: 3px;
        background: white;
    }
    
    &:before {
        transform: rotate(45deg);
    }
    
    &:after {
        transform: rotate(-45deg);
    }    
`;

const CloseLinkButton = styled(CloseButton)`
    position: relative;
    > a {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
`;

export {CloseButton , CloseLinkButton};

const ConfirmButton = styled.div`
    background-color: #2c80a3;
    border: 2px solid #140c1c;
    position: relative;
    border-radius: 5px;
    padding: .3rem;
    text-align: center;
    font-size: 1rem;
    cursor: url(${pointCursorImg}) 10 0,auto;

    color: #f9f9f9;
    text-stroke: 10px red;
    text-shadow:
        0px 0px 0 #000,
        -1px -1px 0 #000, 
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;

    &:hover, &:active {
        background-color: #4c8ba5;
    }

    &:before {
        content: "";
        width: 100%;
        height: 50%;
        position: absolute;
        left: 0px;
        right: 0px;
        top: 0px;
        background-color: #ffffff21;
    }
`;

export {ConfirmButton};

const NegativeButton = styled(ConfirmButton)`
    background-color: #ad2400;
    &:hover, &:active{
        background-color: #d13208;
    }
`;

export {NegativeButton};

const SellBuyItemRingEffect: React.FC = ({children}) => {
    const onClickHandler = () => {
        RingAudioCenter.src("/assets/tracks/sellxbuy_item.wav");
        RingAudioCenter.play();
    }
    
	return (
		<>
			{React.Children.map(children, (child, index) =>
				React.cloneElement(child as ReactElement, {
					onClickCapture: onClickHandler,
				})
			)}
		</>
	)
}



export {SellBuyItemRingEffect};
