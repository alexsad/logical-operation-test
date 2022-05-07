import styled from 'styled-components';
import trashIcon from '../assets/trash-10-16.png';

const TrashElement = styled.div`
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

export default TrashElement;
