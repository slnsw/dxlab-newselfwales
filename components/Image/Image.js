import { Component } from 'react';
import PropTypes from 'prop-types';

import './Image.css';

class Image extends Component {
	static propTypes = {
		className: PropTypes.string,
		src: PropTypes.string,
		alt: PropTypes.string,
		onLoad: PropTypes.func,
	};

	state = {
		isLoaded: false,
	};

	handleImageLoaded = (event) => {
		this.setState({
			isLoaded: true,
		});

		if (typeof this.props.onLoad === 'function') {
			this.props.onLoad(event);
		}
	};

	render() {
		const { className, src, alt } = this.props;
		const { isLoaded } = this.state;

		return (
			<img
				className={[
					`image`,
					className || '',
					isLoaded ? 'image--is-loaded' : '',
				].join(' ')}
				src={src}
				style={{
					marginBottom: '-4px',
				}}
				alt={alt}
				onLoad={this.handleImageLoaded}
			/>
		);
	}
}

export default Image;
