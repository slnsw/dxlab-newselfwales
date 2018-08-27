import { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import Packery from '../Packery';
import { scroller } from '../../lib/scroll';

import './ImageFeed.css';

class ImageFeed extends Component {
	static propTypes = {
		axis: PropTypes.string,
		images: PropTypes.array,
		maxImages: PropTypes.number,
		enableAnimation: PropTypes.bool,
		intervalTime: PropTypes.number,
		increment: PropTypes.number,
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
	}

	componentDidMount() {
		// Set up repeating interval to continuously load new images
		this.interval = setInterval(() => {
			if (this.props.images.length > this.props.maxImages) {
				// Stop timeout once maxImages is reached
				clearTimeout(this.interval);
			} else {
				// Check how much of a black gap there is due to auto scrolling
				const gap = window.innerWidth - scroller.getBoundingClientRect().right;

				if (gap > -50) {
					// Work out how many more images to fetch
					const gapConstant = Math.ceil(Math.abs(gap) / 50);
					const fetchMoreImages = gapConstant * 4;
					this.props.onLoadMore(fetchMoreImages);

					console.log('Load more images', gap, { fetchMoreImages });
				} else {
					console.log('Remove images');
					// this.props.onLoadMore(0);

					this.randomlyAddToHiddenImageIds();
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

		console.log(randomIndex, randomImage);

		this.setState({
			hiddenImageIds: [...this.state.hiddenImageIds, randomImage.id],
		});
	};

	handleImageClick = (event, image) => {
		if (typeof this.props.onImageClick !== 'undefined') {
			this.props.onImageClick(event, image);
		}
	};

	render() {
		const { images, enableAnimation, onLayoutComplete } = this.props;
		// const { hiddenImageIds } = this.state;

		return (
			<div className="image-feed">
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
						const isHidden = this.state.hiddenImageIds.indexOf(image.id) > -1;
						// console.log(isHidden, image.id);

						// if (isHidden) {
						// 	return <div className="image-feed__image-holder" />;
						// }

						const imageSize = setSize(i);

						const imageUrl =
							imageSize === 'md'
								? image.featuredMedia.sizes.medium.sourceUrl
								: image.featuredMedia.sizes.full.sourceUrl;

						return (
							<CSSTransition
								in={!isHidden}
								timeout={2000}
								classNames="image-feed__image-holder-"
								key={`image-${i}`}
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
											image.isSilhouette ? 'image-feed__image--is-person' : '',
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
						);
					})}
				</Packery>
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
