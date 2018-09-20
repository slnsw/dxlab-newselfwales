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
		timePerImage: 6000, // total time including fade
		fadeTimePerImage: 3000, // length of fade (needs to match CSS)
	};

	state = {
		imageNum: 0,
		imageUrl: null,
		imageTitle: null,
		nextImageUrl: null,
		nextImageTitle: null,
		isFading: false,
		isFirstImages: false,
	};

	componentDidUpdate(prevProps) {
		if (prevProps.images.length && prevProps.images !== this.props.images) {
			const lastID = prevProps.images.length - 1;
			this.setState({
				imageNum: -1,
				imageUrl: prevProps.images[lastID].featuredMedia.sourceUrl,
				nextImageUrl: this.props.images[0].featuredMedia.sourceUrl,
				imageTitle: prevProps.images[lastID].title,
				nextImageTitle: this.props.images[0].title,
			});
			this.stopFade();
			this.startTimeout();
		}
		if (this.state.isFirstImages === false && this.props.images.length > 0) {
			console.log(this.state);
			this.init();
			this.setState({
				isFirstImages: true,
			});
		}
	}

	init = () => {
		this.setState({
			imageUrl: this.props.images[0].featuredMedia.sourceUrl,
			imageTitle: this.props.images[0].title,
			nextImageUrl: this.props.images[1].featuredMedia.sourceUrl,
			nextImageTitle: this.props.images[1].title,
		});
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
			if (this.state.imageNum < this.props.images.length - 2) {
				const nextNum = this.state.imageNum + 1;
				this.setState({
					imageNum: nextNum,
					imageUrl: this.props.images[nextNum].featuredMedia.sourceUrl,
					imageTitle: this.props.images[nextNum].title,
					nextImageUrl: this.props.images[nextNum + 1].featuredMedia.sourceUrl,
					nextImageTitle: this.props.images[nextNum + 1].title,
				});
				this.startTimeout();
			} else if (typeof this.props.onNoMoreImages === 'function') {
				clearTimeout(this.lastStopFade);
				this.props.onNoMoreImages();
			}
		}, this.props.timePerImage);
	};

	render() {
		if (!this.props.images.length) {
			return null;
		}
		return (
			<div className="image-fader">
				<img
					className={[
						'image-fader__image',
						this.state.isFading ? 'image-fader__image--is-fading' : '',
					].join(' ')}
					src={this.state.imageUrl}
					alt={this.state.imageTitle}
				/>
				<img
					className="image-fader__image image-fader__image--rear"
					src={this.state.nextImageUrl}
					alt={this.state.nextImageTitle}
				/>
			</div>
		);
	}
}

export default ImageFader;
