import { Component, Fragment } from 'react';
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
		loadMoreGap: -200,
	};

	state = {
		// Packery items
		laidOutItems: undefined,
		// Images to hide
		hiddenImageIds: [],
		// [id]: 'md', 'lg' or 'xlg'
		imageSizes: {},
		// For testing
		highlightedImageIds: [],
		intervalCounter: 0,
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
		if (prevState.laidOutItems === undefined && this.state.laidOutItems) {
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

		// Update image sizes
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
			log('start her up again!');
			scroller.resetScrollCount();
			this.initLoop();
			this.setState({
				hiddenImageIds: [],
			});
		}
	}

	initLoop = () => {
		log('initLoop');

		// Set up repeating interval loop to add and remove images
		this.interval = setInterval(() => {
			console.log(
				`%c Start Loop ${this.state.intervalCounter}`,
				'color: #e6007e',
			);

			if (this.props.images.length >= this.props.maxImages) {
				// Stop timeout once maxImages is reached
				log('MaxImages reached');

				clearTimeout(this.interval);
				// TODO: If app hits and error at this stage, we need
				// to work out a way to continue interval

				// Trigger ImageFeedContainer to load more images for UPCOMING update
				log('Load more images in the background', this.props.startImages);
				this.props.onLoadMore(this.props.startImages, 'UPCOMING');

				// if (typeof this.props.onMaxImagesComplete !== 'undefined') {
				// 	this.props.onMaxImagesComplete();
				// }
			} else if (this.props.loading) {
				log('Still loading, skip fetch');
			} else {
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
		const randomIndex = Math.floor(Math.random() * this.props.images.length);
		const randomImage = this.props.images[randomIndex];

		if (this.state.hiddenImageIds.length >= this.props.images.length) {
			log('All images are hidden');

			if (typeof onComplete === 'function') {
				onComplete();
			}
		} else if (this.state.hiddenImageIds.indexOf(randomImage.id) > -1) {
			// Check if randomImage is already in hiddenImageIds array
			// log('Image already in hiddenImageIds, try again.');

			this.randomlyAddToHiddenImageIds();
		} else {
			log('Hide image', randomImage.id, randomImage.title);

			this.setState({
				hiddenImageIds: [...this.state.hiddenImageIds, randomImage.id],
			});
		}
	};

	hideAllImages = () => {
		log('hideAllImages()');
		const intervalTime = 50;

		const interval = setInterval(() => {
			// Stagger hiding images and run callback onComplete.
			this.randomlyAddToHiddenImageIds(() => {
				clearInterval(interval);
			});
		}, intervalTime);

		const timeout = setTimeout(() => {
			// Tell container to remove all non-upcoming images
			this.props.onLoadMore(0, 'REMOVE_CURRENT');

			clearTimeout(timeout);
		}, intervalTime * (this.props.images.length + 1));
	};

	handleImageClick = (event, image) => {
		if (typeof this.props.onImageClick !== 'undefined') {
			this.props.onImageClick(event, image);
		}
	};

	handleLayoutComplete = (laidOutItems) => {
		const prevItemPositions =
			this.state.laidOutItems &&
			this.state.laidOutItems.map((image) => image.position);
		const currentItemPositions = laidOutItems.map((image) => image.position);
		const didPositionsChange =
			(JSON.stringify(prevItemPositions) ===
				JSON.stringify(currentItemPositions)) ===
			false;

		// Check if positions changed
		if (didPositionsChange) {
			let max;

			if (laidOutItems.length > 0) {
				max = laidOutItems.reduce((prev, current) => {
					// if (prev && prev.rect) {
					return prev.rect.x + prev.rect.width >
						current.rect.x + current.rect.width
						? prev
						: current;
					// }
				});

				// console.log(max);
			}

			this.setState({
				laidOutItems,
				highlightedImageIds: max && max.element ? [max.element.dataset.id] : [],
			});

			if (typeof onLayoutComplete !== 'undefined') {
				this.props.onLayoutComplete(laidOutItems);
			}

			// console.log(this.state.highlightedImageIds);

			// console.log(
			// 	Math.max(
			// 		...laidOutItems.map((image) => image.rect.x + image.rect.width),
			// 	),
			// );
		}
		// this.laidOutItems = laidOutItems;

		// log(
		// 	laidOutItems.map((image) => {
		// 		return image.position;
		// 	}),
		// );
	};

	render() {
		const { loading, name, images } = this.props;

		return (
			<div
				className={['image-feed', name ? `image-feed--${name}` : ''].join(' ')}
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
							transitionDuration: '1s',
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
							if (!image.featuredMedia || !this.state.imageSizes[image.id]) {
								return null;
							}

							const isHidden = this.state.hiddenImageIds.indexOf(image.id) > -1;

							// Get imageSize from internal imageSizes state
							const imageSize = this.state.imageSizes[image.id];

							const imageUrl =
								imageSize === 'md'
									? image.featuredMedia.sizes.medium.sourceUrl
									: image.featuredMedia.sizes.full.sourceUrl;
							// const imageUrl = image.featuredMedia.sizes.medium.sourceUrl;

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
										timeout={3000}
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
											ref={(c) => this.imageHolderRefs.set(i, c)}
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

									{/* {i % 20 === 0 && (
									<div
										style={{
											left: `${i * 100}px`,
											top: 0,
											width: '1px',
											height: '100vh',
											backgroundColor: 'red',
										}}
										className="image-feed__image-holder"
										// ref={(c) => this.imageStampRefs.set(i, c)}
									/>
								)} */}
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
