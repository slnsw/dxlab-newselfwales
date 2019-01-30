import { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// import { client } from '../lib/initApollo2';
import TestFeed from '../components/TestFeed';
// import withApollo2 from '../lib/withApollo2';

class Test extends Component {
	render() {
		console.log(this.props.data.pages);

		return (
			// <ApolloProvider client={this.props.apolloClient}>
			<TestFeed />
			// </ApolloProvider>
		);
	}
}

const PAGE_QUERY = gql`
	query getFeed {
		pages(slug: "newselfwales") {
			id
			title
			excerpt
			content
		}
	}
`;

export default graphql(PAGE_QUERY)(Test);
