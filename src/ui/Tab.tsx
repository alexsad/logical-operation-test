import React, { useState } from 'react';
import styled from 'styled-components';
import FrameGoldenBox from './FrameGolden';
import Line from './Line';
import { ReactProps } from '../interfaces/interfaces';

const ContentBoxFrame = styled(FrameGoldenBox)`
    display: flex;
    flex-direction: column;
    width: 400px;
    justify-content: stretch;
    height: 70vh;
    padding: 1rem;
    overflow: hidden;
`;

const TabSessionContent = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
`;

const TabTitles = styled.div`
    display: flex;
    flex-direction: row;
`;

const TabTitle = styled.div`
    margin-right: 1rem;
`;

const TabTitleActive = styled(TabTitle)``;

const TabTitleNotActive = styled(TabTitle)`
    color: #777;
`;

interface TabComponents {
	Tabs: React.FC
    Title: React.FC<{label: string}>
    Sessions: React.FC
	Session: React.FC<{label: string}>
}

interface TabContextProps {
    activeTab: string;
    setActiveTab: (index: string) => void
}

const TabContext = React.createContext<TabContextProps>({
	activeTab: '',
    setActiveTab: () => {},
})

const useTabContext = () => {
	const context = React.useContext(TabContext)
	if (!context) {
		throw new Error(
			'Tab compound components cannot be rendered outside the List component'
		)
	}
	return context
}

const Tab:React.FC<ReactProps & {active: string}> & TabComponents= ({children, active}) => {
    const [activeTab, setActiveTab] = useState(active)
    return (
        <ContentBoxFrame>
            <TabContext.Provider value={{
                activeTab,
                setActiveTab,
            }}>
                {children}
            </TabContext.Provider>
        </ContentBoxFrame>
    )
};

const Tabs: React.FC<ReactProps> = ({children}) => {
    return (
        <div>
            <TabTitles>
                {children}
            </TabTitles>
            <Line/>
        </div>
    )
}

Tab.Tabs = Tabs;

const Sessions: React.FC<ReactProps> = ({children}) => {
    return (
        <TabSessionContent>{children}</TabSessionContent>
    )
}

const Title: React.FC<{label: string}> = ({label}) => {
    const {activeTab, setActiveTab} = useTabContext();
    if(activeTab === label){
        return (
            <TabTitleActive>{label}</TabTitleActive>
        );
    }
    return (
        <TabTitleNotActive onClick={() => setActiveTab(label)}>{label}</TabTitleNotActive>
    );
}

Tab.Title = Title;

Tab.Sessions = Sessions;

const Session: React.FC<ReactProps & {label: string}> = ({children, label}) => {
    const {activeTab} = useTabContext();
    if(activeTab !== label){
        return null;
    }
    return (
        <div>{children}</div>
    )
}

Tab.Session = Session

export default Tab;