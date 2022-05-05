import React, { useState } from 'react';
import styled from 'styled-components';

const ContainerWrap = styled.div`
    width: 100%;
    box-sizing: border-box;
    background-color: #f0f0f0;
    padding: 0.1rem;
`;

const Container = styled.div`
    box-sizing: border-box;
    border: 2px solid #2f2f2f;
    background-color: #f0f0f0;
`;

const Title = styled.div`
    background-color: #2f2f2f;
    color: rgb(226, 225, 225);
    text-align: left;
    font-size: 14px;
    padding: .2rem;
`;

const TabContainer = styled.div`
    color: rgb(226, 225, 225);
    text-align: left;
    font-size: 14px;
    padding: .3rem;
    display: flex;
    flex-flow: column;
    align-items: flex-start;
`;

const TabTitle = styled.div`
    background-color: #fff;
    color: rgb(78,78,78);
    text-align: left;
    font-size: 12px;
    padding: .3rem;
    width: auto;
`;

const SubContainer = styled.div`
    background-color: #fff;
    padding: .3rem;
    width: calc(100% - .6rem);
`;

const TabBox: React.FC<{title: string, tabTitle: string}> = ({children, title, tabTitle}) => {
    const [collapsed, setCollapsed] = useState(false);

    const onClick = () => {
        setCollapsed(currCollapsedState => !currCollapsedState);
    }

    return (
        <ContainerWrap>
            <Container>
                <Title onClick={onClick}>
                    <span>{title}</span>
                    {!collapsed && (<strong>&#8593;</strong>)}
                    {collapsed && (<strong>&#8595;</strong>)}
                </Title>
                {!collapsed && (
                    <TabContainer>
                        <TabTitle>{tabTitle}</TabTitle>
                        <SubContainer>
                            {children}
                        </SubContainer>
                    </TabContainer>
                )}
            </Container>
        </ContainerWrap>
    );
}

export default TabBox;