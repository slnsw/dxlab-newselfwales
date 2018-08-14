import { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './ImageFeedContainer.css';
import ImageFeed from '../ImageFeed';
// import shuffle from '../../lib/shuffle';

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
		startImages: 100,
		fetchMoreImages: 10,
		intervalTime: 20000,
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
		// TODO: Disable this when photobooth form is running
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
			// Disabled for now
			// this.setState({
			// 	enableAnimation: !this.state.enableAnimation,
			// });
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
						dateStart: '2018-05-17T00:00:00',
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

						const { feed } = data;

						let images = feed.map((image) => {
							// Set image type
							let type;

							const { __typename } = image;
							if (__typename === 'NewSelfWalesPortrait') {
								type = 'portrait';
							} else if (__typename === 'NewSelfWalesInstagramSelfie') {
								type = 'instagram-selfie';
							} else if (__typename === 'NewSelfWalesGallerySelfie') {
								type = 'gallery-selfie';
							}

							return {
								...image,
								type,
								imageUrl: image.featuredMedia && image.featuredMedia.sourceUrl,
							};
						});

						if (typeof onImagesUpdate === 'function') {
							images = onImagesUpdate(images);
						}

						return (
							<ImageFeed
								images={images}
								maxImages={maxImages}
								enableAnimation={enableAnimation}
								increment={increment}
								intervalTime={intervalTime}
								onLoadMore={() =>
									fetchMore({
										variables: {
											offset: images.length,
											limit: fetchMoreImages,
											dateStart: '2018-05-17T00:00:00',

											// dateStart: new Date().toISOString(),
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (!fetchMoreResult) return prev;

											console.log(fetchMoreResult);

											return Object.assign({}, prev, {
												feed: [...prev.feed, ...fetchMoreResult.feed.slice(1)],
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
	query getFeed($limit: Int, $offset: Int, $dateStart: String) {
		feed: newSelfWalesFeed(
			dateStart: $dateStart
			limit: $limit
			offset: $offset
			order: ASC
			orderBy: DATE
		) {
			... on NewSelfWalesPortrait {
				id
				title
				date
				featuredMedia {
					sourceUrl
				}
				__typename
			}
			... on NewSelfWalesInstagramSelfie {
				id
				title
				date
				featuredMedia {
					sourceUrl
				}
				__typename
			}
			... on NewSelfWalesGallerySelfie {
				id
				title
				date
				featuredMedia {
					sourceUrl
				}
				__typename
			}
		}
	}
`;

export default ImageFeedContainer;
