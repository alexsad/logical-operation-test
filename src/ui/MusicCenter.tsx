import React, { useEffect } from 'react';

export interface MusicConfig {
    src: string,
    volume?: number,
    loop: boolean,
}

const audioCenter = new Audio();

const AudioConfigReadOnly: MusicConfig = {
    src: '',
    volume: 0,
    loop: true,
}

// const handleFocus = () => {
//     // Be sure to unsubscribe if a new handler is set
//     window.removeEventListener('visibilitychange', handleFocus);
//     window.removeEventListener('focus', handleFocus);
//     audioCenter.volume = .2;
//     audioCenter.play();
// }

// if (typeof window !== 'undefined' && window.addEventListener) {
//     window.addEventListener('visibilitychange', handleFocus, false);
//     window.addEventListener('focus', handleFocus, false);
// }


const MusicCenter: React.FC<MusicConfig> = ({src, volume, loop}) => {
    useEffect(() => {
        if(typeof volume === 'number'){
            audioCenter.volume = volume;
            AudioConfigReadOnly.volume = volume;
        }
        audioCenter.volume = AudioConfigReadOnly.volume || 0;

        if(audioCenter.volume > 0){
            audioCenter.src = src;
        }

        audioCenter.loop = loop;
        
        if(audioCenter.volume > 0){
            audioCenter.play();
        }else{
            audioCenter.pause();
            audioCenter.loop = false;
        }
    }, [src, volume, loop]);

    return (<></>);
}

export {AudioConfigReadOnly};

export default MusicCenter;