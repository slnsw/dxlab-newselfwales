import gql from 'graphql-tag';
import { client } from '../lib/initApollo';

// ----------------------------------------------------------------------------
// IMAGE FEED ACTIONS
// ----------------------------------------------------------------------------

export const fetchImages = ({ limit, dateStart, portraitPercentage }) => (
	dispatch,
) => {
	dispatch({ type: 'FETCH_IMAGES_REQUEST' });

	return client
		.query({
			query: FEED_QUERY,
			variables: {
				limit: limit > 100 ? 100 : limit,
				dateStart,
				portraitPercentage,
			},
		})
		.then((data) => dispatch({ type: 'FETCH_IMAGES_SUCCESS', payload: data }))
		.catch((error) =>
			dispatch({ type: 'FETCH_IMAGES_FAILURE', payload: error }),
		);
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
				test: status
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
				test: status
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
				test: status
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
