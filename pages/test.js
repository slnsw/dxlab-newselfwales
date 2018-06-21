import { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

import { client } from '../lib/initApollo2';
import TestFeed from '../components/TestFeed';

export default class Test extends Component {
	render() {
		return (
			<ApolloProvider client={client}>
				<TestFeed />
			</ApolloProvider>
		);
	}
}
