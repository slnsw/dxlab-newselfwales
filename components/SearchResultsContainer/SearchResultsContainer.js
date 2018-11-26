import { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import queryString from 'query-string';

import SearchResults from '../SearchResults';
import { Router } from '../../routes';

class SearchResultsContainer extends Component {
	static propTypes = {
		url: PropTypes.object.isRequired,
		isActive: PropTypes.bool,
		className: PropTypes.string,
		onInputTextFocus: PropTypes.func,
		onInputTextBlur: PropTypes.func,
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

	handleFormSubmit = (event, value) => {
		// Build new route, base off existing pathname and query variables
		const route = `${this.props.url.pathname}?${queryString.stringify({
			...this.props.url.query,
			q: value,
		})}`;

		Router.pushRoute(route);
		this.setState({ inputTextValue: value });

		event.preventDefault();
	};

	render() {
		// const { url, className, isActive, onInputTextFocus } = this.props;
		const { inputTextValue } = this.state;

		return (
			<Query
				query={SEARCH_QUERY}
				variables={{
					search: inputTextValue, // (this.state.inputTextValue ? this.state.inputTextValue : ''),
				}}
			>
				{({ loading, error, data }) => {
					// if (loading) {
					// 	return <div />;
					// }

					if (error) {
						console.log(error);
						return null;
					}

					// console.log(data);

					return (
						<SearchResults
							inputTextValue={inputTextValue}
							portraits={data.newSelfWales && data.newSelfWales.portraits}
							instagramSelfies={
								data.newSelfWales && data.newSelfWales.instagramSelfies
							}
							gallerySelfies={
								data.newSelfWales && data.newSelfWales.gallerySelfies
							}
							loading={loading}
							onSubmit={this.handleFormSubmit}
							{...this.props}
						/>
					);
				}}
			</Query>
		);
	}
}

const SEARCH_QUERY = gql`
	query search($search: String) {
		newSelfWales {
			instagramSelfies(search: $search) {
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
				}
			}
			__typename
			portraits(search: $search) {
				id
				title
				content
				portraitName
				archiveNotes
				primoId
				featuredMedia {
					sourceUrl
				}
			}
			__typename
			gallerySelfies(search: $search) {
				id
				title
				content
				galleryName
				featuredMedia {
					sourceUrl
				}
			}
			__typename
		}
	}
`;

export default SearchResultsContainer;
