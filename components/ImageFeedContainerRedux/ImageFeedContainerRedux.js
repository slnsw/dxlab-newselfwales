import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ImageFeed from '../ImageFeed';
import { fetchImages } from '../../actions/imageFeedActions';
import { getDate } from '../../lib/date';
import './ImageFeedContainerRedux.css';

class ImageFeedContainerRedux extends Component {
	static propTypes = {
		startImages: PropTypes.number,
	};

	static defaultProps = {
		startImages: 50,
	};

	componentDidMount() {
		// Initial Fetch
		this.handleFetchImages({
			limit: this.props.startImages,
			dateStart: getDate(-120),
			portraitPercentage: 0.6,
		});
	}

	handleFetchImages = ({ limit, dateStart, portraitPercentage }) => {
		this.props.dispatch(
			fetchImages({
				limit,
				dateStart,
				portraitPercentage,
			}),
		);
	};

	render() {
		const { currentImages } = this.props;
		// console.log(this.props);

		return (
			<ImageFeed
				{...this.props}
				images={currentImages}
				onLoadMore={this.handleFetchImages}
			/>
		);
	}
}

export default connect((state) => {
	return state.imageFeed;
})(ImageFeedContainerRedux);
