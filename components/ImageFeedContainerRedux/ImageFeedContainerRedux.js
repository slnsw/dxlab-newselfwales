import { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './ImageFeedContainerRedux.css';

class ImageFeedContainerRedux extends Component {
	// static propTypes = {};

	render() {
		// const {} = this.props;
		console.log(this.props);

		return (
			<div className="image-feed-container-redux">
				<span />
			</div>
		);
	}
}

export default connect((state) => {
	// console.log(state.example);

	return state.example;
})(ImageFeedContainerRedux);
