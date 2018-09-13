import { Component } from 'react';
import PropTypes from 'prop-types';

import './ImageFader.css';

class ImageFader extends Component {
	static propTypes = { images: PropTypes.array };

	render() {
		const { images } = this.props;
console.log(images);
		if (!images.length) {
			return null;
		}

		return (
			<div className="image-fader">
				<img
					src={images[0].featuredMedia.sizes.medium.sourceUrl}
					alt={images[0].title}
				/>
			</div>
		);
	}
}

export default ImageFader;
