const log = (...args) => {
	if (process.env.BASE_URL !== 'https://dxlab-newselfwales.now.sh') {
		console.log(...args);
	}
};

export default log;
