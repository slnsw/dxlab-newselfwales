import client from '../lib/client';
import gql from 'graphql-tag';

export default async (id) => {
  return await client.query({
    query: gql`
      query getPrimoRecord($id: String!) {
        primoRecord(id: $id) {
          id
          title
          date
          personNames
          format
          description
          subjects
          topics
          notes
          physicalDescription
          images(size: FULL) {
            url
            width
            height
            fileNumber
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
};
