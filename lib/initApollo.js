import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'isomorphic-unfetch';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import {
	SubscriptionClient,
	// addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
	global.fetch = fetch;
}

function create(initialState) {
	let link;
	const httpLink = new HttpLink({
		uri: process.env.GRAPHQL_URL, // Your GraphQL endpoint
	});

	if (!process.browser) {
		// Server Side
		link = httpLink;
	} else {
		// Browser

		// Create WebSocket client
		const subscriptionClient = new SubscriptionClient(
			process.env.GRAPHQL_SUBSCRIPTIONS_URL,
			{
				reconnect: true,
				// connectionParams: {
				// 	// Pass any arguments you want for initialization
				// },
			},
			null,
			// This empty array of 'websocket protocols' is needed to prevent 'error during WebSocket handshake: Sent non-empty 'Sec-WebSocket-Protocol' header but no response was received' issue on Chrome
			[],
		);

		const wsLink = new WebSocketLink(subscriptionClient);

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

	return new ApolloClient({
		// connectToDevTools: process.browser,
		ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
		link,
		// link: new HttpLink({
		// 	uri: process.env.GRAPHQL_URL, // Server URL (must be absolute)
		// 	credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
		// }),
		cache: new InMemoryCache().restore(initialState || {}),
	});
}

export default function initApollo(initialState) {
	// Make sure to create a new client for every server-side request so that data
	// isn't shared between connections (which would be bad)
	if (!process.browser) {
		return create(initialState);
	}

	// Reuse client on the client-side
	if (!apolloClient) {
		apolloClient = create(initialState);
	}

	return apolloClient;
}

export const client = initApollo();
