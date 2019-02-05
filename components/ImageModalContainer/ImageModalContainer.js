import { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './ImageModalContainer.css';
import ImageModal from '../ImageModal';

class ImageModalContainer extends Component {
	static propTypes = {
		id: PropTypes.number,
		imageType: PropTypes.string,
		sourceImageBoundingClientRect: PropTypes.object,
		isActive: PropTypes.bool,
		onClose: PropTypes.func.isRequired,
	};

	render() {
		const {
			id,
			imageType,
			sourceImageBoundingClientRect,
			onClose,
			isActive,
		} = this.props;
		let query;

		if (imageType === 'portrait') {
			query = PORTRAIT_QUERY;
		} else if (imageType === 'instagram-selfie') {
			query = INSTAGRAM_SELFIE_QUERY;
		} else if (imageType === 'gallery-selfie') {
			query = GALLERY_SELFIE_QUERY;
		}

		if (!query) {
			return null;
		}

		return (
			<Query
				query={query}
				variables={{
					id,
				}}
				ssr={true}
			>
				{({ data, loading, error }) => {
					const { newSelfWales } = data;
					let imageModalProps = {};

					if (newSelfWales && newSelfWales.image) {
						const { image } = newSelfWales;

						imageModalProps = {
							id,
							primoId: image.primoId,
							title: image.title,
							content: image.content,
							imageType,
							imageUrl: image.featuredMedia && image.featuredMedia.sourceUrl,
							date: image.date,
							dateText: image.dateText,
							timestamp: image.timestamp,
							instagramUsername: image.instagramUsername,
							shortcode: image.shortcode,
							flNumber: image.slug && image.slug.split('-')[1],
						};
					}

					return (
						<ImageModal
							{...imageModalProps}
							sourceImageBoundingClientRect={sourceImageBoundingClientRect}
							type={imageType}
							onClose={onClose}
							isActive={isActive}
							isLoading={loading}
							error={error}
						/>
					);
				}}
			</Query>
		);
	}
}

const PORTRAIT_QUERY = gql`
	query getImage($id: Int) {
		newSelfWales {
			image: portrait(id: $id) {
				title
				slug
				content
				dateText
				featuredMedia {
					sourceUrl
				}
				primoId
			}
		}
	}
`;

const INSTAGRAM_SELFIE_QUERY = gql`
	query getImage($id: Int) {
		newSelfWales {
			image: instagramSelfie(id: $id) {
				title
				content
				timestamp
				featuredMedia {
					sourceUrl
				}
				instagramUsername
				shortcode
				date
			}
		}
	}
`;

const GALLERY_SELFIE_QUERY = gql`
	query getImage($id: Int) {
		newSelfWales {
			image: gallerySelfie(id: $id) {
				title: galleryName
				content
				featuredMedia {
					sourceUrl
				}
				date
			}
		}
	}
`;

export default ImageModalContainer;
