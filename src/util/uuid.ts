import { v4 as uuidv4 } from 'uuid';

function nextUID() {
	return uuidv4().replaceAll('-','_');
}

export {nextUID};