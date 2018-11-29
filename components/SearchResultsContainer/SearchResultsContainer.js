import { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
// import queryString from 'query-string';

// import SearchResults from '../SearchResults';
import ImageFeed from '../ImageFeed';
import { processImagesType } from '../../reducers/imageFeedReducer';
// import { Router } from '../../routes';

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

	state = { inputTextValue: '' };

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

	// handleFormSubmit = (event, value) => {
	// 	// Build new route, base off existing pathname and query variables
	// 	const route = `${this.props.url.pathname}?${queryString.stringify({
	// 		...this.props.url.query,
	// 		q: value,
	// 	})}`;

	// 	Router.pushRoute(route);
	// 	this.setState({ inputTextValue: value });

	// 	event.preventDefault();
	// };

	render() {
		const { className } = this.props;
		// const { url, className, isActive, onInputTextFocus } = this.props;
		const { inputTextValue } = this.state;

		// console.log('SearchResultsContainer');

		return (
			<Query
				query={SEARCH_QUERY}
				variables={{
					search: inputTextValue, // (this.state.inputTextValue ? this.state.inputTextValue : ''),
					limit: 20,
				}}
			>
				{({ loading, error, data }) => {
					// if (loading) {
					// 	return <div>Loading</div>;
					// }

					if (error) {
						console.log(error);
						return null;
					}

					// console.log(data);

					const images = buildImages(data);

					return (
						<ImageFeed
							images={images}
							enableAnimation={false}
							marginTop={'-5px'}
							heightAdjust={'0px'}
							gridSize="lg"
							className={className}
							isLoading={loading}
							onImageClick={this.handleImageClick}
						/>
					);
					// return (
					// 	<SearchResults
					// 		inputTextValue={inputTextValue}
					// 		portraits={data.newSelfWales && data.newSelfWales.portraits}
					// 		instagramSelfies={
					// 			data.newSelfWales && data.newSelfWales.instagramSelfies
					// 		}
					// 		gallerySelfies={
					// 			data.newSelfWales && data.newSelfWales.gallerySelfies
					// 		}
					// 		loading={loading}
					// 		// onSubmit={this.handleFormSubmit}
					// 		{...this.props}
					// 	/>
					// );
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
	query search($search: String, $limit: Int) {
		newSelfWales {
			instagramSelfies(search: $search, limit: $limit) {
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
			portraits(search: $search, limit: $limit) {
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
			gallerySelfies(search: $search, limit: $limit) {
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
