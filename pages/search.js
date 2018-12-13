import { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

import App from '../components/App';
import SearchResultsContainer from '../components/SearchResultsContainer';
import { client } from '../lib/initApollo';

import './gallery.css';

class SearchPage extends Component {
	constructor() {
		super();

		this.state = {
			enableAnimation: true,
		};
	}

	render() {
		const { url } = this.props;

		return (
			<ApolloProvider client={client}>
				<App>
					<SearchResultsContainer url={url} />
				</App>
			</ApolloProvider>
		);
	}
}

export default SearchPage;
