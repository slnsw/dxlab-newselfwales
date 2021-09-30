import { Component } from 'react';
import PropTypes from 'prop-types';
// import { Query } from 'react-apollo';
// import gql from 'graphql-tag';
import { AllHtmlEntities } from 'html-entities';

import './ImageModalContainer.css';
import ImageModal from '../ImageModal';

// export async function getImageData(id) {
// 	console.log('Loading data for: ', id);
// 	const data = await fetch(`/static/newselfwales/json/${id}.json`);
// 	// const data = await res.json();
// 	//	.then((r) => r.json())
// 	//	.then((data) => {

// 	//	image = data.data;
// 	//	});
// 	if (!data) {
// 		return false;
// 	}
// 	console.log('Local image data: ', data.data);
// 	return data.data;
// }

class ImageModalContainer extends Component {
	static propTypes = {
		id: PropTypes.number,
		imageType: PropTypes.string,
		sourceImageBoundingClientRect: PropTypes.object,
		isActive: PropTypes.bool,
		onClose: PropTypes.func.isRequired,
		onTagClick: PropTypes.func,
	};
	state = { newSelfWales: {} };
	componentDidMount() {
		console.log('COMPONENT DID MOUNT');
		if (this.props && this.props.id) {
			// const imageData = getImageData(this.props.id);
			// this.setState({ newSelfWales: imageData });

			fetch(`/static/newselfwales/json/${this.props.id}.json`)
				.then((r) => r.json())
				.then((data) => {
					const imageData = { image: data.data };
					this.setState({ newSelfWales: imageData });
				})
				.catch((e) => {
					console.log(e);
					this.setState({ newSelfWales: null });
				});
		}
	}

	componentDidUpdate(prevProps) {
		console.log('COMPONENT DID UPDATE');
		if (this.props && this.props.id) {
			if (prevProps.id != this.props.id) {
				fetch(`/static/newselfwales/json/${this.props.id}.json`)
					.then((r) => r.json())
					.then((data) => {
						const imageData = { image: data.data };
						this.setState({ newSelfWales: imageData });
					})
					.catch((e) => {
						console.log(e);
						this.setState({ newSelfWales: null });
					});
			}
		}
	}

	render() {
		const {
			id,
			imageType,
			sourceImageBoundingClientRect,
			isActive,
			onClose,
			onTagClick,
		} = this.props;
		// const { newSelfWales } = this.state;
		// let image = false;

		const entities = new AllHtmlEntities();

		// let query;
		// if (imageType === 'portrait') {
		// 	query = PORTRAIT_QUERY;
		// } else if (imageType === 'instagram-selfie') {
		// 	query = INSTAGRAM_SELFIE_QUERY;
		// } else if (imageType === 'gallery-selfie') {
		// 	query = GALLERY_SELFIE_QUERY;
		// }

		// if (!query) {
		// 	return null;
		// }

		if (!id) {
			return null;
		}

		if (!this.state.newSelfWales || !this.state.newSelfWales.image) {
			return null;
		}

		// return (
		// 	<Query
		// 		query={query}
		// 		variables={{
		// 			id,
		// 		}}
		// 		ssr={true}
		// 	>
		// {({ data, loading, error }) => {
		// 	const { newSelfWales } = data;
		let imageModalProps = {};

		if (this.state.newSelfWales && this.state.newSelfWales.image) {
			const { image } = this.state.newSelfWales;

			imageModalProps = {
				id,
				primoId: image.primoId,
				title: entities.decode(image.title),
				content: entities.decode(image.content),
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
				isActive={isActive}
				isLoading={false}
				// error={''}
				onClose={onClose}
				onTagClick={onTagClick}
			/>
		);
	}
}
// {
/* </Query>
		); */
// }
// 	}
// }

// const PORTRAIT_QUERY = gql`
// 	query getImage($id: Int) {
// 		newSelfWales {
// 			image: portrait(id: $id) {
// 				title
// 				slug
// 				content
// 				dateText
// 				featuredMedia {
// 					sourceUrl
// 				}
// 				primoId
// 			}
// 		}
// 	}
// `;

// const INSTAGRAM_SELFIE_QUERY = gql`
// 	query getImage($id: Int) {
// 		newSelfWales {
// 			image: instagramSelfie(id: $id) {
// 				title
// 				content
// 				timestamp
// 				featuredMedia {
// 					sourceUrl
// 				}
// 				instagramUsername
// 				shortcode
// 				date
// 			}
// 		}
// 	}
// `;

// const GALLERY_SELFIE_QUERY = gql`
// 	query getImage($id: Int) {
// 		newSelfWales {
// 			image: gallerySelfie(id: $id) {
// 				title: galleryName
// 				content
// 				featuredMedia {
// 					sourceUrl
// 				}
// 				date
// 			}
// 		}
// 	}
// `;

export default ImageModalContainer;
