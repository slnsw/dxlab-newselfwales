import gql from 'graphql-tag';
import { client } from '../lib/initApollo';

// ----------------------------------------------------------------------------
// IMAGE FEED ACTIONS
// ----------------------------------------------------------------------------

export const fetchImages = ({ limit, dateStart, portraitPercentage }) => async (
	dispatch,
) => {
	dispatch({
		type: 'IMAGE_FEED_FETCH_IMAGES_REQUEST',
	});

	try {
		const data = await client.query({
			query: FEED_QUERY,
			variables: {
				/* eslint-disable no-nested-ternary */
				limit: limit < 0 ? 0 : limit > 100 ? 100 : limit,
				dateStart,
				portraitPercentage,
			},
		});

		dispatch({
			type: 'IMAGE_FEED_FETCH_IMAGES_SUCCESS',
			payload: data,
		});
	} catch (error) {
		console.log(error);

		dispatch({
			type: 'IMAGE_FEED_FETCH_IMAGES_FAILURE',
			payload: error,
		});

		// Copy spare images to the feed incase there is an outage
		// TODO: Needs more finessing, keeps on running
		dispatch({
			type: 'IMAGE_FEED_COPY_SPARE_IMAGES_TO_CURRENT',
			limit: limit < 0 ? 0 : limit > 100 ? 100 : limit,
		});
	}
};

export const subscribeToImages = () => (dispatch) => {
	client
		.subscribe({
			query: SUBSCRIPTION_QUERY,
		})
		.subscribe({
			next(data) {
				dispatch({
					type: 'IMAGE_FEED_GET_SUBSCRIBED_IMAGES',
					payload: data,
				});
			},
		});
};

const SUBSCRIPTION_QUERY = gql`
	subscription {
		# onSendControl(appId: "NEWSELFWALES", channel: "FEED") {
		# 	id
		# 	action
		# 	value
		# }
		onSendNewSelfWalesControl {
			id
			action
			value
		}
	}
`;

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
