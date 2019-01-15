import gql from 'graphql-tag';

import client from './lib/client';
// NOTE: Copied from main project. Keep this in sync.
import { getDate } from './lib/date';

export async function hit() {
  console.log('hit');

  const {
    data: { feed },
  } = await getFeed();

  console.log(feed);

  const result = await sendFeed(feed);

  console.log(result);
}

export const getFeed = async () => {
  console.log('getFeed');

  try {
    const result = await client.query({
      query: FEED_QUERY,
      variables: {
        limit: 20,
        dateStart: getDate(-120),
        portraitPercentage: 0.6,
      },
    });

    console.log(result);

    return result;
  } catch (e) {
    console.log(e);

    return null;
  }
};

export const sendFeed = async (value) => {
  try {
    const result = await client.mutate({
      mutation: FEED_MUTATION,
      variables: {
        value: JSON.stringify(value),
      },
    });

    return result;
  } catch (e) {
    console.log(e);

    return null;
  }
};

const FEED_QUERY = gql`
  query getFeed($limit: Int, $dateStart: String, $portraitPercentage: Float) {
    feed: newSelfWalesFeed(
      dateStart: $dateStart
      limit: $limit
      order: ASC
      orderBy: DATE
      portraitPercentage: $portraitPercentage
    ) {
      ... on NewSelfWalesPortrait {
        id
        title
        date
        featuredMedia {
          sourceUrl
          sizes {
            medium {
              sourceUrl
              width
              height
            }
            full {
              sourceUrl
              width
              height
            }
          }
        }
        __typename
      }
      ... on NewSelfWalesInstagramSelfie {
        id
        title
        date
        featuredMedia {
          sourceUrl
          sizes {
            medium {
              sourceUrl
              width
              height
            }
            full {
              sourceUrl
              width
              height
            }
          }
        }
        __typename
      }
      ... on NewSelfWalesGallerySelfie {
        id
        title
        date
        featuredMedia {
          sourceUrl
          sizes {
            medium {
              sourceUrl
              width
              height
            }
            full {
              sourceUrl
              width
              height
            }
          }
        }
        __typename
      }
    }
  }
`;

const FEED_MUTATION = gql`
  mutation sendFeed($value: String) {
    sendControl(
      appId: "NEWSELFWALES"
      channel: "FEED"
      action: "SEND_FEED"
      value: $value
    ) {
      appId
      channel
      action
      value
    }
  }
`;
