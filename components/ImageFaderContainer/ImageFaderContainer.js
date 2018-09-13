import { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

import ImageFader from '../ImageFader';
import { fetchFaderImages } from '../../actions/imageFaderActions';
import './ImageFaderContainer.css';

class ImageFaderContainer extends Component {
	// static propTypes = {};

	componentDidMount() {
		this.props.dispatch(
			fetchFaderImages({
				limit: this.props.limit,
			}),
		);
	}
	render() {
		const { images } = this.props;
		return <ImageFader images={images} />;
	}
}

export default connect((state) => {
	return state.imageFader;
})(ImageFaderContainer);
