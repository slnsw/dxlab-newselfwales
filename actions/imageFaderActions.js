import gql from 'graphql-tag';
import { client } from '../lib/initApollo';

// ----------------------------------------------------------------------------
// IMAGE FADER ACTIONS
// ----------------------------------------------------------------------------

export const fetchFaderImages = ({ limit }) => (dispatch) => {
	dispatch({
		type: 'FETCH_FADER_IMAGES_REQUEST',
	});

	return client
		.query({
			query: IMAGE_FADER_QUERY,
			variables: { limit },
			fetchPolicy: 'no-cache',
		})
		.then((data) =>
			dispatch({
				type: 'FETCH_FADER_IMAGES_SUCCESS',
				payload: data,
			}),
		)
		.catch((error) =>
			dispatch({
				type: 'FETCH_FADER_IMAGES_FAILURE',
				payload: error,
			}),
		);
};

const IMAGE_FADER_QUERY = gql`
	query getFaderImages($limit: Int) {
		newSelfWales {
			gallerySelfies(limit: 1, orderBy: DATE) {
				id
				title
				featuredMedia {
					sourceUrl
					sizes {
						medium {
							file
							width
							height
							mimeType
							sourceUrl
						}
					}
				}
			}
			randomSelfies: gallerySelfies(limit: $limit, orderBy: RANDOM) {
				id
				title
				featuredMedia {
					sourceUrl
					sizes {
						medium {
							file
							width
							height
							mimeType
							sourceUrl
						}
					}
				}
			}
		}
	}
`;

/*
const IMAGE_FADER_QUERY = gql`
	query getFaderImages($limit: Int) {
		newSelfWales {
			instagramSelfies(limit: $limit, orderBy: RANDOM) {
				id
				title
				featuredMedia {
					sourceUrl
					sizes {
						medium {
							file
							width
							height
							mimeType
							sourceUrl
						}
					}
				}
			}
		}
	}
`;
*/
