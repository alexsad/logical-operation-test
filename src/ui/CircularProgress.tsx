import React from 'react';
import styled from 'styled-components';
import { ReactProps } from '../interfaces/interfaces';

interface CircularProgressProps {
    percent: number;
    color: string;
    size: number;
}

const CircularProgressWrapp = styled.div<CircularProgressProps>`
    width: ${({size}) => size}px;
    height: ${({size}) => size}px;
    padding: .25rem;
    position: relative;
    transition: background .1s;
    background: conic-gradient(${({color}) => color} ${({percent}) => percent * 100}%, transparent ${({percent}) => 100 * percent}%);
    border-radius: 50%;
`;

const CircularProgress: React.FC<CircularProgressProps & ReactProps> = ({percent, color, size, children}) => {
    
    return (
        <CircularProgressWrapp percent={percent} size={size} color={color}>
            {children}
        </CircularProgressWrapp>
    );
}

export default CircularProgress;