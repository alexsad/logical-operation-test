import create from 'zustand';
import { Resolution } from '../../interfaces/interfaces';

interface IResolutionContext{
    resolution: Resolution;
    setResolution: (resolution: Resolution) => void;
}

export default create<IResolutionContext>((set) => ({
    resolution: {
        width: 0,
        height: 0,
    },
    setResolution: (resolution: Resolution) => {
        set({
            resolution,
        })
    },
}));
