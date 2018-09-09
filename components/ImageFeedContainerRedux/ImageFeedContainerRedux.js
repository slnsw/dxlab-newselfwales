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

	handleMaxImagesComplete = () => {
		this.props.dispatch(
			fetchImages({
				limit: 50,
				dateStart: getDate(-120),
				portraitPercentage: 0.6,
				isUpcoming: true,
			}),
		);
	};

	handleHideAllImagesComplete = () => {
		console.log('hideAllImagesComplete');
		this.props.dispatch({ type: 'CLEAR_CURRENT_IMAGES' });
		this.props.dispatch({ type: 'SWITCH_UPCOMING_TO_CURRENT' });
	};

	render() {
		const { currentImages, status } = this.props;

		return (
			<ImageFeed
				{...this.props}
				images={currentImages}
				status={status}
				onLoadMore={this.handleFetchImages}
				onMaxImagesComplete={this.handleMaxImagesComplete}
				onHideAllImagesComplete={this.handleHideAllImagesComplete}
			/>
		);
	}
}

export default connect((state) => {
	return state.imageFeed;
})(ImageFeedContainerRedux);
