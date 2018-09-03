const dedupe = (arr) => {
	const hashTable = {};

	return arr.filter((el) => {
		const key = JSON.stringify(el);
		const match = Boolean(hashTable[key]);

		if (match) {
			return false;
		}

		hashTable[key] = true;
		return true;
	});
};

export const dedupeByField = (myArr, field) => {
	return myArr.filter((obj, pos, arr) => {
		return arr.map((mapObj) => mapObj[field]).indexOf(obj[field]) === pos;
	});
};

export default dedupe;
