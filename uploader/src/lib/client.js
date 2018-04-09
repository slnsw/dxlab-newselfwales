import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

export default new ApolloClient({
	link: new HttpLink({
		uri: 'https://dxlab-graphql-proxy.now.sh/graphql',
		fetch,
	}),
	cache: new InMemoryCache(),
});
