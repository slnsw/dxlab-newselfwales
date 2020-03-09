import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

// NOTE: Copied from main project. Keep this in sync.
import introspectionQueryResultData from './fragmentTypes.json';

require('dotenv').config();

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

export default new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEWSELFWALES_GRAPHQL_URL,
    fetch,
  }),
  cache: new InMemoryCache({ fragmentMatcher }),
});
