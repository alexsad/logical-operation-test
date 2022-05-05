import styled from 'styled-components';
import bgTexture from './assets/sf_sand.png';


const FrameGrayBox = styled.div`
    background-color: #2b271e;
    border: 2px solid #0e0d09;
    position: relative;
    border-radius: 3px;
    background-repeat: repeat;
    background-position-y: top;
    background-image:url(${bgTexture});
`;

export default FrameGrayBox;
