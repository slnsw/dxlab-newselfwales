import { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

// import { client } from '../lib/initApollo2';
import TestFeed from '../components/TestFeed';
import withApollo2 from '../lib/withApollo2';

class Test extends Component {
	render() {
		return (
			<ApolloProvider client={this.props.apolloClient}>
				<TestFeed />
			</ApolloProvider>
		);
	}
}

export default withApollo2(Test);
