import fetch from 'isomorphic-unfetch';

export const createHealthCheck = (url, intervalTime = 12000) => {
	if (!url) {
		throw new Error('Healthcheck needs url');
	}

	return {
		start() {
			if (!this.interval) {
				console.log('Start healthCheck at ', url, intervalTime);

				// Send a ping to https://healthchecks.io
				this.interval = setInterval(() => {
					fetch(url)
						.then((data) => {
							console.log('healthCheck', data);
						})
						.catch((error) => {
							// handle error
							console.log(error);
						});
				}, intervalTime);
			}
		},
		stop() {
			console.log('Stop healthCheck', url, this.interval);

			clearInterval(this.interval);
		},
		getInterval() {
			return this.interval;
		},
	};
};
