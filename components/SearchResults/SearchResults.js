import { Component } from 'react';
import PropTypes from 'prop-types';
// import InfiniteScroll from 'react-infinite-scroller';

import PackeryImages from '../PackeryImages';
import InfiniteScroll from '../InfiniteScroll';
// import LoaderText from '../LoaderText';
import './SearchResults.css';

class SearchResults extends Component {
	static propTypes = {
		images: PropTypes.array,
		isLoading: PropTypes.bool,
		isLoadingMore: PropTypes.bool,
		hasMore: PropTypes.bool,
		onImageClick: PropTypes.func,
		onLoadMore: PropTypes.func,
		onImageKeyPress: PropTypes.func,
	};

	static defaultProps = {
		images: [],
	};

	handleImageClick = (event, image) => {
		if (typeof this.props.onImageClick === 'function') {
			this.props.onImageClick(event, image);
		}
	};

	handleLoadMore = () => {
		if (typeof this.props.onLoadMore === 'function') {
			this.props.onLoadMore();
		}
	};

	render() {
		const {
			images,
			className,
			hasMore,
			isLoadingMore,
			onImageKeyPress,
		} = this.props;

		return (
			<div className="search-results">
				<InfiniteScroll
					pageStart={0}
					// loadMore={this.handleLoadMore}
					hasMore={hasMore}
					isHorizontal={true}
					// loader={<div className="search-results__loader">Loading ...</div>}
					useWindow={false}
					threshold={100}
				>
					<PackeryImages
						images={images}
						marginTop={'-5px'}
						heightAdjust={'0px'}
						gridSize="lg"
						className={className}
						isLoading={isLoadingMore}
						transitionDuration={'0.6s'}
						stagger={50}
						onImageClick={this.handleImageClick}
						onImageKeyPress={onImageKeyPress}
					/>
				</InfiniteScroll>

				{(hasMore || isLoadingMore) && (
					// <LoaderText className="search-results__loading-more" />
					<button
						className="button button--xs search-results__load-more-button"
						onClick={this.handleLoadMore}
					>
						Load More
					</button>
				)}
			</div>
		);
	}
}

export default SearchResults;
