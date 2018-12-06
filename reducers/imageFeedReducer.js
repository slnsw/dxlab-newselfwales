import { dedupeByField } from '../lib/dedupe';
import logBase from '../lib/log';
import { getRandomArrayElements } from '../lib';

const log = (...args) => {
	return logBase('imageFeedReducer', ...args);
};

// TODO: Work out best way to limit upcoming Images - from beginning or end?

const initialState = {
	isLoading: false,
	currentFetchedImages: [],
	currentImages: [],
	upcomingImages: [],
	spareImages: [],
	status: 'WAITING_ON_FIRST_IMAGES',
	maxSpareImages: 100,
	maxUpcomingImages: 100,
};

// REDUCERS
export default (state = initialState, action) => {
	const { payload } = action;

	switch (action.type) {
		// ------------------------------------------------------------------------
		// FETCH IMAGES
		// ------------------------------------------------------------------------

		case 'IMAGE_FEED_FETCH_IMAGES_REQUEST': {
			log(action.type);

			return { ...state, isLoading: true };
		}

		case 'IMAGE_FEED_FETCH_IMAGES_SUCCESS': {
			log(action.type);

			// Add new images to spare in case there is a fetch failure
			const spareImages = dedupeByField(
				[...state.spareImages, ...processImagesType(payload.data.feed)],
				'id',
			);

			const currentImages = mergeImages(state.currentImages, payload.data.feed);

			return {
				...state,
				currentImages: limitImages(currentImages, state.maxUpcomingImages),
				spareImages: limitImages(spareImages, state.maxSpareImages),
				status: 'FETCHED_IMAGES_READY',
				isLoading: false,
			};
		}

		case 'IMAGE_FEED_FETCH_IMAGES_FAILURE': {
			log(action.type);

			return {
				...state,
				isLoading: false,
			};
		}

		// ------------------------------------------------------------------------
		// CURRENT/UPCOMING IMAGES
		// ------------------------------------------------------------------------

		case 'IMAGE_FEED_MOVE_UPCOMING_TO_CURRENT_IMAGES': {
			log(action.type, action.limit);

			return {
				...state,
				upcomingImages: state.upcomingImages.slice(action.limit),
				currentImages: mergeImages(
					state.currentImages,
					state.upcomingImages.slice(0, action.limit),
				),
				status: 'CURRENT_IMAGES',
			};
		}

		case 'IMAGE_FEED_UPCOMING_IMAGES_READY': {
			log(action.type);

			return {
				...state,
				status: 'UPCOMING_IMAGES_READY',
			};
		}

		case 'IMAGE_FEED_CLEAR_CURRENT_IMAGES':
			log(action.type);

			return {
				...state,
				currentImages: [],
			};

		case 'IMAGE_FEED_COPY_SPARE_IMAGES_TO_CURRENT': {
			log(action.type);

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

		// ------------------------------------------------------------------------
		// SUBSCRIBED IMAGES
		// ------------------------------------------------------------------------

		case 'IMAGE_FEED_GET_SUBSCRIBED_IMAGES': {
			log(action.type);
			// console.log(JSON.parse(action.payload.data.onSendControl.value));

			const newImages = mergeImages(
				state.upcomingImages,
				JSON.parse(action.payload.data.onSendControl.value),
			);

			return {
				...state,
				upcomingImages: limitImages(newImages, state.maxUpcomingImages),
				spareImages: limitImages(newImages, state.maxSpareImages),
				status: 'SUBSCRIBED_IMAGES_READY',
			};
		}

		default:
			return state;
	}
};

function mergeImages(oldImages, newImages) {
	return (
		dedupeByField([...oldImages, ...processImagesType(newImages)], 'id')
			// Assign an index and imageSize
			// NOTE: these will change if currentImages has any images removed
			// so be careful.
			.map((image, i) => ({
				...image,
				index: i,
				// Prevent gallery selfies from being larger than md
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

export function processImagesType(images = []) {
	if (!images) {
		return [];
	}

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

function limitImages(images = [], maxLimit = 1000) {
	if (images.length > maxLimit) {
		images.splice(0, images.length - maxLimit);
	}

	return images;
}
