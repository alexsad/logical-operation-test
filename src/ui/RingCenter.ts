const RingAudioCenter = new Audio("/assets/tracks/sellxbuy_item.wav");
RingAudioCenter.volume = 1;
RingAudioCenter.loop = false;

const RingController = {
    volume: RingAudioCenter.volume,
    loop: RingAudioCenter.loop,
    src: (src: string) => {
        if(RingAudioCenter.paused && RingAudioCenter.volume > 0){
            RingAudioCenter.src = src
        }
    },
    play: () => {
        if(RingAudioCenter.paused && RingAudioCenter.volume > 0){
            RingAudioCenter.play();
        }
    }
}

export default RingController;