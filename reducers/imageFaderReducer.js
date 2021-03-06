import { dedupeByField } from '../lib/dedupe';
import logBase from '../lib/log';

const log = (...args) => {
	return logBase('imageFaderReducer', ...args);
};

const initialState = {
	isLoading: false,
	images: [],
	current: null,
};

// REDUCERS
export default (state = initialState, action) => {
	const { payload } = action;

	switch (action.type) {
		// ------------------------------------------------------------------------
		// CURRENT IMAGES
		// ------------------------------------------------------------------------

		case 'FETCH_FADER_IMAGES_REQUEST':
			log('FETCH_FADER_IMAGES_REQUEST');

			return { ...state, isLoading: true };

		case 'FETCH_FADER_IMAGES_SUCCESS':
			log('FETCH_FADER_IMAGES_SUCCESS');
			return {
				...state,
				images: dedupeByField(
					[
						...payload.data.newSelfWales.gallerySelfies,
						...payload.data.newSelfWales.randomSelfies,
					],
					'id',
				).filter(
					(image) => image.featuredMedia && image.featuredMedia.sourceUrl,
				),
				isLoading: false,
			};

		case 'FETCH_FADER_IMAGES_FAILURE':
			log('FETCH_FADER_IMAGES_FAILURE');

			return {
				...state,
				isLoading: false,
			};

		default:
			return state;
	}
};
