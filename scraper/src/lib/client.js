import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

require('dotenv').config();

export default new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEWSELFWALES_GRAPHQL_URL,
    fetch,
  }),
  cache: new InMemoryCache(),
});
