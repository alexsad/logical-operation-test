import styled from 'styled-components';
import reloadIcon from './assets/reload.png';

const LoadingIcon = styled.div`
    width: 24px;
    height: 24px;

    background-image:url(${reloadIcon});
    background-repeat: no-repeat;
    background-position: center center;
    animation: rotate-loading 1s linear infinite;

    @keyframes rotate-loading {
        from {transform:rotate(0deg);}
        to {transform:rotate(360deg);}
    }
`;

const LoadingBox = styled.div`
    width: 100%;
    height: 100%;
    background-color: #00000066;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
`;

const FullLoadingBox = styled(LoadingBox)`
    width: calc(100% + 2rem);
    margin-left: -1rem;
    height: calc(100% + 2rem);
    margin-top: -1rem;
`;

export { FullLoadingBox, LoadingBox, LoadingIcon };

