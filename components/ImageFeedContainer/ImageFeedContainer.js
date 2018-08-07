import { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './ImageFeedContainer.css';
import ImageFeed from '../ImageFeed';
import shuffle from '../../lib/shuffle';

class ImageFeedContainer extends Component {
	static propTypes = {
		enableAnimation: PropTypes.bool,
		maxImages: PropTypes.number,
		startImages: PropTypes.number,
		fetchMoreImages: PropTypes.number,
		onImagesUpdate: PropTypes.func,
		onImageClick: PropTypes.func,
		onLayoutComplete: PropTypes.func,
	};

	static defaultProps = {
		enableAnimation: undefined,
		maxImages: 1000,
		startImages: 50,
		fetchMoreImages: 2,
		intervalTime: 10000,
	};

	constructor() {
		super();

		this.state = {
			enableAnimation: false,
			increment: 0.5,
		};
	}

	componentDidMount() {
		window.addEventListener('keyup', this.handleKey, true);

		if (this.props.enableAnimation !== this.state.enableAnimation) {
			this.setState({
				enableAnimation: this.props.enableAnimation,
			});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// Handle controlled/uncontrolled props/state
		if (
			// Check props is defined
			typeof this.props.enableAnimation !== 'undefined' &&
			// Compare props and state
			this.props.enableAnimation !== this.state.enableAnimation &&
			// Ensure internal state can still be changed
			prevState.enableAnimation === this.state.enableAnimation
		) {
			this.setState({
				enableAnimation: this.props.enableAnimation,
			});
		}

		if (prevProps.images !== this.props.images) {
			console.log('hi');
		}
	}

	handleKey = (event) => {
		if (event.code === 'ArrowUp') {
			this.setState(
				{
					increment: this.state.increment + 0.5,
				},
				() => console.log('increment: ', this.state.increment),
			);
		} else if (event.code === 'ArrowDown') {
			this.setState(
				{
					increment: this.state.increment - 0.5,
				},
				() => console.log('increment: ', this.state.increment),
			);
		} else if (event.code === 'Space') {
			this.setState({
				enableAnimation: !this.state.enableAnimation,
			});
		}
	};

	handleImageClick = (event, image) => {
		if (typeof this.props.onImageClick !== 'undefined') {
			this.props.onImageClick(event, image);
		}
	};

	render() {
		const {
			maxImages,
			startImages,
			fetchMoreImages,
			intervalTime,
			onImagesUpdate,
			onLayoutComplete,
		} = this.props;

		const { enableAnimation, increment } = this.state;

		return (
			<div className="image-feed-container">
				<Query
					query={PAGE_QUERY}
					variables={{
						offset: 0,
						limit: startImages,
					}}
				>
					{({ loading, error, data, fetchMore }) => {
						if (loading) {
							return <div />;
						}

						if (error) {
							console.log(error);
							return null;
						}

						let images = data.newSelfWales.portraits
							.concat(data.newSelfWales.selfies)
							.map((portrait) => {
								return {
									...portrait,
									imageUrl: portrait.featuredMedia.sourceUrl,
								};
							});

						if (typeof onImagesUpdate === 'function') {
							images = onImagesUpdate(images);
						}

						return (
							<ImageFeed
								images={shuffle(images)}
								maxImages={maxImages}
								enableAnimation={enableAnimation}
								increment={increment}
								intervalTime={intervalTime}
								onLoadMore={() =>
									fetchMore({
										variables: {
											offset: images.length,
											limit: fetchMoreImages,
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (!fetchMoreResult) return prev;

											return Object.assign({}, prev, {
												portraits: [
													...prev.portraits,
													...fetchMoreResult.portraits,
												],
											});
										},
									})
								}
								onImageClick={(event, image) =>
									this.handleImageClick(event, image)
								}
								onLayoutComplete={onLayoutComplete}
							/>
						);
					}}
				</Query>
			</div>
		);
	}
}

const PAGE_QUERY = gql`
	query getFeed($offset: Int, $limit: Int) {
		pages(slug: "newselfwales") {
			id
			title
			excerpt
			content
		}
		# portraits: newSelfWalesPortraits(offset: $offset, limit: $limit) {
		# 	id
		# 	title
		# 	featuredMedia {
		# 		sourceUrl
		# 	}
		# }
		newSelfWales {
			selfies: instagramSelfies(isRandom: true) {
				id
				title
				featuredMedia {
					sourceUrl
				}
			}
			portraits(limit: $limit, offset: $offset, isRandom: true) {
				id
				title
				featuredMedia {
					sourceUrl
				}
			}
		}
	}
`;

export default ImageFeedContainer;
