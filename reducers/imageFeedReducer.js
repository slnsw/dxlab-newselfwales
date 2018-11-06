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
	upcomingImages: [],
	spareImages: [],
	status: 'FIRST_CURRENT_IMAGES',
};

// REDUCERS
export default (state = initialState, action) => {
	const { payload } = action;

	switch (action.type) {
		// ------------------------------------------------------------------------
		// FIRST and CURRENT IMAGES
		// ------------------------------------------------------------------------

		case 'IMAGE_FEED_FETCH_INITIAL_IMAGES_REQUEST': {
			log(action.type);

			return { ...state, isLoading: true };
		}

		case 'IMAGE_FEED_FETCH_INITIAL_IMAGES_SUCCESS': {
			log(action.type);

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
				currentImages: mergeImages(state.currentImages, payload.data.feed),
				spareImages,
				status: 'FETCHED_IMAGES_READY',
				isLoading: false,
			};
		}

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

		case 'IMAGE_FEED_FETCH_INITIAL_IMAGES_FAILURE':
			log(action.type);

			return {
				...state,
				isLoading: false,
			};

		// ------------------------------------------------------------------------
		// UPCOMING IMAGES
		// ------------------------------------------------------------------------

		case 'IMAGE_FEED_UPCOMING_IMAGES_READY': {
			log(action.type);

			return {
				...state,
				status: 'UPCOMING_IMAGES_READY',
			};
		}

		// case 'FETCH_UPCOMING_IMAGES_REQUEST':
		// 	log(action.type);

		// 	return { ...state };

		// case 'FETCH_UPCOMING_IMAGES_SUCCESS': {
		// 	log(action.type);

		// 	const spareImages = dedupeByField(
		// 		[...state.spareImages, ...processImages(payload.data.feed)],
		// 		'id',
		// 	);

		// 	if (spareImages.length > MAX_SPARE_IMAGES) {
		// 		spareImages.splice(0, spareImages.length - MAX_SPARE_IMAGES);
		// 	}

		// 	return {
		// 		...state,
		// 		upcomingImages: mergeImages([], payload.data.feed),
		// 		// Add new images to spare in case there is a fetch failure
		// 		spareImages,
		// 		status: 'UPCOMING_IMAGES_READY',
		// 	};
		// }

		// case 'FETCH_UPCOMING_IMAGES_FAILURE':
		// 	log(action.type);

		// 	return {
		// 		...state,
		// 	};

		case 'IMAGE_FEED_CLEAR_CURRENT_IMAGES':
			log(action.type);

			return {
				...state,
				currentImages: [],
			};

		// case 'SWITCH_UPCOMING_TO_CURRENT':
		// 	log(action.type);

		// 	return {
		// 		...state,
		// 		upcomingImages: [],
		// 		currentImages: state.upcomingImages,
		// 		status: 'CURRENT_IMAGES',
		// 	};

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

		// case 'IMAGE_FEED_COPY_SPARE_IMAGES_TO_UPCOMING': {
		// 	log(action.type);

		// 	const upcomingImages = mergeImages(
		// 		[],
		// 		getRandomArrayElements(state.spareImages, action.limit),
		// 	);

		// 	log(upcomingImages);

		// 	return {
		// 		...state,
		// 		upcomingImages,
		// 		status: 'UPCOMING_IMAGES_READY',
		// 	};
		// }

		case 'IMAGE_FEED_SEND_SUBSCRIBED_IMAGES': {
			log(action.type);
			// console.log(JSON.parse(action.payload.data.onSendControl.value));

			return {
				...state,
				upcomingImages: mergeImages(
					state.upcomingImages,
					JSON.parse(action.payload.data.onSendControl.value),
				),
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
