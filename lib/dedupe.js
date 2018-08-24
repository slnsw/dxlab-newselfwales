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

export default dedupe;
