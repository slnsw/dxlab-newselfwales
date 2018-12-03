import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import SearchResults from '../SearchResults';
import { processImagesType } from '../../reducers/imageFeedReducer';
import LoaderText from '../LoaderText';
import { dedupeByField } from '../../lib/dedupe';

class SearchResultsContainer extends Component {
	static propTypes = {
		url: PropTypes.object.isRequired,
		isActive: PropTypes.bool,
		className: PropTypes.string,
		onInputTextFocus: PropTypes.func,
		onInputTextBlur: PropTypes.func,
		onImageClick: PropTypes.func,
	};

	static defaultProps = {
		url: {
			query: {
				q: '',
			},
		},
	};

	state = {
		inputTextValue: '',
		offset: 20,
		hasMore: true,
		isFirstLoad: true,
	};

	componentDidMount() {
		this.setState({ inputTextValue: this.props.url.query.q });
	}

	componentDidUpdate(prevProps) {
		if (prevProps.url.query.q !== this.props.url.query.q) {
			this.setState({
				inputTextValue: this.props.url.query.q,
				isFirstLoad: true,
			});
		}
	}

	handleImageClick = (event, image) => {
		if (typeof this.props.onImageClick === 'function') {
			this.props.onImageClick(event, image);
		}
	};

	render() {
		const { className, data } = this.props;
		const { inputTextValue, isFirstLoad } = this.state;
		const { loading, fetchMore, error } = data;

		if (!inputTextValue) {
			return null;
		}

		// return (
		// <Query
		// 	query={SEARCH_QUERY}
		// 	variables={{
		// 		search: inputTextValue, // (this.state.inputTextValue ? this.state.inputTextValue : ''),
		// 		limit: 20,
		// 		offset: 0,
		// 	}}
		// 	notifyOnNetworkStatusChange={true}
		// >
		// 	{({ loading, error, data, fetchMore }) => {

		if (loading && isFirstLoad) {
			return <LoaderText className="search-results__notification" />;
		}

		if (error) {
			console.log(data.error);
			return null;
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
				onLoadMore={() =>
					fetchMore({
						variables: {
							offset: this.state.offset,
						},
						updateQuery: (prev, { fetchMoreResult }) => {
							if (!fetchMoreResult) return prev;

							if (fetchMoreResult.newSelfWales.portraits.length === 0) {
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
									...fetchMoreResult.newSelfWales,
									portraits: [
										...prev.newSelfWales.portraits,
										...fetchMoreResult.newSelfWales.portraits,
									],
									instagramSelfies: [
										...prev.newSelfWales.instagramSelfies,
										...fetchMoreResult.newSelfWales.instagramSelfies,
									],
									gallerySelfies: [
										...prev.newSelfWales.gallerySelfies,
										...fetchMoreResult.newSelfWales.gallerySelfies,
									],
								},
							};
						},
					})
				}
			/>
		);
		// }}
		// </Query>
		// );
	}
}

function buildImages(data) {
	if (!data || !data.newSelfWales) {
		return [];
	}

	const images = [
		...(data.newSelfWales.portraits ? data.newSelfWales.portraits : []),
		...(data.newSelfWales.gallerySelfies
			? data.newSelfWales.gallerySelfies
			: []),
		...(data.newSelfWales.instagramSelfies
			? data.newSelfWales.instagramSelfies
			: []),
	];

	return processImagesType(images);
}

const SEARCH_QUERY = gql`
	query search($search: String, $limit: Int, $offset: Int) {
		newSelfWales {
			instagramSelfies(search: $search, limit: $limit, offset: $offset) {
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
			portraits(search: $search, limit: $limit, offset: $offset) {
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
			gallerySelfies(search: $search, limit: $limit, offset: $offset) {
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
	options: ({ url }) => {
		// console.log(url.query.q);

		return {
			variables: {
				search: url.query.q,
				limit: 20,
				offset: 0,
			},
			notifyOnNetworkStatusChange: true,
		};
	},
})(SearchResultsContainer);
