import { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Search from '../Search';
import { Router } from '../../routes';
import './SearchContainer.css';

class SearchContainer extends Component {
	static propTypes = {
		q: PropTypes.string,
	};

	state = { inputTextValue: '' };

	componentDidMount() {
		this.setState({ inputTextValue: this.props.q });
	}

	handleFormSubmit = (event, value) => {
		Router.pushRoute(`/search?q=${value}`);
		this.setState({ inputTextValue: value });

		event.preventDefault();
	};

	render() {
		const { inputTextValue } = this.state;

		return (
			<div className="search-container">
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

						console.log(data);

						return (
							<Search
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
							/>
						);
					}}
				</Query>
			</div>
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

export default SearchContainer;
