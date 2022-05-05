import styled from 'styled-components';
import bgTexture from './assets/sf_sand.png';

const FrameGoldenBox = styled.div`
    background-color: #f4efdb;
    position: relative;
    // background-repeat: repeat;
    // background-position-y: top;
    // background-image:url(${bgTexture});
    border-radius: 1rem;
    z-index: 1;

    &:before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: -1;
    }

    &:before {
       border: 4px solid #00000021;
       width: calc(100% - 8px);
       height: calc(100% - 8px);
       border-radius: 1rem;
    }
`;

interface HeaderProps {
    bgColor?: string;
}

const Header = styled.div<HeaderProps>`
    background-color: ${({bgColor}) => bgColor || '#31acda'};
    width: 100%;
    position: relative;
    left: 0;
    top: 0;
    height: 3.5rem;
    z-index: 1;
    border-radius: 1rem 1rem 0 0;
    box-sizing:border-box;

    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    padding: 1rem;

    &:before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: -1;
    }

    &:before {
       border: 4px solid #00000021;
       border-bottom-color: transparent;
       width: calc(100% - 8px);
       height: calc(100% - 8px);
       border-radius: 1rem 1rem 0 0;
    }
`;

export {Header};

const Title = styled.span`
    text-align: center;
    font-size: 1.4rem;
    color: white;
`;

export {Title};

const Content = styled.div`
    padding: 1rem;
`;

export {Content};

const Footer = styled.div`
    display: flex;
    flex-direction: row-reverse;
    padding: 1rem;
    padding-top: 0;
`;

export {Footer};

export default FrameGoldenBox;
