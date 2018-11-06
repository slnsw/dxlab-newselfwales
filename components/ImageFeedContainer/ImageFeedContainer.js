import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ImageFeed from '../ImageFeed';
import { fetchImages, subscribeToImages } from '../../actions/imageFeedActions';
import logBase from '../../lib/log';
import { getDate } from '../../lib/date';
import './ImageFeedContainer.css';

const log = (...args) => {
	return logBase('<ImageFeedContainer />', ...args);
};

class ImageFeedContainer extends Component {
	static propTypes = {
		startImages: PropTypes.number,
		currentImages: PropTypes.array,
	};

	static defaultProps = {
		startImages: 50,
		currentImages: [],
	};

	componentDidMount() {
		// Initial Fetch
		this.handleFetchImages({
			limit: this.props.startImages,
			dateStart: getDate(-120),
			portraitPercentage: 0.6,
			isFirstFetch: true,
		});

		this.props.dispatch(subscribeToImages());
	}

	handleFetchImages = ({
		limit,
		dateStart,
		portraitPercentage,
		isFirstFetch = false,
	}) => {
		console.log('handleFetchImages');

		this.props.dispatch(
			fetchImages({
				limit,
				dateStart,
				portraitPercentage,
				isFirstFetch,
			}),
		);
	};

	handleLoadMore = ({ limit }) => {
		this.props.dispatch({
			type: 'IMAGE_FEED_MOVE_UPCOMING_TO_CURRENT_IMAGES',
			limit,
		});
	};

	handleMaxImagesComplete = () => {
		log('handleMaxImagesComplete');

		this.props.dispatch({
			type: 'IMAGE_FEED_UPCOMING_IMAGES_READY',
		});

		// this.props.dispatch(
		// 	fetchImages({
		// 		limit: this.props.startImages,
		// 		dateStart: getDate(-120),
		// 		portraitPercentage: 0.6,
		// 		isUpcoming: true,
		// 	}),
		// );
	};

	handleHideAllImagesComplete = () => {
		log('handleHideAllImagesComplete');
		this.props.dispatch({ type: 'IMAGE_FEED_CLEAR_CURRENT_IMAGES' });
		// this.props.dispatch({ type: 'SWITCH_UPCOMING_TO_CURRENT' });

		this.props.dispatch({
			type: 'IMAGE_FEED_MOVE_UPCOMING_TO_CURRENT_IMAGES',
			limit: this.props.startImages,
		});
	};

	// handleFetchedImagesReady = () => {
	// 	log('handleFetchedImagesReady');
	// 	this.props.dispatch({ type: 'MOVE_FETCHED_TO_CURRENT_IMAGES' });
	// };

	render() {
		const { currentImages, status } = this.props;

		return (
			<ImageFeed
				{...this.props}
				images={currentImages}
				status={status}
				// onLoadMore={this.handleFetchImages}
				onLoadMore={this.handleLoadMore}
				onMaxImagesComplete={this.handleMaxImagesComplete}
				onHideAllImagesComplete={this.handleHideAllImagesComplete}
				onFetchedImagesReady={this.handleFetchedImagesReady}
			/>
		);
	}
}

export default connect((state) => {
	return state.imageFeed;
})(ImageFeedContainer);
