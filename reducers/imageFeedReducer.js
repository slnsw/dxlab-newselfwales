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
	status: 'FIRST_CURRENT_IMAGES',
};

// REDUCERS
export default (state = initialState, action) => {
	const { payload } = action;

	log(action.type);

	switch (action.type) {
		// ------------------------------------------------------------------------
		// FIRST and CURRENT IMAGES
		// ------------------------------------------------------------------------

		case 'FETCH_IMAGES_REQUEST': {
			return { ...state, isLoading: true };
		}

		case 'FIRST_FETCH_IMAGES_SUCCESS':
		case 'FETCH_IMAGES_SUCCESS': {
			const isFirstFetch = action.type === 'FIRST_FETCH_IMAGES_SUCCESS';

			// Add new images to spare in case there is a fetch failure
			const spareImages = dedupeByField(
				[...state.spareImages, ...processImages(payload.data.feed)],
				'id',
			);

			// Ensure we don't exceed MAX_SPARE_IMAGES, otherwise memory will run out
			if (spareImages.length > MAX_SPARE_IMAGES) {
				spareImages.splice(0, spareImages.length - MAX_SPARE_IMAGES);
			}

			return {
				...state,
				// If isFirstFetch === true, put new images straight into 'currentImages',
				// otherwise we have to wait around for the next interval for
				// MOVE_FETCHED_TO_CURRENT_IMAGES
				currentFetchedImages: isFirstFetch ? [] : payload.data.feed,
				currentImages: isFirstFetch
					? mergeImages([], payload.data.feed)
					: state.currentImages,
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
			return {
				...state,
				isLoading: false,
			};

		// ------------------------------------------------------------------------
		// UPCOMING IMAGES
		// ------------------------------------------------------------------------

		case 'FETCH_UPCOMING_IMAGES_REQUEST':
			return { ...state };

		case 'FETCH_UPCOMING_IMAGES_SUCCESS': {
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
				// Add new images to spare in case there is a fetch failure
				spareImages,
				status: 'UPCOMING_IMAGES_READY',
			};
		}

		case 'FETCH_UPCOMING_IMAGES_FAILURE':
			return {
				...state,
			};

		case 'CLEAR_CURRENT_IMAGES':
			return {
				...state,
				currentImages: [],
			};

		case 'SWITCH_UPCOMING_TO_CURRENT':
			return {
				...state,
				upcomingImages: [],
				currentImages: state.upcomingImages,
				status: 'CURRENT_IMAGES',
			};

		case 'COPY_SPARE_IMAGES_TO_CURRENT': {
			const currentImages = mergeImages(
				state.currentImages,
				getRandomArrayElements(state.spareImages, action.limit),
			);

			log(currentImages);

			return {
				...state,
				currentImages,
			};
		}

		case 'COPY_SPARE_IMAGES_TO_UPCOMING': {
			const upcomingImages = mergeImages(
				[],
				getRandomArrayElements(state.spareImages, action.limit),
			);

			log(upcomingImages);

			return {
				...state,
				upcomingImages,
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
	} else if (i % 9 === 1) {
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
