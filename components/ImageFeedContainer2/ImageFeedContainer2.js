import { Component } from 'react';
import { gql, graphql } from 'react-apollo';
// import PropTypes from 'prop-types';

import withData from '../../lib/withData';
import './ImageFeedContainer2.css';

class ImageFeedContainer2 extends Component {
	// static propTypes = {};

	render() {
		// const {} = this.props;

		return (
			<div className="image-feed-container2">
				<span />
			</div>
		);
	}
}

const IMAGE_FEED_QUERY = gql`
	query getFeed(
		$limit: Int
		$offset: Int
		$dateStart: String
		$portraitPercentage: Float
	) {
		feed: newSelfWalesFeed(
			dateStart: $dateStart
			limit: $limit
			offset: $offset
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

export default withData(
	graphql(IMAGE_FEED_QUERY, {
		options: () => {
			const startImages = 30;

			return {
				offset: 0,
				limit: startImages,
				// dateStart: '2018-05-17T00:00:00',
				dateStart: new Date().toISOString(),
				portraitPercentage: 0.6,
			};
		},
		props: ({ data }) => {
			return {
				...data,
			};
		},
	})(ImageFeedContainer2),
);
