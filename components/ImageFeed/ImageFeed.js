import { Component } from 'react';
import PropTypes from 'prop-types';

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
		};
	}

	componentDidMount() {
		// Set up repeating interval to continuously load new images
		this.interval = setInterval(() => {
			if (this.props.images.length > this.props.maxImages) {
				clearTimeout(this.interval);
			} else {
				this.props.onLoadMore();

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

	handleImageClick = (event, image) => {
		if (typeof this.props.onImageClick !== 'undefined') {
			this.props.onImageClick(event, image);
		}
	};

	render() {
		const { images, enableAnimation, onLayoutComplete } = this.props;

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
						const imageSize = setSize(i);

						return (
							<button
								className={`image-feed__image-holder ${
									image.isSilhouette
										? 'image-feed__image-holder--is-person'
										: ''
								}
								image-feed__image-holder--${imageSize}`}
								onClick={(event) =>
									!image.isSilhouette && this.handleImageClick(event, image)
								}
								key={`image-${i}`}
							>
								{image.isSilhouette && (
									<div className="image-feed__image-holder__content">
										<span>?</span>
										<p>This could be you!</p>
									</div>
								)}

								<img
									className={`image-feed__image ${
										image.isSilhouette ? 'image-feed__image--is-person' : ''
									}`}
									src={image.imageUrl}
									// src={`/static/newselfwales/${
									// 	image.isSelfie ? 'selfies' : 'images'
									// }/${image.imageUrl}`}
									style={{
										// height: imageSize,
										marginBottom: '-4px',
									}}
									key={`${image.imageUrl}-${i}`}
									alt="Portrait from the State Library of NSW collection"
								/>
							</button>
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
