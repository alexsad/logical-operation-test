import styled from "styled-components";

const Card = styled.div`
    border: 1px solid #919090;
    background-color: #efefef;
    min-height: 3rem;
    width: 45%;
    border-radius: 4px 4px 0 0;
    display:flex;
    flex-direction: column;
    margin:.5rem;
    position:relative;
    &.is-disabled {
        opacity: .5;
        filter:saturate(0%);
    }
`;

const CardHeader = styled.div`
    border-radius: 4px 4px 0 0;
    background-color: #97bfd9;
    display: flex;
    padding:0 .2rem 0 .2rem;
`;

const CardTitle = styled.label`
    background-color: transparent;
    width: 100%;
    text-align: center;
    border-style:none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:focus, &:active, &:focus-visible{
        border-style:none;
    }
`;

const CardContent = styled.div`
    background-color: #efefef;
    width: 100%;
    padding: .5rem;
    list-style: none;
    display:flex;
`;

export { Card, CardContent, CardHeader, CardTitle };
