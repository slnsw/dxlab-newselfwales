import { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './ImageFeedContainer.css';
import ImageFeed from '../ImageFeed';
import { dedupeByField } from '../../lib/dedupe';
import logBase from '../../lib/log';

const log = (...args) => {
	return logBase('<ImageFeedContainer />', ...args);
};

class ImageFeedContainer extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		enableAnimation: PropTypes.bool,
		maxImages: PropTypes.number,
		startImages: PropTypes.number,
		loadMoreGap: PropTypes.number,
		// fetchMoreImages: PropTypes.number,
		onImagesUpdate: PropTypes.func,
		onImageClick: PropTypes.func,
		onLayoutComplete: PropTypes.func,
		onMaxImagesComplete: PropTypes.func,
	};

	static defaultProps = {
		enableAnimation: undefined,
		maxImages: 1000,
		startImages: 50,
		// fetchMoreImages: 10,
		intervalTime: 10000,
	};

	constructor() {
		super();

		this.state = {
			enableAnimation: true,
			increment: 0.5,
			shouldHideAllImages: false,
		};
	}

	componentDidMount() {
		log('mount');

		window.addEventListener('keyup', this.handleKey, true);

		if (this.props.enableAnimation !== this.state.enableAnimation) {
			this.setState({
				enableAnimation: this.props.enableAnimation,
			});
		}

		// const timeout = setTimeout(() => {
		// 	console.log(this.props.);

		// }, timeout);
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
	}

	handleMaxImagesComplete = () => {
		log('handleMaxImagesComplete');

		this.setState({
			shouldHideAllImages: true,
		});

		window.location.reload();
	};

	handleKey = (event) => {
		// TODO: Disable this when photobooth form is running
		if (event.code === 'ArrowUp') {
			this.setState(
				{
					increment: this.state.increment + 0.1,
				},
				() => console.log('increment: ', this.state.increment),
			);
		} else if (event.code === 'ArrowDown') {
			this.setState(
				{
					increment: this.state.increment - 0.1,
				},
				() => console.log('increment: ', this.state.increment),
			);
		} else if (event.code === 'Space') {
			// Disabled for now
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
			enableAnimation,
			name,
			maxImages,
			startImages,
			intervalTime,
			loadMoreGap,
			onImagesUpdate,
			onLayoutComplete,
			// onMaxImagesComplete,
		} = this.props;

		const { increment, shouldHideAllImages } = this.state;

		return (
			<Query
				query={PAGE_QUERY}
				variables={{
					offset: 0,
					limit: startImages,
					// dateStart: '2018-05-17T00:00:00',
					dateStart: new Date().toISOString(),
					portraitPercentage: 0.6,
				}}
				notifyOnNetworkStatusChange={true}
			>
				{({ loading, error, data, fetchMore }) => {
					if (error) {
						console.log(error);
						return null;
					}

					const { feed = [], currentOrUpcoming } = data;

					log('main');
					log(currentOrUpcoming);

					let images = feed.map((image) => {
						// Set image type
						let type;

						/* eslint-disable no-underscore-dangle */
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
						};
					});

					// Run extra functions on images
					if (typeof onImagesUpdate === 'function') {
						images = onImagesUpdate(images);
					}

					return (
						<ImageFeedHolder
							loading={loading}
							name={name}
							images={images}
							maxImages={maxImages}
							enableAnimation={enableAnimation}
							increment={increment}
							intervalTime={intervalTime}
							loadMoreGap={loadMoreGap}
							shouldHideAllImages={shouldHideAllImages}
							onLoadMore={(
								fetchMoreImages = 0,
								currentOrUpcoming = 'CURRENT',
							) =>
								fetchMore({
									variables: {
										offset: images.length,
										limit: fetchMoreImages >= 100 ? 100 : fetchMoreImages,
										dateStart: new Date().toISOString(),
										portraitPercentage: 0.4,
									},
									updateQuery: (prev, { fetchMoreResult }) => {
										if (!fetchMoreResult) return prev;

										// Log out image types
										// console.log(
										// 	fetchMoreResult.feed.map((f) => f.__typename),
										// );

										log({ currentOrUpcoming });

										const newFeed = dedupeByField(
											[...prev.feed, ...fetchMoreResult.feed],
											'id',
										);

										return {
											...prev,
											feed: newFeed.map((image) => ({
												...image,
												// title: 'UPCOMING',
											})),
										};
									},
								})
							}
							onImageClick={(event, image) =>
								this.handleImageClick(event, image)
							}
							onLayoutComplete={onLayoutComplete}
							onMaxImagesComplete={this.handleMaxImagesComplete}
						/>
					);
				}}
			</Query>
		);
	}
}

class ImageFeedHolder extends Component {
	state = {
		currentImages: [],
		upcomingImages: [],
	};

	componentDidUpdate(prevProps) {
		if (prevProps.images !== this.props.images) {
			// console.log(this.props.images);

			this.setState({
				currentImages: this.props.images,
			});
		}
	}

	render() {
		const { currentImages } = this.state;

		return <ImageFeed {...this.props} images={currentImages} />;
	}
}

const PAGE_QUERY = gql`
	query getFeed(
		$limit: Int
		$offset: Int
		$dateStart: String
		$portraitPercentage: Float
	) {
		feed: newSelfWalesFeed(
			dateStart: $dateStart
			limit: $limit
			offset: $offset
			order: ASC
			orderBy: DATE
			portraitPercentage: $portraitPercentage
		) {
			... on NewSelfWalesPortrait {
				id
				title
				date
				featuredMedia {
					sourceUrl
					sizes {
						medium {
							sourceUrl
							width
							height
						}
						full {
							sourceUrl
							width
							height
						}
					}
				}
				__typename
			}
			... on NewSelfWalesInstagramSelfie {
				id
				title
				date
				featuredMedia {
					sourceUrl
					sizes {
						medium {
							sourceUrl
							width
							height
						}
						full {
							sourceUrl
							width
							height
						}
					}
				}
				__typename
			}
			... on NewSelfWalesGallerySelfie {
				id
				title
				date
				featuredMedia {
					sourceUrl
					sizes {
						medium {
							sourceUrl
							width
							height
						}
						full {
							sourceUrl
							width
							height
						}
					}
				}
				__typename
			}
		}
	}
`;

export default ImageFeedContainer;
