import { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Search from '../Search';
import './SearchContainer.css';

class SearchContainer extends Component {
	// static propTypes = {};
	state = { inputTextValue: '' };

	componentDidMount() {
		this.setState({ inputTextValue: window.location.search.substring(3) });
	}

	handleFormSubmit = ( event ) => { this.setState({ inputTextValue: event.target.value }); }

	render() {
		// const {} = this.props;

		return (
			<div className="search-container">
				<Query
					query={SEARCH_QUERY}
					variables={{
						search: "Residence", // (this.state.inputTextValue ? this.state.inputTextValue : ''),
					}}
				>
					{({ loading, error, data }) => {
						if (loading) {
							return <div />
						}
						if (error) {
							console.log(error);
							return null;
						}
						return <Search 
							inputTextValue={ this.state.inputTextValue }
							onSubmit={ this.handleFormSubmit }
							item=
										/>


					}}
				</Query>
			</div>
		)
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

export default SearchContainer

