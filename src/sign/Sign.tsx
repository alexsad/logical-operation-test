import React, { useEffect } from 'react';
import { ReactProps } from '../interfaces/interfaces';

const Sign: React.FC<ReactProps> = ({ children }) => {
    useEffect(() => {
        const fetchAll = async () => { }
        fetchAll();
    }, []);

    return (
        <>
            {children}
        </>
    );
}

export default Sign;
