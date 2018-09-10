import { dedupeByField } from '../lib/dedupe';
import logBase from '../lib/log';

const log = (...args) => {
	return logBase('imageFeedReducer', ...args);
};

const initialState = {
	isLoading: false,
	currentImages: [],
	upcomingImage: [],
	spareImages: [],
	status: 'CURRENT_IMAGES',
};

// REDUCERS
export default (state = initialState, action) => {
	const { payload } = action;

	switch (action.type) {
		// ------------------------------------------------------------------------
		// CURRENT IMAGES
		// ------------------------------------------------------------------------

		case 'FETCH_IMAGES_REQUEST':
			log('FETCH_IMAGES_REQUEST');

			return { ...state, isLoading: true };

		case 'FETCH_IMAGES_SUCCESS':
			log('FETCH_IMAGES_SUCCESS');

			return {
				...state,
				currentImages: dedupeByField(
					[...state.currentImages, ...processImages(payload.data.feed)],
					'id',
				)
					// Assign an index and imageSize
					// NOTE: these will change if currentImages has any images removed
					// so be careful.
					.map((image, i) => ({
						...image,
						index: i,
						imageSize: setSize(i),
					})),
				isLoading: false,
			};

		case 'FETCH_IMAGES_FAILURE':
			log('FETCH_IMAGES_FAILURE');

			return {
				...state,
				isLoading: false,
			};

		// ------------------------------------------------------------------------
		// UPCOMING IMAGES
		// ------------------------------------------------------------------------

		case 'FETCH_UPCOMING_IMAGES_REQUEST':
			log('FETCH_UPCOMING_IMAGES_REQUEST');

			return { ...state };

		case 'FETCH_UPCOMING_IMAGES_SUCCESS':
			log('FETCH_UPCOMING_IMAGES_SUCCESS');

			return {
				...state,
				upcomingImages: dedupeByField(processImages(payload.data.feed), 'id')
					// Assign an index and imageSize
					// NOTE: these will change if currentImages has any images removed
					// so be careful.
					.map((image, i) => ({
						...image,
						index: i,
						imageSize: setSize(i),
					})),
				status: 'UPCOMING_IMAGES_READY',
			};

		case 'FETCH_UPCOMING_IMAGES_FAILURE':
			log('FETCH_UPCOMING_IMAGES_FAILURE');

			return {
				...state,
			};

		case 'CLEAR_CURRENT_IMAGES':
			log('CLEAR_CURRENT_IMAGES');

			return {
				...state,
				currentImages: [],
			};

		case 'SWITCH_UPCOMING_TO_CURRENT':
			log('SWITCH_UPCOMING_TO_CURRENT');

			return {
				...state,
				upcomingImages: [],
				currentImages: state.upcomingImages,
				status: 'CURRENT_IMAGES',
			};

		default:
			return state;
	}
};

function setSize(i) {
	if (i % 6 === 1) {
		return 'lg';
	} else if (i % 10 === 1) {
		return 'xlg';
	}

	return 'md';
}

function processImages(images) {
	return images.map((image) => {
		// Set image type
		let type;

		/* eslint-disable no-underscore-dangle */
		const { __typename } = image;
		if (__typename === 'NewSelfWalesPortrait') {
			type = 'portrait';
		} else if (__typename === 'NewSelfWalesInstagramSelfie') {
			type = 'instagram-selfie';
		} else if (__typename === 'NewSelfWalesGallerySelfie') {
			type = 'gallery-selfie';
		}

		return {
			...image,
			type,
		};
	});
}
