import axios from 'axios';
// Send a ping to https://healthchecks.io
export const healthCheck = (url, interval) => {
	setInterval(() => {
		axios.get(url).catch((error) => {
			// handle error
			console.log(error);
		});
	}, interval);
};
