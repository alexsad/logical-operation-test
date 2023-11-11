import React from 'react';
import styled from 'styled-components';

interface ProgressBarProps {
    $fill: string;
    $borderSize?: number;
    $height: number;
}

interface InnerProgressBarprops {
    $color: string;
    $value: number;
    $height?: number;
    $borderSize?: number;
}

const InnerProgressBar = styled.div<InnerProgressBarprops>`
    width: ${({ $value }) => $value * 100}%;
    height: ${({ $height }) => $height}px;
    background-color: ${({ $color }) => $color};
    position: relative;
    border-radius: 3px;
    transition: width 1s;
`;

const ProgressBarWrap = styled.div<ProgressBarProps>`
    display: flex;
    width: calc(100% - ${({ $borderSize }) => $borderSize || 0 * 2}px);
    border: ${({ $borderSize }) => $borderSize}px solid #00000025;
    border-radius: 5px;
    background-color: #32323225;
    position: relative;
    &:after {
        content: "";
        right: .5%;
        width: 99%;
        height: ${({ $height }) => $height / 3}px;
        position: absolute;
        top:2px;
        background-color: rgba(255,255,255,0.4);
        border-radius: 4px;
    }
`;

const ProgressBar: React.FC<InnerProgressBarprops> = ({ $color, $value, $borderSize = 2, $height = 10 }) => {
    return (
        <ProgressBarWrap $height={$height} $fill={$color} $borderSize={$borderSize}>
            <InnerProgressBar $height={$height} $color={$color} $value={$value} />
        </ProgressBarWrap>
    );
}

export default ProgressBar;