import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Fuse from 'fuse.js';

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
		searchData: [],
		searchResults: [],
	};

	componentDidMount() {
		this.setState({ inputTextValue: this.props.q });
		fetch('/static/newselfwales/json/search-data.json')
			.then((r) => r.json())
			.then((d) => {
				const newData = Object.keys(d.data).map((k) => d.data[k]);
				this.setState({ searchData: newData });
				//   setLoading(false);
				console.log('search data loaded', typeof newData);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.q !== this.props.q) {
			this.setState({
				inputTextValue: this.props.q,
				isFirstLoad: true,
			});
		}
		if (
			this.state.inputTextValue &&
			this.state.inputTextValue.length >= MININUM_LETTERS
		) {
			const searchOptions = {
				includeScore: true,
				threshold: 0,
				ignoreLocation: true,
				keys: [
					'content',
					'title',
					'galleryName',
					'instagramUsername',
					'location',
					'locationSlug',
					'userDescription',
				],
			};
			const fuse = new Fuse(this.state.searchData, searchOptions);
			const result = fuse.search(this.state.inputTextValue);
			const sd = result
				? result.map((item) => {
						return item.item;
				  })
				: [];

			// console.log('sd', sd);
			const ig = sd.filter((item) => {
				return item['__typename'] === 'NewSelfWalesInstagramSelfie';
			});
			const gal = sd.filter((item) => {
				return item['__typename'] === 'NewSelfWalesGallerySelfie';
			});
			const port = sd.filter((item) => {
				return item['__typename'] === 'NewSelfWalesPortrait';
			});

			const filter = this.props.filters && this.props.filters[0];

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

			const res = {
				newSelfWales: {
					gallerySelfies: skipGallerySelfies ? [] : gal.slice(0, 60),
					instagramSelfies: skipInstagramSelfies ? [] : ig.slice(0, 60),
					portraits: skipPortraits ? [] : port.slice(0, 60),
					__typename: 'NewSelfWales',
				},
				// variables: {
				// 	limit: 20,
				// 	offset: 0,
				// 	search: 'people',
				// 	skipAll: false,
				// 	skipGallerySelfies: false,
				// 	skipInstagramSelfies: false,
				// 	skipPortraits: false,
				// },
				imageCount: sd.length,
			};

			// console.log('## SERACH result', result);
			// console.log('this.state.searchResults', this.state.searchResults);
			// console.log('## data result', sd);
			// console.log(typeof this.state.searchResults);
			// console.log(typeof sd);
			// console.log('boolean', this.state.searchResults === sd);
			if (
				sd.length > 0 &&
				(this.state.searchResults.imageCount !== sd.length ||
					this.props.filters !== prevProps.filters)
			) {
				// console.log('setting state');
				this.setState({ searchResults: res });
			}
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
		const { inputTextValue, isFirstLoad, searchResults } = this.state;
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

		const images2 = dedupeByField(buildImages(data), 'id');
		const images = dedupeByField(buildImages(searchResults), 'id');
		console.log('new search', images);
		console.log('old search', images2);
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
