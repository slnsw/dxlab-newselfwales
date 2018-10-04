export const LatinLayoutCustom = {
	symbolsKeyValue: 'Abc',
	layout: [
		['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
		['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '@'],
		['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
	],
};

/* eslint-disable */
export const getRandomArrayElements = (arr, n) => {
	const result = new Array(n);
	let len = arr.length;
	const taken = new Array(len);

	if (n > len)
		throw new RangeError('getRandom: more elements taken than available');
	while (n--) {
		const x = Math.floor(Math.random() * len);
		result[n] = arr[x in taken ? taken[x] : x];
		taken[x] = --len in taken ? taken[len] : len;
	}

	return result;
};
/* eslint-enable */
