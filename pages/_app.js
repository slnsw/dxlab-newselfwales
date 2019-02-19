import App, { Container } from 'next/app';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
// Access old school JS version otherwise IE11 explodes
import withRedux from 'next-redux-wrapper/lib';
import { withRouter } from 'next/router';

import withApolloClient from '../lib/withApollo';
import { initStore } from '../lib/initRedux';

class MyApp extends App {
	static async getInitialProps({ Component, ctx }) {
		return {
			pageProps: Component.getInitialProps
				? await Component.getInitialProps(ctx)
				: {},
		};
	}

	render() {
		const { Component, pageProps, store, router, apolloClient } = this.props;

		return (
			<Container>
				<ApolloProvider client={apolloClient}>
					<Provider store={store}>
						<Component {...pageProps} router={router} store={store} />
					</Provider>
				</ApolloProvider>
			</Container>
		);
	}
}

export default withApolloClient(withRedux(initStore)(withRouter(MyApp)));
