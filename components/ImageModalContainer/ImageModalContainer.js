import { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './ImageModalContainer.css';
import ImageModal from '../ImageModal';

class ImageModalContainer extends Component {
	static propTypes = {
		id: PropTypes.number.isRequired,
		imageType: PropTypes.string.isRequired,
		onClose: PropTypes.func,
	};

	render() {
		const { id, imageType, onClose } = this.props;
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
			>
				{({ data, loading, error }) => {
					const { newSelfWales } = data;
					let imageModalProps = {};

					if (newSelfWales && newSelfWales.image) {
						const { image } = newSelfWales;

						imageModalProps = {
							primoId: image.primoId,
							title: image.title,
							content: image.content,
							imageUrl: image.featuredMedia && image.featuredMedia.sourceUrl,
						};
					}

					return (
						<ImageModal
							{...imageModalProps}
							type={imageType}
							onClose={onClose}
							loading={loading}
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
				content
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
			}
		}
	}
`;

const GALLERY_SELFIE_QUERY = gql`
	query getImage($id: Int) {
		newSelfWales {
			image: portrait(id: $id) {
				title
			}
		}
	}
`;

export default ImageModalContainer;
