import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import {
	InMemoryCache,
	IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import fetch from 'isomorphic-unfetch';

import {
	SubscriptionClient,
	// addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';

import introspectionQueryResultData from './fragmentTypes.json';

let link;

const fragmentMatcher = new IntrospectionFragmentMatcher({
	introspectionQueryResultData,
});

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
	global.fetch = fetch;

	// Create regular NetworkInterface by using apollo-client's API:
	link = new HttpLink({
		uri: process.env.GRAPHQL_URL, // Your GraphQL endpoint
	});
} else {
	// Create WebSocket client
	const subscriptionClient = new SubscriptionClient(
		process.env.GRAPHQL_SUBSCRIPTIONS_URL,
		{
			reconnect: true,
			// connectionParams: {
			// 	// Pass any arguments you want for initialization
			// },
		},
	);

	const wsLink = new WebSocketLink(subscriptionClient);

	// Create regular NetworkInterface by using apollo-client's API:
	const httpLink = new HttpLink({
		uri: process.env.GRAPHQL_URL, // Your GraphQL endpoint
	});

	// using the ability to split links, you can send data to each link
	// depending on what kind of operation is being sent
	link = split(
		// split based on operation type
		({ query }) => {
			const { kind, operation } = getMainDefinition(query);
			return kind === 'OperationDefinition' && operation === 'subscription';
		},
		wsLink,
		httpLink,
	);
}

// Create a WebSocket link:
// const wsLink = new WebSocketLink({
// 	uri: 'ws://localhost:5000/subscriptions',
// 	options: {
// 		reconnect: true,
// 	},
// });

// Extend the network interface with the WebSocket
// const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
// 	networkInterface,
// 	// wsClient,
// );

export const client = new ApolloClient({
	// By default, this client will send queries to the
	//  `/graphql` endpoint on the same host
	// Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
	// to a different host
	link,
	// link: process.browser ? link : httpLink,
	// networkInterface,
	// networkInterface: networkInterfaceWithSubscriptions,
	cache: new InMemoryCache({ fragmentMatcher }),
});
