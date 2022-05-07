import {setCookie, getCookie} from '../util/cookie';
import { nextUID } from '../util/uuid';

const usePlayer = () => {
    const playerId = getCookie('player_id');
    if(!playerId){
        setCookie('player_id', `player_${nextUID()}`)
    }
    return {
        playerId: playerId as string
    }  
}

export default usePlayer;