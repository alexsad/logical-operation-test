import { useState } from "react";
import styled from "styled-components";
import { LoadingBox, LoadingIcon } from "./Loading";
import { ReactProps } from "./interfaces";


const BlackDoor = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,.5);
    z-index: 4;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;


const ModalHeader = styled.div`
    width: 100%;
    
    display: flex;
    justify-content: center;
    height: 2rem;
    background-color: #7a9eb3;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px 4px 0px 0px;
`;

const ModalHeaderTitle = styled.span`
    margin-left: .5rem;
    color: white;
    font-weight: bold;
`;

const ModalCloseBtn = styled.div`
    background-color: #b34d4d;
    height: 16px;
    width: 16px;
    border-radius: 3px;
    margin-right: .5rem;
    cursor: pointer;
`;

const Content = styled.div`
    width: auto;
    height: auto;
    z-index: 5;
    position: relative;
`;

const ContentBox = styled.div`
    background-color:#ebebeb;
    padding: 1rem;
    display:flex;
    flex-direction: column;
    border-radius: 0 0px 4px 4px;
    position:relative;
`;

const ContentInner = styled.div`
    display:flex;
    flex-direction: column;
    background-color: #fff;
    position:relative;
`;

const CustomLoadingBox = styled(LoadingBox)`
    z-index:1;
`;

const Modal: React.FC<{
    onClose: () => void,
    title: string,
    isLoading?: boolean,
    closeable?: boolean,
} & ReactProps> = ({ onClose, children, title, isLoading = false, closeable = true }) => {
    const [visible, setVisible] = useState(true);

    const onCloseHandler = () => {
        if (!isLoading) {
            onClose();
            setVisible(false);
        }
    }

    if (!visible) {
        return null;
    }

    return (
        <BlackDoor>
            <Content>
                {isLoading && (
                    <CustomLoadingBox>
                        <LoadingIcon />
                    </CustomLoadingBox>
                )}
                <ModalHeader>
                    <ModalHeaderTitle>
                        {title}
                    </ModalHeaderTitle>
                    {closeable && (
                        <ModalCloseBtn
                            onClick={onCloseHandler}
                        />
                    )}
                </ModalHeader>
                <ContentBox>
                    <ContentInner>
                        {children}
                    </ContentInner>
                </ContentBox>
            </Content>
        </BlackDoor>
    )
}

export { Modal };
