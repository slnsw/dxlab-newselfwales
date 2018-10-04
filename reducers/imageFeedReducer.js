import { dedupeByField } from '../lib/dedupe';
import logBase from '../lib/log';
import { getRandomArrayElements } from '../lib';

const log = (...args) => {
	return logBase('imageFeedReducer', ...args);
};

const MAX_SPARE_IMAGES = 1000;

const initialState = {
	isLoading: false,
	currentFetchedImages: [],
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

		case 'FETCH_IMAGES_SUCCESS': {
			log('FETCH_IMAGES_SUCCESS');

			const spareImages = dedupeByField(
				[...state.spareImages, ...processImages(payload.data.feed)],
				'id',
			);

			if (spareImages.length > MAX_SPARE_IMAGES) {
				spareImages.splice(0, spareImages.length - MAX_SPARE_IMAGES);
			}

			return {
				...state,
				currentFetchedImages: payload.data.feed,
				// currentFetchedImages: mergeImages(state.currentImages, payload.data.feed),
				// currentImages: dedupeByField(
				// 	[...state.currentImages, ...processImages(payload.data.feed)],
				// 	'id',
				// )
				// 	// Assign an index and imageSize
				// 	// NOTE: these will change if currentImages has any images removed
				// 	// so be careful.
				// 	.map((image, i) => ({
				// 		...image,
				// 		index: i,
				// 		// Prevent gallery selfies from being larger than md, one camera is a bit blurry
				// 		imageSize: image.type === 'gallery-selfie' ? 'md' : setSize(i),
				// 	})),
				// Add new images to spare in case there is a fetch failure
				spareImages,
				status: 'FETCHED_IMAGES_READY',
				isLoading: false,
			};
		}

		case 'MOVE_FETCHED_TO_CURRENT_IMAGES': {
			return {
				...state,
				currentFetchedImages: [],
				currentImages: mergeImages(
					state.currentImages,
					state.currentFetchedImages,
				),
				status: 'CURRENT_IMAGES',
			};
		}

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

		case 'FETCH_UPCOMING_IMAGES_SUCCESS': {
			log('FETCH_UPCOMING_IMAGES_SUCCESS');

			const spareImages = dedupeByField(
				[...state.spareImages, ...processImages(payload.data.feed)],
				'id',
			);

			if (spareImages.length > MAX_SPARE_IMAGES) {
				spareImages.splice(0, spareImages.length - MAX_SPARE_IMAGES);
			}

			return {
				...state,
				upcomingImages: mergeImages([], payload.data.feed),
				// upcomingImages: dedupeByField(processImages(payload.data.feed), 'id')
				// 	// Assign an index and imageSize
				// 	// NOTE: these will change if currentImages has any images removed
				// 	// so be careful.
				// 	.map((image, i) => ({
				// 		...image,
				// 		index: i,
				// 		// Prevent gallery selfies from being larger than md, one camera is a bit blurry
				// 		imageSize: image.type === 'gallery-selfie' ? 'md' : setSize(i),
				// 	})),
				// Add new images to spare in case there is a fetch failure
				spareImages,
				status: 'UPCOMING_IMAGES_READY',
			};
		}

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

		case 'COPY_SPARE_IMAGES_TO_CURRENT': {
			log('COPY_SPARE_IMAGES_TO_CURRENT', action.limit);

			return {
				...state,
				currentImages: mergeImages(
					state.currentImages,
					getRandomArrayElements(state.spareImages, action.limit),
				),
			};
		}

		case 'COPY_SPARE_IMAGES_TO_UPCOMING': {
			log('COPY_SPARE_IMAGES_TO_UPCOMING', action.limit);

			return {
				...state,
				upcomingImages: mergeImages(
					[],
					getRandomArrayElements(state.spareImages, action.limit),
				),
				status: 'UPCOMING_IMAGES_READY',
			};
		}

		default:
			return state;
	}
};

function mergeImages(oldImages, newImages) {
	return (
		dedupeByField([...oldImages, ...processImages(newImages)], 'id')
			// Assign an index and imageSize
			// NOTE: these will change if currentImages has any images removed
			// so be careful.
			.map((image, i) => ({
				...image,
				index: i,
				// Prevent gallery selfies from being larger than md, one camera is a bit blurry
				imageSize: image.type === 'gallery-selfie' ? 'md' : setSize(i),
			}))
	);
}

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
