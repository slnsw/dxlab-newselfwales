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
		const { url } = this.props;

		return (
			<ApolloProvider client={client}>
				<App>
					<SearchContainer url={url} />
				</App>
			</ApolloProvider>
		);
	}
}

export default SearchPage;
