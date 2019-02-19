import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import SearchResults from '../SearchResults';
import { processImagesType } from '../../reducers/imageFeedReducer';
import LoaderText from '../LoaderText';
import { dedupeByField } from '../../lib/dedupe';

// Minimum letters requred to start search query
const MININUM_LETTERS = 3;

class SearchResultsContainer extends Component {
	static propTypes = {
		q: PropTypes.string.isRequired,
		filters: PropTypes.array,
		isActive: PropTypes.bool,
		className: PropTypes.string,
		onInputTextFocus: PropTypes.func,
		onInputTextBlur: PropTypes.func,
		onImageClick: PropTypes.func,
		onImageKeyPress: PropTypes.func,
	};

	static defaultProps = {
		q: '',
		filters: [],
	};

	state = {
		inputTextValue: '',
		offset: 20,
		hasMore: true,
		isFirstLoad: true,
	};

	componentDidMount() {
		this.setState({ inputTextValue: this.props.q });
	}

	componentDidUpdate(prevProps) {
		if (prevProps.q !== this.props.q) {
			this.setState({
				inputTextValue: this.props.q,
				isFirstLoad: true,
			});
		}
	}

	handleLoadMore = () => {
		this.props.data.fetchMore({
			variables: {
				offset: this.state.offset,
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) return prev;

				// console.log(fetchMoreResult);

				// NOTE: Need to do complex data merging because some field may be skipped
				// and therefore not show up in results.
				const newSelfWales = {
					...fetchMoreResult.newSelfWales,
					portraits: fetchMoreResult.newSelfWales.portraits || [],
					instagramSelfies: fetchMoreResult.newSelfWales.instagramSelfies || [],
					gallerySelfies: fetchMoreResult.newSelfWales.gallerySelfies || [],
				};

				const prevNewSelfWales = {
					...prev.newSelfWales,
					portraits: prev.newSelfWales.portraits || [],
					instagramSelfies: prev.newSelfWales.instagramSelfies || [],
					gallerySelfies: prev.newSelfWales.gallerySelfies || [],
				};

				if (
					newSelfWales.portraits.length === 0 &&
					newSelfWales.instagramSelfies.length === 0 &&
					newSelfWales.gallerySelfies.length === 0
				) {
					// Stop onLoadMore from running again
					this.setState({
						hasMore: false,
					});
				} else {
					// Increment offset
					this.setState({
						offset: this.state.offset + 20,
					});
				}

				return {
					...prev,
					newSelfWales: {
						...newSelfWales,
						portraits: [
							...prevNewSelfWales.portraits,
							...newSelfWales.portraits,
						],
						instagramSelfies: [
							...prevNewSelfWales.instagramSelfies,
							...newSelfWales.instagramSelfies,
						],
						gallerySelfies: [
							...prevNewSelfWales.gallerySelfies,
							...newSelfWales.gallerySelfies,
						],
					},
				};
			},
		});
	};

	handleImageClick = (event, image) => {
		if (typeof this.props.onImageClick === 'function') {
			this.props.onImageClick(event, image);
		}
	};

	render() {
		const { className, data, onImageKeyPress } = this.props;
		const { inputTextValue, isFirstLoad } = this.state;
		const { loading, error } = data;

		if (!inputTextValue) {
			return null;
		}

		if (loading && isFirstLoad) {
			return <LoaderText className="search-results__notification" />;
		}

		if (error) {
			console.log(data.error);
			return null;
		}

		if (inputTextValue.length < MININUM_LETTERS) {
			return (
				<div className="search-results__notification">
					Please type more than two letters.
				</div>
			);
		}

		const images = dedupeByField(buildImages(data), 'id');

		if (inputTextValue && (!images || images.length === 0)) {
			return (
				<div className="search-results__notification">
					Sorry, there are no results for <strong>{inputTextValue}</strong>.
				</div>
			);
		}

		if (images.length > 0 && isFirstLoad) {
			this.setState({
				isFirstLoad: false,
			});
		}

		return (
			<SearchResults
				images={images}
				className={className}
				isLoading={isFirstLoad === true && loading}
				isLoadingMore={isFirstLoad === false && loading}
				hasMore={this.state.hasMore}
				onImageClick={this.handleImageClick}
				onLoadMore={(page) => this.handleLoadMore(page)}
				onImageKeyPress={onImageKeyPress}
			/>
		);
	}
}

function buildImages(data) {
	if (!data || !data.newSelfWales) {
		return [];
	}

	const portraits = data.newSelfWales.portraits || [];
	const gallerySelfies = data.newSelfWales.gallerySelfies || [];
	const instagramSelfies = data.newSelfWales.instagramSelfies || [];

	const longest = Math.max(
		portraits.length,
		gallerySelfies.length,
		instagramSelfies.length,
	);

	if (longest > 0) {
		const matrix = [
			[...(portraits || [])],
			[...(gallerySelfies || [])],
			[...(instagramSelfies || [])],
		];

		const images = [];

		for (let i = 0; i < longest; i++) {
			for (let o = 0; o < 3; o++) {
				if (
					typeof matrix[o] !== 'undefined' &&
					typeof matrix[o][i] !== 'undefined'
				) {
					images.push(matrix[o][i]);
				}
			}
		}

		return processImagesType(images);
	}
}

const SEARCH_QUERY = gql`
	query search(
		$search: String
		$limit: Int
		$offset: Int
		$skipAll: Boolean!
		$skipInstagramSelfies: Boolean!
		$skipPortraits: Boolean!
		$skipGallerySelfies: Boolean!
	) {
		newSelfWales @skip(if: $skipAll) {
			instagramSelfies(search: $search, limit: $limit, offset: $offset)
				@skip(if: $skipInstagramSelfies) {
				id
				title
				content
				shortcode
				instagramUsername
				timestamp
				location
				locationSlug
				userDescription
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
			portraits(search: $search, limit: $limit, offset: $offset)
				@skip(if: $skipPortraits) {
				id
				title
				content
				portraitName
				archiveNotes
				primoId
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
			gallerySelfies(search: $search, limit: $limit, offset: $offset)
				@skip(if: $skipGallerySelfies) {
				id
				title
				content
				galleryName
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
			__typename
		}
	}
`;

export default graphql(SEARCH_QUERY, {
	options: ({ q = '', filters }) => {
		// console.log(filters);

		const filter = filters && filters[0];

		let skipInstagramSelfies = false;
		let skipPortraits = false;
		let skipGallerySelfies = false;

		if (filter === 'portrait') {
			skipInstagramSelfies = true;
			skipGallerySelfies = true;
		} else if (filter === 'instagram-selfie') {
			skipPortraits = true;
			skipGallerySelfies = true;
		} else if (filter === 'gallery-selfie') {
			skipInstagramSelfies = true;
			skipPortraits = true;
		}

		return {
			variables: {
				search: q,
				limit: 20,
				offset: 0,
				skipAll: q.length < MININUM_LETTERS,
				skipInstagramSelfies,
				skipPortraits,
				skipGallerySelfies,
			},
			notifyOnNetworkStatusChange: true,
		};
	},
	props: ({ data }) => {
		// console.log(data);

		const newSelfWales = data.newSelfWales || {};

		return {
			data: {
				...data,
				newSelfWales: {
					...newSelfWales,
					portraits: newSelfWales.portraits || [],
					instagramSelfies: newSelfWales.instagramSelfies || [],
					gallerySelfies: newSelfWales.gallerySelfies || [],
				},
			},
		};
	},
})(SearchResultsContainer);
