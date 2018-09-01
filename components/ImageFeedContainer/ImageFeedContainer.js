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

	state = {
		enableAnimation: true,
		// increment: 0.5,
		shouldHideAllImages: false,
		status: 'CURRENT', // or UPCOMING
	};

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

		// window.location.reload();
	};

	// handleKey = (event) => {
	// 	// TODO: Disable this when photobooth form is running
	// 	if (event.code === 'ArrowUp') {
	// 		this.setState(
	// 			{
	// 				increment: this.state.increment + 0.1,
	// 			},
	// 			() => console.log('increment: ', this.state.increment),
	// 		);
	// 	} else if (event.code === 'ArrowDown') {
	// 		this.setState(
	// 			{
	// 				increment: this.state.increment - 0.1,
	// 			},
	// 			() => console.log('increment: ', this.state.increment),
	// 		);
	// 	} else if (event.code === 'Space') {
	// 		// Disabled for now
	// 		this.setState({
	// 			enableAnimation: !this.state.enableAnimation,
	// 		});
	// 	}
	// };

	handleImageClick = (event, image) => {
		if (typeof this.props.onImageClick !== 'undefined') {
			this.props.onImageClick(event, image);
		}
	};

	test = () => {
		this.setState({
			status: 'UPCOMING',
		});
	};

	render() {
		const {
			enableAnimation,
			name,
			maxImages,
			startImages,
			increment,
			intervalTime,
			loadMoreGap,
			onImagesUpdate,
			onLayoutComplete,
			// onMaxImagesComplete,
		} = this.props;

		const { shouldHideAllImages, status } = this.state;

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

					const { feed = [] } = data;

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
							status={status}
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

										log(currentOrUpcoming);

										let newFeed = [];

										if (currentOrUpcoming === 'REMOVE_CURRENT') {
											// Remove CURRENT ones, keeping UPCOMING
											// then change UPCOMING images them to CURRENT!
											newFeed = [
												...prev.feed
													.filter((image) => image.test === 'UPCOMING')
													.map((image) => ({
														...image,
														test: 'CURRENT',
													})),
											];
										} else {
											newFeed = dedupeByField(
												[
													...prev.feed,
													...fetchMoreResult.feed.map((image) => ({
														...image,
														test: currentOrUpcoming,
													})),
												],
												'id',
											);
										}

										return {
											...prev,
											feed: newFeed,
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
	static propTypes = {
		status: PropTypes.string,
	};

	state = {
		currentImages: [],
		upcomingImages: [],
		shouldHideAllImages: false,
		isUpcoming: false,
	};

	componentDidUpdate(prevProps) {
		if (prevProps.images !== this.props.images) {
			log(this.props.images);

			// Check if any images have 'UPCOMING'
			if (this.props.images.some((image) => image.test === 'UPCOMING')) {
				this.setState({
					upcomingImages: this.props.images.filter(
						(image) => image.test === 'UPCOMING',
					),
					shouldHideAllImages: true,
					isUpcoming: true,
				});
			} else {
				// if (prevState.shouldHideAllImages !== this.state.shouldHideAllImages) {
				// 	log('hi');
				// }
				this.setState({
					currentImages: this.props.images.filter(
						(image) => image.test !== 'UPCOMING',
					),
					shouldHideAllImages: false,
				});
			}

			// log('UPCOMING');
			// console.log(
			// 	this.props.images.filter((image) => image.test === 'UPCOMING'),
			// );

			this.setState({
				currentImages: this.props.images.filter(
					(image) => image.test !== 'UPCOMING',
				),
				upcomingImages: this.props.images.filter(
					(image) => image.test === 'UPCOMING',
				),
			});
		}
	}

	render() {
		// const { status } = this.props;
		const { currentImages, shouldHideAllImages } = this.state;

		// console.log(status, currentImages);

		return (
			<ImageFeed
				{...this.props}
				images={currentImages}
				shouldHideAllImages={shouldHideAllImages}
			/>
		);
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
				test: status
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
				test: status
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
				test: status
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
