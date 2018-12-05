// import ReactGA from 'react-ga';
import TagManager from 'react-gtm-module';

import logBase from './log';

const log = (...args) => {
	return logBase('analytics', ...args);
};

export const initGA = () => {
	if (process.env.GTM_ID) {
		const tagManagerArgs = {
			gtmId: process.env.GTM_ID,
			//  auth: 'Ij5VowVJ3SpzP1BaPm1T8w',
			//  preview: 'env-2',
		};
		log('GTM init');
		TagManager.initialize(tagManagerArgs);
	}
};
