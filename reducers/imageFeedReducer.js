import { dedupeByField } from '../lib/dedupe';

const initialState = {
	isLoading: false,
	currentImages: [],
	upcomingImage: [],
	spareImages: [],
};

// REDUCERS
export default (state = initialState, action) => {
	const { payload } = action;

	switch (action.type) {
		case 'FETCH_IMAGES_REQUEST':
			console.log('FETCH_IMAGES_REQUEST');

			return { ...state, isLoading: true };

		case 'FETCH_IMAGES_SUCCESS':
			// console.log(action.payload);

			return {
				...state,
				currentImages: dedupeByField(
					[
						...state.currentImages,
						...payload.data.feed.map((image) => {
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
						}),
					],
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
			console.log('FETCH_IMAGES_FAILURE');

			return {
				...state,
				isLoading: false,
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
