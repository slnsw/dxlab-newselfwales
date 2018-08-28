import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import Packery from '../Packery';
import NewSelfWalesLogo from '../NewSelfWalesLogo';
import { scroller } from '../../lib/scroll';

import './ImageFeed.css';

class ImageFeed extends Component {
	static propTypes = {
		loading: PropTypes.bool,
		enableAnimation: PropTypes.bool,
		images: PropTypes.array,
		maxImages: PropTypes.number,
		intervalTime: PropTypes.number,
		increment: PropTypes.number,
		axis: PropTypes.string,
		onLoadMore: PropTypes.func,
		onImageClick: PropTypes.func,
		onLayoutComplete: PropTypes.func,
	};

	static defaultProps = {
		axis: 'x',
		enableAnimation: true,
		maxImages: 1000,
		increment: 0.5,
		intervalTime: 10000,
	};

	constructor() {
		super();

		this.state = {
			laidOutItems: undefined,
			hiddenImageIds: [],
		};

		this.imageHolderRefs = new Map();
		this.imageStampRefs = new Map();
	}

	componentDidMount() {
		// Set up repeating interval to add and remove images
		this.interval = setInterval(() => {
			if (this.props.images.length > this.props.maxImages) {
				// Stop timeout once maxImages is reached
				console.log('MaxImages reached');

				clearTimeout(this.interval);
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
				const gap = window.innerWidth - scroller.getBoundingClientRect().right;

				console.log('Total images', this.props.images.length);
				console.log('Total hidden images', this.state.hiddenImageIds.length);

				if (gap > -50) {
					// Work out how many more images to fetch
					const gapConstant = Math.ceil(Math.abs(gap) / 50);
					const fetchMoreImages = gapConstant * 4;
					this.props.onLoadMore(fetchMoreImages);

					console.log('Load more images', { gap }, { fetchMoreImages });
				} else {
					console.log('Remove images');
					this.props.onLoadMore(0);

					// this.randomlyAddToHiddenImageIds();
				}

				if (typeof this.state.laidOutItems !== 'undefined') {
					// scroller.updateLaidOutItems(this.state.laidOutItems);
				}
			}
		}, this.props.intervalTime);
	}

	componentDidUpdate(prevProps, prevState) {
		// Init scroller
		if (prevState.laidOutItems === undefined && this.state.laidOutItems) {
			scroller.init(
				this.imagesRef.refs.packeryContainer,
				// this.imageFeedRef,
				this.state.laidOutItems,
				{
					axis: this.props.axis,
					increment: this.props.increment,
				},
			);
		}

		// Start or stop scroller
		if (!prevProps.enableAnimation && this.props.enableAnimation) {
			scroller.start();
		} else if (prevProps.enableAnimation && !this.props.enableAnimation) {
			scroller.stop();
		}

		if (prevProps.increment !== this.props.increment) {
			scroller.updateIncrement(this.props.increment);
		}
	}

	// handleScroll = (e) => {
	// 	console.log('Handlescroll');

	// 	console.log(e.target.scrollLeft);
	// };

	randomlyAddToHiddenImageIds = () => {
		const randomIndex = Math.floor(Math.random() * this.props.images.length);
		const randomImage = this.props.images[randomIndex];

		// Check if randomImage is already in hiddenImageIds array
		if (this.state.hiddenImageIds.indexOf(randomImage.id) > -1) {
			console.log('Image already in hiddenImageIds, try again.');

			this.randomlyAddToHiddenImageIds();
		} else {
			console.log(randomIndex, randomImage.title);

			this.setState({
				hiddenImageIds: [...this.state.hiddenImageIds, randomImage.id],
			});
		}
	};

	handleImageClick = (event, image) => {
		if (typeof this.props.onImageClick !== 'undefined') {
			this.props.onImageClick(event, image);
		}
	};

	render() {
		const { loading, images, enableAnimation, onLayoutComplete } = this.props;
		// const { hiddenImageIds } = this.state;

		return (
			<div
				className="image-feed"
				ref={(element) => {
					this.imageFeedRef = element;
				}}
			>
				{loading && (
					<div className="image-feed__loading">
						<div className="image-feed__loading-content">
							<NewSelfWalesLogo />
							<p>Loading</p>
						</div>
					</div>
				)}

				<Packery
					className="image-feed__images"
					ref={(element) => {
						this.imagesRef = element;
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
						if (!this.state.laidOutItems) {
							this.setState({
								laidOutItems,
							});

							if (enableAnimation) {
								scroller.start();
							}

							if (typeof onLayoutComplete !== 'undefined') {
								onLayoutComplete();
							}
						}
					}}
				>
					{images.map((image, i) => {
						// Return null if there is no image
						if (!image.featuredMedia) {
							return null;
						}

						const isHidden = this.state.hiddenImageIds.indexOf(image.id) > -1;
						// const imageSize = setSize(i);

						const imageSize = image.size;

						const imageUrl =
							imageSize === 'md'
								? image.featuredMedia.sizes.medium.sourceUrl
								: image.featuredMedia.sizes.full.sourceUrl;

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
											// isHidden ? 'image-feed__image-holder--is-hidden' : '',
											image.isSilhouette
												? 'image-feed__image-holder--is-person'
												: '',
										].join(' ')}
										onClick={(event) =>
											!image.isSilhouette && this.handleImageClick(event, image)
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
												// height: imageSize,
												marginBottom: '-4px',
											}}
											key={`${imageUrl}-${i}`}
											alt="Portrait from the State Library of NSW collection"
										/>
									</button>
								</CSSTransition>

								{/* {i % 10 === 0 && (
									<div
										style={{ left: `${i * 50}px`, top: 0 }}
										className="image-feed__stamp"
										ref={(c) => this.imageStampRefs.set(i, c)}
									/>
								)} */}
							</Fragment>
						);
					})}
				</Packery>
			</div>
		);
	}
}

export default ImageFeed;

// function setSize(i) {
// 	if (i % 6 === 1) {
// 		return 'lg';
// 	} else if (i % 10 === 1) {
// 		return 'xlg';
// 	}

// 	return 'md';
// }
