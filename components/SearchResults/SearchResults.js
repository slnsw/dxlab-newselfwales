import { Component } from 'react';
import PropTypes from 'prop-types';
// import InfiniteScroll from 'react-infinite-scroller';

import PackeryImages from '../PackeryImages';
import InfiniteScroll from '../InfiniteScroll';
import './SearchResults.css';

class SearchResults extends Component {
	static propTypes = {
		images: PropTypes.array,
		isLoading: PropTypes.bool,
		isLoadingMore: PropTypes.bool,
		hasMore: PropTypes.bool,
		onImageClick: PropTypes.func,
		onLoadMore: PropTypes.func,
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
		const { images, className, hasMore, isLoading, isLoadingMore } = this.props;

		console.log(isLoading, isLoadingMore);

		return (
			<div className="search-results">
				<InfiniteScroll
					pageStart={0}
					loadMore={this.handleLoadMore}
					hasMore={hasMore}
					// loader={<div className="search-results__loader">Loading ...</div>}
					useWindow={false}
				>
					<PackeryImages
						images={images}
						marginTop={'-5px'}
						heightAdjust={'0px'}
						gridSize="lg"
						className={className}
						isLoading={isLoadingMore}
						onImageClick={this.handleImageClick}
					/>
				</InfiniteScroll>
			</div>
		);
	}
}

export default SearchResults;
