import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProgressBar from '../ui/ProgressBar';
import { ReactProps } from '../interfaces/interfaces';

const LoadingScreenWrap = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
`;

const ProgressLoadingWrap = styled.div`
    // border: 1px solid red;
    height: 40px;
    width: 150px;
    padding: 1rem;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: center;
    color: white;
`;

const ProgressLoading: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let idTimeout: NodeJS.Timeout;
        if(progress < 1){
            idTimeout = setTimeout(() => { 
                setProgress(currprogress => {
                    if(currprogress < 1){
                        return currprogress + 0.5;
                    }
                    return 1;
                });
            }, 1000);
        }
        return () => {
            if(idTimeout){
                clearTimeout(idTimeout);
            }
        }
    }, [progress]);

    return (
        <ProgressLoadingWrap>
            LOADING....
            <ProgressBar color="green" value={progress}/>
        </ProgressLoadingWrap>
    );
}

const LoadingScreen: React.FC<ReactProps> = ({children}) => {
    return (
        <LoadingScreenWrap>
            <ProgressLoading/>
            {children}
        </LoadingScreenWrap>
    );
}

export default LoadingScreen;