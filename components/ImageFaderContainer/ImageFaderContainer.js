import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ImageFader from '../ImageFader';
import { fetchFaderImages } from '../../actions/imageFaderActions';
import './ImageFaderContainer.css';

class ImageFaderContainer extends Component {
	static propTypes = {
		limit: PropTypes.number,
	};

	componentDidMount() {
		this.fetchImages();
	}

	handleNoMoreImages = () => {
		this.fetchImages();
	};

	fetchImages = () => {
		this.props.dispatch(
			fetchFaderImages({
				limit: this.props.limit,
			}),
		);
	};

	render() {
		const { images } = this.props;
		return (
			<ImageFader images={images} onNoMoreImages={this.handleNoMoreImages} />
		);
	}
}

export default connect((state) => {
	return state.imageFader;
})(ImageFaderContainer);
