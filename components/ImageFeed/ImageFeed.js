import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import Packery from '../Packery';
import NewSelfWalesLogo from '../NewSelfWalesLogo';
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
		increment: 0.2,
		intervalTime: 10000,
		shouldHideAllImages: false,
		loadMoreGap: -50,
	};

	state = {
		// Packery items
		laidOutItems: undefined,
		// Images to hide
		hiddenImageIds: [],
		// [id]: 'md', 'lg' or 'xlg'
		imageSizes: {},
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

		// log(
		// 	'Compare laidOutItems',
		// 	prevState.laidOutItems === this.state.laidOutItems,
		// );
	}

	initLoop = () => {
		log('initLoop');

		// Set up repeating interval loop to add and remove images
		this.interval = setInterval(() => {
			console.log('%c Start Loop', 'color: #e6007e');

			if (this.props.images.length > this.props.maxImages) {
				// Stop timeout once maxImages is reached
				log('MaxImages reached');

				clearTimeout(this.interval);

				// Trigger ImageFeedContainer to load more images for UPCOMING update
				this.props.onLoadMore(50, 'UPCOMING');

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

				// TODO: Use state.laidOutItems to work out far right
				const gap = window.innerWidth - scroller.getBoundingClientRect().right;

				// Make sure gap is larger than -50
				if (gap > this.props.loadMoreGap) {
					// Check if same as previous fetch, otherwise it will keep on trying to fetch more
					// TODO!!

					// Work out how many more images to fetch
					const gapConstant = Math.ceil(Math.abs(gap) / 50);
					const fetchMoreImages = gapConstant * 4;

					this.props.onLoadMore(fetchMoreImages);

					log('Load more images', { gap }, { fetchMoreImages });
				} else {
					this.randomlyAddToHiddenImageIds();
				}

				if (typeof this.state.laidOutItems !== 'undefined') {
					// scroller.updateLaidOutItems(this.state.laidOutItems);
				}
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

	randomlyAddToHiddenImageIds = () => {
		// log('Attempt to hide image');

		const randomIndex = Math.floor(Math.random() * this.props.images.length);
		const randomImage = this.props.images[randomIndex];

		// Check if randomImage is already in hiddenImageIds array
		if (this.state.hiddenImageIds.indexOf(randomImage.id) > -1) {
			log('Image already in hiddenImageIds, try again.');

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

		this.setState(() => ({
			hiddenImageIds: this.props.images.map((image) => image.id),
		}));

		setTimeout(() => {
			// Tell container to remove all non-upcoming images
			this.props.onLoadMore(0, 'REMOVE_CURRENT');
			// Reset scroller window
			// scroller.resetScrollCount();
		}, 1000);
	};

	handleImageClick = (event, image) => {
		if (typeof this.props.onImageClick !== 'undefined') {
			this.props.onImageClick(event, image);
		}
	};

	render() {
		const { loading, name, images, onLayoutComplete } = this.props;

		return (
			<div
				className={['image-feed', name ? `image-feed--${name}` : ''].join(' ')}
			>
				{loading && (
					<div className="image-feed__loading">
						<div className="image-feed__loading-content">
							<NewSelfWalesLogo />
							<p>Loading</p>
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
						// stamps={[...this.imageStampRefs].map((stamp) => stamp[1])}
						onLayoutComplete={(laidOutItems) => {
							if (!this.state.laidOutItems && laidOutItems.length > 0) {
								this.setState({
									laidOutItems,
								});

								if (typeof onLayoutComplete !== 'undefined') {
									onLayoutComplete(laidOutItems);
								}
							}
						}}
					>
						{images.map((image, i) => {
							// Return null if there is no image or image hasn't been added to hiddenImageIds
							if (!image.featuredMedia || !this.state.imageSizes[image.id]) {
								return null;
							}

							const isHidden = this.state.hiddenImageIds.indexOf(image.id) > -1;

							// Get imageSize from internal imageSizes state
							const imageSize = this.state.imageSizes[image.id];

							// const imageUrl =
							// 	imageSize === 'md'
							// 		? image.featuredMedia.sizes.medium.sourceUrl
							// 		: image.featuredMedia.sizes.full.sourceUrl;
							const imageUrl = image.featuredMedia.sizes.medium.sourceUrl;

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
												image.isSilhouette
													? 'image-feed__image-holder--is-person'
													: '',
											].join(' ')}
											onClick={(event) =>
												!image.isSilhouette &&
												this.handleImageClick(event, image)
											}
											ref={(c) => this.imageHolderRefs.set(i, c)}
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
												alt="Portrait from the State Library of NSW collection"
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
