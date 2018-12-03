import { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
// import queryString from 'query-string';

// import PackeryImages from '../PackeryImages';
import SearchResults from '../SearchResults';
import { processImagesType } from '../../reducers/imageFeedReducer';
import LoaderText from '../LoaderText';

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

	state = { inputTextValue: '', offset: 20, hasMore: true };

	componentDidMount() {
		this.setState({ inputTextValue: this.props.url.query.q });
	}

	componentDidUpdate(prevProps) {
		if (prevProps.url.query.q !== this.props.url.query.q) {
			this.setState({ inputTextValue: this.props.url.query.q });
		}
	}

	handleImageClick = (event, image) => {
		if (typeof this.props.onImageClick === 'function') {
			this.props.onImageClick(event, image);
		}
	};

	render() {
		const { className } = this.props;
		const { inputTextValue } = this.state;

		if (!inputTextValue) {
			return null;
		}

		return (
			<Query
				query={SEARCH_QUERY}
				variables={{
					search: inputTextValue, // (this.state.inputTextValue ? this.state.inputTextValue : ''),
					limit: 20,
					offset: 0,
				}}
			>
				{({ loading, error, data, fetchMore }) => {
					if (loading) {
						return <LoaderText className="search-results__notification" />;
					}

					if (error) {
						console.log(error);
						return null;
					}

					const images = buildImages(data);

					if (inputTextValue && (!images || images.length === 0)) {
						return (
							<div className="search-results__notification">
								Sorry, there are no results for{' '}
								<strong>{inputTextValue}</strong>.
							</div>
						);
					}

					return (
						<SearchResults
							images={images}
							marginTop={'-5px'}
							heightAdjust={'0px'}
							gridSize="lg"
							className={className}
							isLoading={loading}
							hasMore={this.state.hasMore}
							onImageClick={this.handleImageClick}
							// WIP
							onLoadMore={() =>
								fetchMore({
									variables: {
										offset: this.state.offset,
									},
									updateQuery: (prev, { fetchMoreResult }) => {
										if (!fetchMoreResult) return prev;

										console.log(fetchMoreResult.newSelfWales.portraits.length);
										console.log(this.state.offset);

										if (fetchMoreResult.newSelfWales.portraits.length === 0) {
											this.setState({
												hasMore: false,
											});
										} else {
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
											},
										};
									},
								})
							}
						/>
					);
				}}
			</Query>
		);
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

export default SearchResultsContainer;
