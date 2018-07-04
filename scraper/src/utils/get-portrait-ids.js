import client from '../lib/client';
import gql from 'graphql-tag';

export default async (term, offset, limit) => {
  return await client.query({
    query: gql`
      query getPortraitIds($offset: Int!, $limit: Int!, $term: String!) {
        primoSearch(search: $term, facets: [
          {
            slug: "local6",
            value: "Archival digital"
          }
        ], 
        offset: $offset, limit: $limit) {
          records {
            id
          }
          info {
            total
          }
        }
      }
    `,
    variables: {
      term,
      offset,
      limit,
    },
  });
};