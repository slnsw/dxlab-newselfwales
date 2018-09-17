import { Component } from 'react';
import PropTypes from 'prop-types';

import './ImageFader.css';

class ImageFader extends Component {
	static propTypes = {
		images: PropTypes.array,
		onNoMoreImages: PropTypes.func,
		timePerImage: PropTypes.number,
		fadeTimePerImage: PropTypes.number,
	};

	static defaultProps = {
		timePerImage: 5000,
		fadeTimePerImage: 1000,
	};

	state = {
		imageNum: 0,
		nextImageNum: 1,
		isFading: false,
		lastImage: null,
	};

	componentDidMount() {
		this.init();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.images.length && prevProps.images !== this.props.images) {
			const lastID = prevProps.images.length - 1;
			this.setState({
				imageNum: 0,
				nextImageNum: 1,
				lastImage: prevProps.images[lastID],
			});
			this.stopFade();
			this.startTimeout();
		}
	}

	init = () => {
		this.startTimeout();
	};

	startFade = () => {
		this.setState({
			isFading: true,
		});
		this.lastStopFade = setTimeout(() => {
			this.stopFade();
		}, this.props.fadeTimePerImage);
	};

	stopFade = () => {
		this.setState({
			isFading: false,
		});
	};

	startTimeout = () => {
		setTimeout(() => {
			this.startFade();
		}, this.props.timePerImage - this.props.fadeTimePerImage);

		setTimeout(() => {
			if (
				this.state.nextImageNum <
				this.props.images.length - (this.state.lastImage ? 0 : 1)
			) {
				this.setState({
					imageNum: this.state.imageNum + 1,
					nextImageNum: this.state.nextImageNum + 1,
				});
				this.startTimeout();
			} else if (typeof this.props.onNoMoreImages === 'function') {
				clearTimeout(this.lastStopFade);
				this.props.onNoMoreImages();
			}
		}, this.props.timePerImage);
	};

	render() {
		const images = this.state.lastImage
			? [this.state.lastImage, ...this.props.images]
			: this.props.images;
		if (!images.length) {
			return null;
		}
		return (
			<div className="image-fader">
				<img
					className={[
						'image-fader__image',
						this.state.isFading ? 'image-fader__image--is-fading' : '',
					].join(' ')}
					src={images[this.state.imageNum].featuredMedia.sourceUrl}
					alt={images[this.state.imageNum].title}
				/>
				<img
					className="image-fader__image image-fader__image--rear"
					src={images[this.state.nextImageNum].featuredMedia.sourceUrl}
					alt={images[this.state.nextImageNum].title}
				/>
			</div>
		);
	}
}

export default ImageFader;
