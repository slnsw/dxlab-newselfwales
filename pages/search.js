import { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

import App from '../components/App';
import SearchContainer from '../components/SearchContainer';
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

		return (
			<ApolloProvider client={client}>
				<App>
					<SearchContainer />
				</App>
			</ApolloProvider>
		);
	}
}

export default SearchPage;
