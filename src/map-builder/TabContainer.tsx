import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactProps } from '../interfaces/interfaces';
import addIcon from '../ui/assets/add.png';
import minusIcon from '../ui/assets/minus.png';

const ContainerWrap = styled.div`
    width: 100%;
    box-sizing: border-box;
    background-color: transparent;
    padding: 0.1rem;
`;

const Container = styled.div`
    box-sizing: border-box;
    border: 2px solid rgba(255,255,255,.1);
    background-color: transparent;
`;

const Title = styled.div`
    background-color: rgba(255,255,255,.2);
    color: white;
    text-align: left;
    font-size: 1rem;
    padding: .2rem;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const TabContainer = styled.div`
    color: white;
    text-align: left;
    padding: .3rem;
    display: flex;
    flex-flow: column;
    align-items: flex-start;
`;

const TabTitle = styled.div`
    background-color: rgba(255,255,255,.2);
    color: white;
    text-align: left;
    font-size: .9rem;
    padding: .3rem;
    width: auto;
`;

const SubContainer = styled.div`
    background-color: rgba(255,255,255,.2);
    padding: .3rem;
    width: calc(100% - .6rem);
`;

const ChangeVisibilityBtn = styled.img`
    filter: invert(1);
`;

const TabBox: React.FC<ReactProps & { title: string, tabTitle: string }> = ({ children, title, tabTitle }) => {
    const [collapsed, setCollapsed] = useState(false);

    const onClick = () => {
        setCollapsed(currCollapsedState => !currCollapsedState);
    }

    return (
        <ContainerWrap>
            <Container>
                <Title onClick={onClick}>
                    <span>{title}</span>
                    {!collapsed && (
                        <ChangeVisibilityBtn src={minusIcon} />
                    )}
                    {collapsed && (
                        <ChangeVisibilityBtn src={addIcon} />
                    )}
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