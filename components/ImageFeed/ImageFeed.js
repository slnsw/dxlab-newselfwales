import { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import Packery from '../Packery';
// import NewSelfWalesLogo from '../NewSelfWalesLogo';
import { scroller } from '../../lib/scroll';
import logBase from '../../lib/log';
import './ImageFeed.css';

const log = (...args) => {
	return logBase('<ImageFeed />', ...args);
};

class ImageFeed extends Component {
	static propTypes = {
		loading: PropTypes.bool,
		name: PropTypes.string.isRequired,
		enableAnimation: PropTypes.bool,
		images: PropTypes.array,
		maxImages: PropTypes.number,
		startImages: PropTypes.number,
		intervalTime: PropTypes.number,
		increment: PropTypes.number,
		axis: PropTypes.string,
		shouldHideAllImages: PropTypes.bool,
		loadMoreGap: PropTypes.number,
		onLoadMore: PropTypes.func,
		onImageClick: PropTypes.func,
		onLayoutComplete: PropTypes.func,
		onMaxImagesComplete: PropTypes.func,
	};

	static defaultProps = {
		axis: 'x',
		enableAnimation: true,
		maxImages: 1000,
		increment: 0.5,
		intervalTime: 10000,
		shouldHideAllImages: false,
		loadMoreGap: -400,
	};

	state = {
		// Packery items
		laidOutItems: undefined,
		isLayingOut: false,
		isImageFeedHidden: false,
		// Images to hide (CSS display: none)
		hiddenImageIds: [],
		// Images to remove (return null)
		removedImageIds: [],
		// [id]: 'md', 'lg' or 'xlg'
		imageSizes: {},
		// For testing
		highlightedImageIds: [],
		intervalCounter: 0,
		layingOutCounter: 0,
		refreshCounter: 0,
	};

	constructor() {
		super();

		this.imagesRef = {};
		this.imageHolderRefs = new Map();
		// this.imageStampRefs = new Map();
	}

	componentDidMount() {
		log('mount', {
			images: this.props.images,
			enableAnimation: this.props.enableAnimation,
			maxImages: this.props.maxImages,
			startImages: this.props.startImages,
			name: this.props.name,
			intervalTime: this.props.intervalTime,
			increment: this.props.increment,
			loadMoreGap: this.props.loadMoreGap,
		});
	}

	componentDidUpdate(prevProps, prevState) {
		// Init scroller and loop
		if (
			prevState.laidOutItems === undefined &&
			(this.state.laidOutItems && this.state.laidOutItems.length > 0)
		) {
			log('Init scroller');

			scroller.init(
				this.imagesRef[this.props.name].refs.packeryContainer,
				this.state.laidOutItems,
				{
					axis: this.props.axis,
					increment: this.props.increment,
				},
			);

			if (this.props.enableAnimation) {
				log('Start scrolling');
				scroller.start();
			}

			this.initLoop();
		}

		// Start or stop scroller
		if (!prevProps.enableAnimation && this.props.enableAnimation) {
			scroller.start();
		} else if (prevProps.enableAnimation && !this.props.enableAnimation) {
			scroller.stop();
		}

		// Update increment
		if (prevProps.increment !== this.props.increment) {
			scroller.updateIncrement(this.props.increment);
		}

		// Track changes in images
		if (prevProps.images !== this.props.images) {
			// Loop through all images and set image sizes for them
			// eg ('md', 'lg' or 'xlg').
			// Size is only assigned once, hence why we keep it in internal state
			this.props.images.forEach((image, i) =>
				this.updateImageSizes(this.state.imageSizes, image.id, i),
			);
		}

		// Hide all images, get ready to destroy thyself
		if (
			prevProps.shouldHideAllImages === false &&
			this.props.shouldHideAllImages
		) {
			this.hideAllImages();
		}

		if (
			prevProps.shouldHideAllImages === true &&
			this.props.shouldHideAllImages === false
		) {
			console.log(
				`%c Refresh and start up again ${this.state.refreshCounter} `,
				'background-color: #e6007e; color: #FFFFFF',
			);

			scroller.resetScrollCount();
			this.initLoop();

			this.setState({
				hiddenImageIds: [],
				removedImageIds: [],
				isImageFeedHidden: false,
				intervalCounter: 0,
				refreshCounter: this.state.refreshCounter + 1,
			});
		}

		// Track whether images are being layout out or not
		if (prevState.isLayingOut !== this.state.isLayingOut) {
			log('isLayingOut', this.state.isLayingOut);
		}
	}

	initLoop = () => {
		log('initLoop');

		// Set up repeating interval loop to add and remove images
		this.interval = setInterval(() => {
			console.log(
				`%c Interval ${this.state.intervalCounter} (${
					this.state.refreshCounter
				})`,
				'color: #e6007e',
			);

			if (this.props.loading) {
				// --------------------------------------------------------------------
				// Skip if loading or laying out
				// --------------------------------------------------------------------

				// if (this.props.loading) {
				log('Still loading, skip this interval.');
				// } else if (this.state.isLayingOut) {
				// }
			} else if (this.props.images.length >= this.props.maxImages) {
				// --------------------------------------------------------------------
				// maxImages is reached. Trigger loading of UPCOMING images.
				// clearInterval
				// --------------------------------------------------------------------

				log('MaxImages reached');

				// TODO: If app hits and error at this stage, we need
				// to work out a way to continue interval
				clearInterval(this.interval);

				// Trigger ImageFeedContainer to load more images for UPCOMING update
				log('Load more images in the background', this.props.startImages);
				this.props.onLoadMore(this.props.startImages, 'UPCOMING');

				if (typeof this.props.onMaxImagesComplete !== 'undefined') {
					this.props.onMaxImagesComplete();
				}
			} else if (this.state.isLayingOut && this.state.layingOutCounter < 2) {
				log(
					'Still laying out, skip this interval.',
					this.state.layingOutCounter,
				);

				// Force layout end, sometimes packery doesn't detect layout complete.
				this.setState({
					layingOutCounter: this.state.layingOutCounter + 1,
					intervalCounter: this.state.intervalCounter + 1,
					isLayingOut: false,
				});
			} else {
				// --------------------------------------------------------------------
				// Load more or hide depending on gap
				// --------------------------------------------------------------------

				this.setState({
					layingOutCounter: 0,
				});

				// Work how much of a black gap there is due to auto scrolling
				// TOTRY - Loop through all imageHolders and find the one furthest to the right
				// Get last imageHolder
				// const lastImageHolder = Array.from(this.imageHolderRefs)[
				// 	this.imageHolderRefs.size - 1
				// ][1];
				// // Work out right edge window position
				// const lastImageHolderRight = lastImageHolder.getBoundingClientRect()
				// 	.right;
				// Work out gap
				// const gap = window.innerWidth - lastImageHolderRight;

				log(
					'Total images',
					this.props.images.length,
					'Hidden images',
					this.state.hiddenImageIds.length,
					'Removed images',
					this.state.removedImageIds.length,
				);

				// log(this.state.laidOutItems);

				// TODO: Use state.laidOutItems to work out far right
				const gap = window.innerWidth - scroller.getBoundingClientRect().right;

				// Make sure gap is larger than -50
				if (gap > this.props.loadMoreGap) {
					// TODO!!
					// Check if same as previous fetch, otherwise it will keep on trying to fetch more

					// Work out how many more images to fetch
					const gapConstant = Math.ceil(Math.abs(gap) / 50);
					const fetchMoreImages = gapConstant * 4;
					// WIP
					// Make sure we don't fetch more than maxImages
					// const fetchMoreImages =
					// 	fetchMoreImagesCheck + this.props.images.length >
					// 	this.props.maxImages
					// 		? this.props.maxImages - this.props.images.length
					// 		: fetchMoreImagesCheck;

					log('Load more images', { gap }, { fetchMoreImages });
					this.props.onLoadMore(fetchMoreImages);

					this.setState({
						isLayingOut: true,
					});
				} else {
					this.randomlyAddToHiddenImageIds();
				}

				// Increment the intervalCounter
				this.setState({
					intervalCounter: this.state.intervalCounter + 1,
				});
			}
		}, this.props.intervalTime);
	};

	updateImageSizes = (imageSizes, id, index) => {
		const size = setSize(index);

		// Check if image already has size assigned
		if (imageSizes[id] === undefined) {
			this.setState((prevState) => ({
				imageSizes: {
					...prevState.imageSizes,
					[id]: size,
				},
			}));
		}
	};

	randomlyAddToHiddenImageIds = (onComplete) => {
		// Filter out hidden images
		const images = this.props.images.filter(
			(image) => this.state.hiddenImageIds.indexOf(image.id) === -1,
		);

		// Get random image
		const randomIndex = Math.floor(Math.random() * images.length);
		const randomImage = images[randomIndex];

		// Work out x/y of randomly selected image
		const randomImageRef = Array.from(this.imageHolderRefs).filter((image) => {
			return randomImage.id === image[0];
		})[0][1];
		const randomImageBox = ReactDOM.findDOMNode(
			randomImageRef,
		).getBoundingClientRect();

		// Work out if visible within viewport
		const isVisible =
			randomImageBox.x > 0 &&
			randomImageBox.x + randomImageBox.width < window.innerWidth;

		if (this.state.hiddenImageIds.length >= this.props.images.length) {
			log('All images are hidden');

			if (typeof onComplete === 'function') {
				onComplete();
			}
		} else if (
			isVisible === false ||
			this.state.hiddenImageIds.indexOf(randomImage.id) > -1
		) {
			// Run function again if image is not visible
			// AND
			// Check if randomImage is already in hiddenImageIds array
			//
			// TODO: May not need this anymore as we are filtering out
			// hidden images earlier

			this.randomlyAddToHiddenImageIds();
		} else {
			log('Hide image', randomImage.id, randomImage.title);

			// Add id to hiddenImageIds to trigger animation
			this.setState((prevState) => ({
				hiddenImageIds: [...prevState.hiddenImageIds, randomImage.id],
				isLayingOut: true,
			}));

			// Add id to removedImageIds to remove from DOM and trigger layout
			const timeout = setTimeout(() => {
				this.setState((prevState) => ({
					removedImageIds: [...prevState.removedImageIds, randomImage.id],
				}));

				clearTimeout(timeout);
			}, 4000);
		}
	};

	hideAllImages = () => {
		log('hideAllImages()');

		// Hide image feed div
		this.setState({
			isImageFeedHidden: true,
		});

		// const intervalTime = 50;

		// TODO: Stagger animation. Activate when better animate out is working
		// const interval = setInterval(() => {
		// 	// Stagger hiding images and run callback onComplete.
		// 	this.randomlyAddToHiddenImageIds(() => {
		// 		clearInterval(interval);
		// 	});
		// }, intervalTime);

		const timeout = setTimeout(() => {
			// Tell container to remove all non-upcoming images
			this.props.onLoadMore(0, 'REMOVE_CURRENT');

			clearTimeout(timeout);
		}, 500);
	};

	handleImageClick = (event, image) => {
		if (typeof this.props.onImageClick !== 'undefined') {
			this.props.onImageClick(event, image);
		}
	};

	handleLayoutComplete = (laidOutItems) => {
		// Reset isLayingOut to false
		if (this.state.isLayingOut) {
			this.setState({
				isLayingOut: false,
			});
		}

		if (
			this.state.laidOutItems === undefined &&
			(laidOutItems && laidOutItems.length > 0)
		) {
			this.setState({
				laidOutItems,
			});
		}
	};

	render() {
		const { loading, name, images } = this.props;
		const {
			isImageFeedHidden,
			imageSizes,
			hiddenImageIds,
			removedImageIds,
		} = this.state;

		return (
			<div
				className={[
					'image-feed',
					isImageFeedHidden ? 'image-feed--is-hidden' : '',
					name ? `image-feed--${name}` : '',
				].join(' ')}
			>
				{loading && (
					<div className="image-feed__loading">
						<div className="image-feed__loading-content">
							{/* <NewSelfWalesLogo /> */}
							<p>Loading...</p>
						</div>
					</div>
				)}

				<div className="image-feed__scroller">
					<Packery
						className="image-feed__images"
						ref={(element) => {
							this.imagesRef[name] = element;
						}}
						style={{
							marginTop: '5px',
							height: 'calc(100vh - 10px)',
						}}
						options={{
							itemSelector: '.image-feed__image-holder',
							gutter: 0,
							horizontalOrder: true,
							fitWidth: true,
							transitionDuration: '2s',
							stagger: 100,
							isHorizontal: true,
						}}
						onLayoutComplete={(laidOutItems) => {
							this.handleLayoutComplete(laidOutItems);
						}}
						// stamps={[...this.imageStampRefs].map((stamp) => stamp[1])}
					>
						{images.map((image, i) => {
							// Return null if there is no image or image hasn't been added to hiddenImageIds
							if (!image.featuredMedia || !imageSizes[image.id]) {
								return null;
							}

							const isHidden = hiddenImageIds.indexOf(image.id) > -1;
							const isRemoved = removedImageIds.indexOf(image.id) > -1;

							// Remove image from DOM. Should only happen after it has been 'hidden'
							if (isRemoved) {
								return null;
							}

							// Get imageSize from internal imageSizes state
							const imageSize = this.state.imageSizes[image.id];

							// Work out image URL
							const imageUrl =
								imageSize === 'md'
									? image.featuredMedia.sizes.medium.sourceUrl
									: image.featuredMedia.sizes.full.sourceUrl;
							// const imageUrl = image.featuredMedia.sizes.medium.sourceUrl;

							// Build image alt
							let imageAlt;
							if (image.type === 'portrait') {
								imageAlt = 'Portrait from the State Library of NSW collection';
							} else if (image.type === 'instagram-selfie') {
								imageAlt = 'Selfie from Instagram';
							} else if (image.type === 'gallery-selfie') {
								imageAlt = 'Selfie from photo booth';
							}

							return (
								<Fragment key={`image-${image.id}`}>
									<CSSTransition
										in={!isHidden}
										timeout={2000}
										classNames="image-feed__image-holder-"
									>
										<button
											className={[
												'image-feed__image-holder',
												`image-feed__image-holder--${imageSize}`,
												`image-feed__image-holder--${image.type}`,
												image.isSilhouette
													? 'image-feed__image-holder--is-person'
													: '',
												`image-feed__image-holder--id-${image.id}`,
												this.state.hiddenImageIds[0] &&
												parseInt(this.state.highlightedImageIds[0], 10) ===
													image.id
													? 'image-feed__image-holder--highlighted'
													: '',
											].join(' ')}
											onClick={(event) =>
												!image.isSilhouette &&
												this.handleImageClick(event, image)
											}
											ref={(c) => this.imageHolderRefs.set(image.id, c)}
											data-id={image.id}
										>
											{image.isSilhouette && (
												<div className="image-feed__image-holder__content">
													<span>?</span>
													<p>This could be you!</p>
												</div>
											)}

											<img
												className={[
													`image-feed__image`,
													image.isSilhouette
														? 'image-feed__image--is-person'
														: '',
												].join(' ')}
												src={imageUrl}
												// src={`/static/newselfwales/${
												// 	image.isSelfie ? 'selfies' : 'images'
												// }/${image.imageUrl}`}
												style={{
													marginBottom: '-4px',
												}}
												key={`${imageUrl}-${i}`}
												alt={imageAlt}
											/>
										</button>
									</CSSTransition>
								</Fragment>
							);
						})}
					</Packery>
				</div>
			</div>
		);
	}
}

export default ImageFeed;

function setSize(i) {
	if (i % 6 === 1) {
		return 'lg';
	} else if (i % 10 === 1) {
		return 'xlg';
	}

	return 'md';
}
