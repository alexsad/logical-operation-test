import React, { useEffect } from 'react';

const Sign: React.FC = ({children}) => {   
    useEffect(() => {
        const fetchAll = async () => {}
        fetchAll();
    }, []);

    return (
        <>
            {children}
        </>
    );
}

export default Sign;
