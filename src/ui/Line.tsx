import styled from 'styled-components';

const LineWrapp = styled.div`
    width: 100%;
    padding: 1rem 0 1rem 0;
    box-sizing: border-box;
    position: relative;

    &:after {
        content: "";
        position: absolute;
        left: 0;
        width: 100%;
        height: 2px;
        background: #222220;
        border-radius: 2px;
    }
`;

export default LineWrapp;