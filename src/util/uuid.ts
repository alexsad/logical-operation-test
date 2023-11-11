const appendToString = (text: string, appendText: string, positionIndex: number) => {
	return [text.slice(0, positionIndex), appendText, text.slice(positionIndex)].join('');
}

const genUUID = () => {
	if (!('randomUUID' in globalThis?.crypto)) {
		const stringRandom = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
		return appendToString(stringRandom, '_', 5);
	}
	return `uuid_${globalThis.crypto.randomUUID().replaceAll("-", "_")}`;
}

export { genUUID };
