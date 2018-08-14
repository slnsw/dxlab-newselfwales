import { Component } from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

import App from '../components/App';
import ImageFeedContainer from '../components/ImageFeedContainer';
import InfoBox from '../components/InfoBox';
import Modal from '../components/Modal';
import ImageModalContainer from '../components/ImageModalContainer';
// import images from '../lib/imagesNew.json';
// import shuffle from '../lib/shuffle';
import { client } from '../lib/initApollo';
import { Router } from '../routes';

import './index.css';

class LandingPage extends Component {
	constructor() {
		super();

		this.state = {
			axis: 'x',
			showModal: true,
			enableAnimation: false,
			sourceImageBoundingClientRect: null,
		};
	}

	componentDidMount() {
		window.addEventListener('keyup', this.handleKey, true);
	}

	handleModalClose = () => {
		this.setState({
			showModal: false,
			enableAnimation: true,
		});
	};

	handleImageModalClose = () => {
		Router.pushRoute('/newselfwales');
	};

	handleToggleAnimationButton = () => {
		this.setState({
			enableAnimation: !this.state.enableAnimation,
		});
	};

	// Intercept image feed and splice in silhouettes
	handleImagesUpdate = (images) => {
		const silhouetteInterval = 11;
		const silhouette = {
			isSilhouette: true,
			imageUrl: '/static/newselfwales/images/silhouettes/silhouette.png',
		};

		// Build images for wall
		const totalSilhouettes = Math.ceil(images.length / silhouetteInterval);

		// Loop through and slice in silhoutte
		[...Array(totalSilhouettes)].forEach((item, i) => {
			images.splice(i * silhouetteInterval + 1, 0, silhouette);
		});

		return images;
	};

	handleImageClick = (event, image) => {
		// console.log(event.target.parentElement.getBoundingClientRect(), image);

		Router.pushRoute(`/newselfwales/${image.type}/${image.id}`);

		this.setState({
			enableAnimation: false,
			sourceImageBoundingClientRect: event.target.parentElement.getBoundingClientRect(),
		});
	};

	handleLayoutComplete = () => {
		// LayoutComplete is triggered after Packery has laid out the images
		// Sometimes, the user may close the modal box before layoutComplete
		// We need to check if enableAnimation and do a fake toggle to get ImageFeed
		// running again
		if (this.state.enableAnimation) {
			this.setState({
				enableAnimation: false,
			});

			this.setState({
				enableAnimation: true,
			});
		}
	};

	handleKey = (event) => {
		// For accessibility and super-users
		if (event.code === 'Escape') {
			//  Effectively close ImageModal
			if (
				this.props.url.query &&
				this.props.url.query.imageType &&
				this.props.url.query.id
			) {
				Router.pushRoute(`/newselfwales`);
			}

			// Close modal and start animation
			if (this.state.showModal) {
				this.setState({
					showModal: false,
					enableAnimation: true,
				});
			}
		}
	};

	render() {
		const { url } = this.props;
		const {
			showModal,
			enableAnimation,
			sourceImageBoundingClientRect,
		} = this.state;

		const showImageModal = url && url.query.imageType && url.query.id && true;

		return (
			<ApolloProvider client={client}>
				<Query query={PAGE_QUERY}>
					{({ loading, error, data }) => {
						if (loading) {
							return <div />;
						}

						if (error) {
							console.log(error);
							return null;
						}

						const page = data.pages && data.pages[0];

						return (
							<App
								title="#NewSelfWales"
								metaDescription={
									'Share your portrait and become part of our opening exhibitions'
								}
								metaImageUrl="https://dxlab.sl.nsw.gov.au/static/newselfwales/social-image.jpg"
								metaImageAlt="#NewSelfWales image feed of collection images"
								pathname="/newselfwales"
							>
								<button
									className="button landing__toggle-animation-button"
									onClick={this.handleToggleAnimationButton}
								>
									{enableAnimation ? 'Pause' : 'Play'}
								</button>

								<ImageFeedContainer
									startImages={20}
									maxImages={50}
									intervalTime={5000}
									enableAnimation={enableAnimation}
									onImagesUpdate={this.handleImagesUpdate}
									onImageClick={(event, image) =>
										this.handleImageClick(event, image)
									}
									onLayoutComplete={this.handleLayoutComplete}
								/>

								{page && (
									<InfoBox title={page.title} excerpt={page.excerpt}>
										{page.content}
									</InfoBox>
								)}

								<ImageModalContainer
									isActive={showImageModal}
									imageType={url.query.imageType}
									id={parseInt(url.query.id, 10)}
									sourceImageBoundingClientRect={sourceImageBoundingClientRect}
									onClose={this.handleImageModalClose}
								/>

								<Modal isActive={showModal} onClose={this.handleModalClose}>
									<h1>SPECIAL CARE NOTICE</h1>

									<p>
										This website may contain images or documentation relating to
										Aboriginal and Torres Strait Islander people who are
										deceased. The State Library of NSW acknowledges that its
										historical collection items can be offensive and confronting
										in today’s context. They are published with respect to the
										descendants and communities of the individuals they depict.
									</p>
								</Modal>
							</App>
						);
					}}
				</Query>
			</ApolloProvider>
		);
	}
}

const PAGE_QUERY = gql`
	query getFeed($offset: Int, $limit: Int) {
		pages(slug: "newselfwales") {
			id
			title
			excerpt
			content
		}
		portraits: newSelfWalesPortraits(offset: $offset, limit: $limit) {
			id
			title
			featuredMedia {
				sourceUrl
			}
		}
	}
`;

export default LandingPage;
