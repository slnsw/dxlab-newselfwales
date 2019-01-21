import { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import Packery from '../Packery';
import { scroller } from '../../lib/scroll';
import logBase from '../../lib/log';
// TODO: Can take out of this location and keep the one in ./cronjob as source of truth.
// import { getDate } from '../../lib/date';
import './ImageFeed.css';

const log = (...args) => {
	return logBase('<ImageFeed />', ...args);
};

class ImageFeed extends Component {
	static propTypes = {
		isLoading: PropTypes.bool,
		name: PropTypes.string,
		enableAnimation: PropTypes.bool,
		images: PropTypes.array,
		maxImages: PropTypes.number,
		startImages: PropTypes.number,
		intervalTime: PropTypes.number,
		increment: PropTypes.number,
		axis: PropTypes.string,
		status: PropTypes.string,
		loadMoreGap: PropTypes.number,
		marginTop: PropTypes.string,
		heightAdjust: PropTypes.string,
		fps: PropTypes.number,
		enableWindow: PropTypes.bool,
		gridSize: PropTypes.string,
		className: PropTypes.string,
		shouldFetchImagesOnMount: PropTypes.bool,
		pauseInterval: PropTypes.bool,
		onLoadMore: PropTypes.func,
		onImagesUpdate: PropTypes.func,
		onImageClick: PropTypes.func,
		onLayoutComplete: PropTypes.func,
		onMaxImagesComplete: PropTypes.func,
		onHideAllImagesComplete: PropTypes.func,
		onFetchedImagesReady: PropTypes.func,
		onScrollerWait: PropTypes.func,
		onScrollerResume: PropTypes.func,
	};

	static defaultProps = {
		images: [],
		axis: 'x',
		enableAnimation: true,
		maxImages: 1000,
		increment: 0.4,
		intervalTime: 10000,
		loadMoreGap: -600,
		marginTop: '5px',
		heightAdjust: '-10px',
		enableWindow: true,
		gridSize: 'md',
		shouldFetchImagesOnMount: false,
		pauseInterval: false,
	};

	state = {
		// Packery items
		laidOutItems: undefined,
		// Internal state flags
		isFirstLoad: true,
		isLayingOut: false,
		isImageFeedHidden: false,
		shouldHideAllWhenReady: false,
		shouldGetFetchedImagesWhenReady: false,
		// Images to hide
		hiddenImageIds: [],
		// Images to remove (return null)
		removedImageIds: [],
		// For testing
		highlightedImageIds: [],
		// Counters
		intervalCounter: 0,
		layingOutCounter: 0,
		refreshCounter: 0,
		skipNextInterval: false,
		maxImagesReached: false,
	};

	constructor(props) {
		super(props);

		this.imagesRef = {};
		this.imageHolderRefs = new Map();
	}

	componentDidMount() {
		log('mount', {
			images: this.props.images,
			name: this.props.name,
			enableAnimation: this.props.enableAnimation,
			maxImages: this.props.maxImages,
			startImages: this.props.startImages,
			intervalTime: this.props.intervalTime,
			increment: this.props.increment,
			loadMoreGap: this.props.loadMoreGap,
			marginTop: this.props.marginTop,
			heightAdjust: this.props.heightAdjust,
			fps: this.props.fps,
			pauseInterval: this.props.pauseInterval,
			shouldFetchImagesOnMount: this.props.shouldFetchImagesOnMount,
		});
	}

	componentDidUpdate(prevProps, prevState) {
		// ------------------------------------------------------------------------
		// SCROLLER AND LOOP
		// ------------------------------------------------------------------------

		if (
			prevProps.status === 'WAITING_ON_FIRST_IMAGES' &&
			this.props.status === 'FIRST_IMAGES_READY'
		) {
			// Start up loop once first fetched images are ready
			this.initLoop();

			this.setState({
				shouldGetFetchedImagesWhenReady: true,
			});
		}

		if (prevProps.pauseInterval !== this.props.pauseInterval) {
			if (this.props.pauseInterval) {
				log('Pause Interval', this.interval);
				clearInterval(this.interval);
			} else {
				log('Init Interval');
				this.initLoop();
			}
		}

		if (
			prevState.laidOutItems === undefined &&
			(this.state.laidOutItems && this.state.laidOutItems.length > 0)
		) {
			this.initScroller();
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

		// ------------------------------------------------------------------------
		// HANDLE IMAGE STATUS AND LAYING OUT
		// ------------------------------------------------------------------------

		// Hide all images, get ready to destroy thyself when ready
		if (
			prevProps.status !== 'UPCOMING_IMAGES_READY' &&
			this.props.status === 'UPCOMING_IMAGES_READY'
		) {
			this.setState({
				shouldHideAllWhenReady: true,
			});
		}

		if (
			prevProps.status === 'UPCOMING_IMAGES_READY' &&
			this.props.status === 'CURRENT_IMAGES'
		) {
			console.log(
				`%c Refresh and start up again ${this.state.refreshCounter} `,
				'background-color: #e6007e; color: #FFFFFF',
			);

			scroller.resetScrollCount();

			this.setState({
				hiddenImageIds: [],
				removedImageIds: [],
				isImageFeedHidden: false,
				intervalCounter: 0,
				refreshCounter: this.state.refreshCounter + 1,
				shouldHideAllWhenReady: false,
				maxImagesReached: false,
			});
		}

		if (
			prevProps.status === 'CURRENT_IMAGES' &&
			this.props.status === 'FETCHED_IMAGES_READY'
		) {
			log('FETCHED_IMAGES_READY');

			this.setState({
				shouldGetFetchedImagesWhenReady: true,
			});
		}

		// Track changes in images
		if (prevProps.images !== this.props.images) {
			log(
				'Change in images',
				prevProps.images.length,
				this.props.images.length,
			);

			this.setState({
				isLayingOut: true,
			});

			if (typeof this.props.onImagesUpdate === 'function') {
				this.props.onImagesUpdate(this.props.images);
			}
		}

		// Track whether images are being layout out or not
		if (prevState.isLayingOut !== this.state.isLayingOut) {
			log('isLayingOut', this.state.isLayingOut);
		}

		// Distinguish between first load and subsequent loading states
		if (
			prevProps.images !== this.props.images &&
			this.state.isFirstLoad === true
		) {
			log('set isFirstLoad to false');

			this.setState({
				isFirstLoad: false,
			});
		}
	}

	componentWillUnmount() {
		log('componentWillUnmount');
		log(this.interval);

		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	initScroller() {
		log('Init Scroller');

		scroller.init(
			this.imagesRef[this.props.name].refs.packeryContainer,
			this.state.laidOutItems,
			{
				axis: this.props.axis,
				increment: this.props.increment,
				fps: this.props.fps,
				onWait: this.props.onScrollerWait,
				onResume: this.props.onScrollerResume,
			},
		);

		if (this.props.enableAnimation) {
			log('Start scrolling');
			scroller.start();
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

			log(this.props.status);

			if (this.props.pauseInterval) {
				log('Pause Interval', this.interval);
				clearInterval(this.interval);
			}

			if (this.state.shouldHideAllWhenReady) {
				log('shouldHideAllWhenReady');
			}

			if (this.props.isLoading) {
				// --------------------------------------------------------------------
				// Skip if loading
				// --------------------------------------------------------------------

				log('Still loading, skip this interval.');
			} else if (this.state.skipNextInterval) {
				log('Skip this interval');

				this.setState({
					skipNextInterval: false,
				});
			} else if (this.state.shouldGetFetchedImagesWhenReady) {
				// --------------------------------------------------------------------
				// Images have been fetched, we are ready to receive them.
				// --------------------------------------------------------------------

				if (typeof this.props.onFetchedImagesReady === 'function') {
					this.props.onFetchedImagesReady();
				}

				this.setState({
					shouldGetFetchedImagesWhenReady: false,
					// Give feed some time to lay out images.
					// Not ideal, but Packery takes its sweet time which
					// causes overlaps when interval runs again
					skipNextInterval: true,
				});
			} else if (
				this.props.images.length >= this.props.maxImages &&
				this.state.shouldHideAllWhenReady === false &&
				this.state.maxImagesReached === false
			) {
				// --------------------------------------------------------------------
				// maxImages is reached. Trigger loading of UPCOMING images.
				// Update local maxImagesReached to ensure this only runs once
				// per refresh
				// --------------------------------------------------------------------

				log('MaxImages reached');

				// Trigger ImageFeedContainer to load more images for UPCOMING update
				log('Load more images in the background', this.props.startImages);

				this.setState({
					maxImagesReached: true,
				});

				if (typeof this.props.onMaxImagesComplete !== 'undefined') {
					this.props.onMaxImagesComplete();
				}
			} else if (this.state.isLayingOut) {
				log(
					'Still laying out, skip this interval.',
					this.state.layingOutCounter,
				);

				// Increment and force layout end after one interval
				// Sometimes packery doesn't detect layout complete. :(
				this.setState({
					isLayingOut: false,
					// intervalCounter: this.state.intervalCounter + 1,
					layingOutCounter: this.state.layingOutCounter + 1,
				});
			} else {
				// --------------------------------------------------------------------
				// Load more or hide depending on gap
				// --------------------------------------------------------------------

				this.setState({
					layingOutCounter: 0,
				});

				log(
					'Total images',
					this.props.images.length,
					'Hidden images',
					this.state.hiddenImageIds.length,
					'Removed images',
					this.state.removedImageIds.length,
				);

				// Amount of black space on right hand side. Can be negative if scroller is
				// larger than viewport.
				const clientRect = scroller.getBoundingClientRect();
				const emptyGap = clientRect ? window.innerWidth - clientRect.right : 0;

				if (emptyGap > this.props.loadMoreGap) {
					if (this.state.shouldHideAllWhenReady) {
						// TODO: Perhaps this not should depend on loadMoreGap
						this.hideAllImages();
					} else if (this.state.maxImagesReached === false) {
						// --------------------------------------------------------------------
						// Load more images
						// --------------------------------------------------------------------

						// TODO!!
						// Check still loading previous fetch, otherwise it will keep on trying to fetch more

						// Work out how many more images to fetch
						const gapConstant = Math.ceil(
							Math.abs(this.props.loadMoreGap - emptyGap) / 50,
						);
						const fetchMoreImagesTemp = gapConstant * 5;

						// Make sure we don't fetch more than maxImages
						const fetchMoreImages =
							fetchMoreImagesTemp + this.props.images.length >
							this.props.maxImages
								? this.props.maxImages - this.props.images.length
								: fetchMoreImagesTemp;

						log('Load more images', {
							loadMoreGap: this.props.loadMoreGap,
							gapConstant,
							emptyGap,
							fetchMoreImages,
						});

						this.props.onLoadMore({
							limit: fetchMoreImages,
							// No longer in use, cronjob takes care of this.
							// portraitPercentage: 0.4,
							// dateStart: getDate(-120),
						});
					} else {
						log('Max images reached, do not load new images, hide one instead');
						this.randomlyAddToHiddenImageIds();
					}
				} else if (this.props.enableWindow) {
					// --------------------------------------------------------------------
					// Window (ie Occlusion Culling)
					// Try to remove images that are left of screen
					// --------------------------------------------------------------------
					log('Start windowing check');

					const imageHolderRefs = Array.from(this.imageHolderRefs);
					const threshold = 0;
					const leftOfScreenImageThreshold = 5;

					// Work out images left of threshold by looping through imageHolderRefs
					const leftOfScreenImageHolderRefs = Array.from(
						imageHolderRefs,
					).filter((image) => {
						if (image && image[1]) {
							return (
								image[1].getBoundingClientRect().x +
									image[1].getBoundingClientRect().width <
								threshold
							);
						}
					});

					// Remove images if enough are left of screen
					if (leftOfScreenImageHolderRefs.length > leftOfScreenImageThreshold) {
						log('Images to remove', leftOfScreenImageHolderRefs);

						// Work out images right of threshold
						const rightOfScreenImageHolderRefs = Array.from(
							imageHolderRefs,
						).filter((image) => {
							if (image && image[1]) {
								return (
									image[1].getBoundingClientRect().x +
										image[1].getBoundingClientRect().width >=
									threshold
								);
							}
						});

						// Work out furthest left image and position of onScreen images
						const leftGapFurtherst = Math.min(
							...Array.from(leftOfScreenImageHolderRefs).map(
								(image) => image[1].getBoundingClientRect().x,
							),
						);

						const leftGapClosest = Array.from(rightOfScreenImageHolderRefs)
							.map((image) => image[1].getBoundingClientRect().x)
							// .filter(
							// 	(image) => image[1].getBoundingClientRect().x < threshold,
							// )
							.reduce((prev, curr) => {
								return Math.abs(curr - threshold) < Math.abs(prev - threshold)
									? curr
									: prev;
							});

						// const leftGapFurtherst = Math.min(
						// 	...Array.from(rightOfScreenImageHolderRefs).map(
						// 		(image) => threshold - image[1].getBoundingClientRect().x,
						// 	),
						// );

						const leftOfScroller = scroller.getBoundingClientRect().x;

						log({ leftOfScroller, leftGapFurtherst, leftGapClosest });

						// Work out gap to move on screen images to the left
						const leftGap = leftGapFurtherst - leftGapClosest;

						// Move all right of screen images to the left
						rightOfScreenImageHolderRefs.forEach((image) => {
							const left = parseFloat(
								image[1].style.left.replace('px', ''),
								10,
							);

							// Set new left position
							/* eslint-disable no-param-reassign */
							image[1].style.left = `${left + leftGap}px`;
						});

						// Remove images from DOM by adding them to removedImageIds
						this.setState({
							removedImageIds: [
								...this.state.removedImageIds,
								...leftOfScreenImageHolderRefs.map((image) => image[0]),
							],
							isLayingOut: true,
						});

						scroller.adjustScrollCount(leftGap * -1);
					} else {
						this.randomlyAddToHiddenImageIds();
					}
				} else {
					this.randomlyAddToHiddenImageIds();
				}
			}

			// Increment the intervalCounter
			this.setState({
				intervalCounter: this.state.intervalCounter + 1,
			});
		}, this.props.intervalTime);
	};

	// updateImageSizes = (imageSizes, id, index) => {
	// 	const size = setSize(index);

	// 	// Check if image already has size assigned
	// 	if (imageSizes[id] === undefined) {
	// 		this.setState((prevState) => ({
	// 			imageSizes: {
	// 				...prevState.imageSizes,
	// 				[id]: size,
	// 			},
	// 		}));
	// 	}
	// };

	randomlyAddToHiddenImageIds = (onComplete, count = 0) => {
		// Filter out hiddenImages, making sure to not run indexOf if
		// hiddenImageIdsis empty
		let images =
			this.state.hiddenImageIds.length > 0
				? this.props.images.filter(
						(image) => this.state.hiddenImageIds.indexOf(image.id) === -1,
					)
				: this.props.images;

		// Filter out removedImages, making sure to not run indexOf if
		// removedImageIdsis empty
		images =
			this.state.removedImageIds.length > 0
				? images.filter(
						(image) => this.state.removedImageIds.indexOf(image.id) === -1,
					)
				: images;

		// Get random image
		const randomIndex = Math.floor(Math.random() * images.length);
		const randomImage = images[randomIndex];

		// Get image ref
		const randomImageRef = Array.from(this.imageHolderRefs).filter((image) => {
			return randomImage.id === image[0];
		})[0][1];

		// console.log(randomImageRef);

		// Work out x/y of randomly selected image
		const randomImageBox = ReactDOM.findDOMNode(
			randomImageRef,
		).getBoundingClientRect();

		// Work out if leftOfViewport
		const isLeftOfViewport = randomImageBox.x + randomImageBox.width < 0;

		if (this.state.hiddenImageIds.length >= this.props.images.length) {
			log('All images are hidden');

			if (typeof onComplete === 'function') {
				onComplete();
			}
		} else if (count > this.props.maxImages || count > 500) {
			log('No images available to make hidden', count);
		} else if (
			// isVisible === false ||
			isLeftOfViewport === false
		) {
			// Run function again if image is not left of viewport
			// AND
			// Check if randomImage is already in hiddenImageIds array
			this.randomlyAddToHiddenImageIds(onComplete, count + 1);
		} else {
			log('Hide image', randomImage.id, randomImage.title);

			// Add id to hiddenImageIds to trigger animation
			this.setState((prevState) => ({
				hiddenImageIds: [...prevState.hiddenImageIds, randomImage.id],
				isLayingOut: true,
			}));

			// Add id to removedImageIds to remove from DOM and trigger layout
			if (this.timeout) {
				clearTimeout(this.timeout);
			}

			this.timeout = setTimeout(() => {
				this.setState((prevState) => ({
					removedImageIds: [...prevState.removedImageIds, randomImage.id],
				}));
				// NOTE: This was previously 4000, but since we are only hiding images left
				// of the viewport, lets keep it short for now.
			}, 50);
		}
	};

	hideAllImages = () => {
		log('hideAllImages()');

		// Hide image feed div
		this.setState({
			isImageFeedHidden: true,
		});

		if (typeof this.props.onHideAllImagesComplete === 'function') {
			const timeout = setTimeout(() => {
				this.props.onHideAllImagesComplete();

				clearTimeout(timeout);
			}, 1000);
		}
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
		const {
			isLoading,
			name,
			images,
			marginTop,
			heightAdjust,
			gridSize,
			className,
		} = this.props;
		const {
			isImageFeedHidden,
			isFirstLoad,
			hiddenImageIds,
			removedImageIds,
		} = this.state;

		return (
			<div
				className={[
					'image-feed',
					isImageFeedHidden ? 'image-feed--is-hidden' : '',
					name ? `image-feed--${name}` : '',
					className || '',
				].join(' ')}
			>
				{isLoading &&
					isFirstLoad && (
						<div className="image-feed__loading">
							<div className="image-feed__loading-content">
								{/* <NewSelfWalesLogo /> */}
								<p>Loading...</p>
							</div>
						</div>
					)}

				<div className="image-feed__scroller">
					<Packery
						className={[
							'image-feed__images',
							gridSize === 'lg' ? 'image-feed__images--lg' : '',
						].join(' ')}
						ref={(element) => {
							this.imagesRef[name] = element;
						}}
						style={{
							marginTop,
							height: `calc(100% + ${heightAdjust})`,
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
							if (!image.featuredMedia) {
								return null;
							}

							const isHidden = hiddenImageIds.indexOf(image.id) > -1;
							const isRemoved = removedImageIds.indexOf(image.id) > -1;

							// Remove image from DOM. Should only happen after it has been 'hidden'
							if (isRemoved) {
								return null;
							}

							const { imageSize } = image;

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
										<div
											className={[
												'image-feed__image-holder',
												imageSize
													? `image-feed__image-holder--${imageSize}`
													: '',
												image.type
													? `image-feed__image-holder--${image.type}`
													: '',
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
											tabIndex="0"
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
										</div>
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
