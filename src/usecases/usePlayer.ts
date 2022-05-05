import {setCookie, getCookie} from '../util/cookie';
import {getRandomIntInclusive} from '../util/random-number';

const usePlayer = () => {
    const playerId = getCookie('player_id');
    if(!playerId){
        setCookie('player_id', `player_${getRandomIntInclusive(1000, 9999)}_${new Date().getTime()}`)
    }
    return {
        playerId: playerId as string
    }  
}

export default usePlayer;