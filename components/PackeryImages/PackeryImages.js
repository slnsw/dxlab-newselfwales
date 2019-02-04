import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import Packery from '../Packery';
import Image from '../Image';

import './PackeryImages.css';

class PackeryImages extends Component {
	static propTypes = {
		className: PropTypes.string,
		images: PropTypes.array,
		hiddenImageIds: PropTypes.array,
		removedImageIds: PropTypes.array,
		highlightedImageIds: PropTypes.array,
		gridSize: PropTypes.string,
		marginTop: PropTypes.string,
		heightAdjust: PropTypes.string,
		transitionDuration: PropTypes.string,
		stagger: PropTypes.number,
		onLayoutComplete: PropTypes.func,
	};

	static defaultProps = {
		images: [],
		hiddenImageIds: [],
		removedImageIds: [],
		transitionDuration: '2s',
		stagger: 100,
	};

	handleLayoutComplete = (laidOutItems) => {
		if (typeof this.props.onLayoutComplete === 'function') {
			this.props.onLayoutComplete(laidOutItems);
		}
	};

	handleImageClick = (event, images) => {
		if (typeof this.props.onImageClick === 'function') {
			this.props.onImageClick(event, images);
		}
	};

	render() {
		const {
			className,
			images,
			hiddenImageIds,
			removedImageIds,
			highlightedImageIds,
			gridSize,
			marginTop,
			heightAdjust,
			transitionDuration,
			stagger,
		} = this.props;

		if (!images || images.length === 0) {
			return null;
		}

		return (
			<Packery
				className={[
					'image-feed__images',
					gridSize === 'lg' ? 'image-feed__images--lg' : '',
					className || '',
				].join(' ')}
				// ref={(element) => {
				//   this.imagesRef[name] = element;
				// }}
				style={{
					marginTop,
					height: `calc(100% + ${heightAdjust})`,
				}}
				options={{
					itemSelector: '.image-feed__image-holder',
					gutter: 0,
					horizontalOrder: true,
					fitWidth: true,
					transitionDuration,
					stagger,
					isHorizontal: true,
				}}
				onLayoutComplete={(laidOutItems) => {
					this.handleLayoutComplete(laidOutItems);
				}}
			>
				{images &&
					images.length > 0 &&
					images.map((image, i) => {
						// Return null if there is no image or image hasn't been added to hiddenImageIds
						if (!image.featuredMedia) {
							return null;
						}

						const isHidden = hiddenImageIds.indexOf(image.id) > -1;
						const isRemoved = removedImageIds.indexOf(image.id) > -1;

						// Remove image from DOM. Should only happen after it has been 'hidden'
						if (isRemoved) {
							return null;
						}

						const { imageSize } = image;

						// Work out image URL
						const imageUrl =
							imageSize === 'md'
								? image.featuredMedia.sizes.medium.sourceUrl
								: image.featuredMedia.sizes.full.sourceUrl;

						// Build image alt
						let imageAlt;
						if (image.type === 'portrait') {
							imageAlt = 'Portrait from the State Library of NSW collection';
						} else if (image.type === 'instagram-selfie') {
							imageAlt = 'Selfie from Instagram';
						} else if (image.type === 'gallery-selfie') {
							imageAlt = 'Selfie from photo booth';
						}

						return (
							<Fragment key={`image-${image.id}`}>
								<CSSTransition
									in={!isHidden}
									timeout={2000}
									classNames="image-feed__image-holder-"
								>
									<div
										className={[
											'image-feed__image-holder',
											imageSize ? `image-feed__image-holder--${imageSize}` : '',
											image.type
												? `image-feed__image-holder--${image.type}`
												: '',
											image.isSilhouette
												? 'image-feed__image-holder--is-person'
												: '',
											`image-feed__image-holder--id-${image.id}`,
											hiddenImageIds[0] &&
											parseInt(highlightedImageIds[0], 10) === image.id
												? 'image-feed__image-holder--highlighted'
												: '',
										].join(' ')}
										onClick={(event) =>
											!image.isSilhouette && this.handleImageClick(event, image)
										}
										// ref={(c) => this.imageHolderRefs.set(image.id, c)}
										data-id={image.id}
										tabIndex="0"
									>
										{image.isSilhouette && (
											<div className="image-feed__image-holder__content">
												<span>?</span>
												<p>This could be you!</p>
											</div>
										)}

										<Image
											className={[
												`image-feed__image`,
												image.isSilhouette
													? 'image-feed__image--is-person'
													: '',
											].join(' ')}
											src={imageUrl}
											key={`${imageUrl}-${i}`}
											alt={imageAlt}
										/>

										{/* <img
											className={[
												`image-feed__image`,
												image.isSilhouette
													? 'image-feed__image--is-person'
													: '',
											].join(' ')}
											src={imageUrl}
											style={{
												marginBottom: '-4px',
											}}
											key={`${imageUrl}-${i}`}
											alt={imageAlt}
										/> */}
									</div>
								</CSSTransition>
							</Fragment>
						);
					})}
			</Packery>
		);
	}
}

export default PackeryImages;
