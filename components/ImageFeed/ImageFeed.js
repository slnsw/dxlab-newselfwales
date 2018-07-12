import { Component } from 'react';
import PropTypes from 'prop-types';

import Packery from '../Packery';
import { scroller } from '../../lib/scroll';

import './ImageFeed.css';

class ImageFeed extends Component {
	static propTypes = {
		images: PropTypes.array,
		enableAnimation: PropTypes.bool,
	};

	static defaultProps = {
		enableAnimation: false,
	};

	constructor() {
		super();

		this.state = {
			axis: 'x',
			// enableAnimation: false,
			laidOutItems: undefined,
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.laidOutItems === undefined && this.state.laidOutItems) {
			// Init scroller
			scroller.init(
				this.imagesRef.refs.packeryContainer,
				this.state.laidOutItems,
				'x',
			);
		}

		if (!prevProps.enableAnimation && this.props.enableAnimation) {
			// Start scroll
			scroller.start();
		} else if (prevProps.enableAnimation && !this.props.enableAnimation) {
			// Stop scroll
			scroller.stop();
		}
	}

	render() {
		const { images } = this.props;

		return (
			<div
				className="image-feed"
				style={{
					overflow: 'hidden',
				}}
			>
				<Packery
					className="images"
					ref={(element) => {
						this.imagesRef = element;
					}}
					style={{
						marginTop: '5px',
						height: 'calc(100vh - 10px)',
					}}
					options={{
						itemSelector: '.image-holder',
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
						}
					}}
				>
					{images.map((image, i) => {
						const imageSize = setSize(i);

						return (
							<div
								className={`image-holder ${
									image.isSilhouette ? 'image-holder--is-person' : ''
								}
            image-holder--${imageSize}`}
								key={`image-${i}`}
							>
								<a href={image.url} target="_blank">
									{image.isSilhouette && (
										<div className="image-holder__content">
											<span>?</span>
											<p>This could be you!</p>
										</div>
									)}

									<img
										className={`image ${
											image.isSilhouette ? 'image--is-person' : ''
										}`}
										src={`/static/newselfwales/${
											image.isSelfie ? 'selfies' : 'images'
										}/${image.imageUrl}`}
										style={{
											// height: imageSize,
											marginBottom: '-4px',
										}}
										key={`${image.imageUrl}-${i}`}
										alt="Portrait from the State Library of NSW collection"
									/>
								</a>
							</div>
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
