import { Component } from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

import App from '../components/App';
import ImageFeedContainer from '../components/ImageFeedContainer';
import InfoBox from '../components/InfoBox';
import Modal from '../components/Modal';
// import images from '../lib/imagesNew.json';
// import shuffle from '../lib/shuffle';
import { client } from '../lib/initApollo';

import './index.css';

class LandingPage extends Component {
	constructor() {
		super();

		this.state = {
			axis: 'x',
			showModal: false,
			enableAnimation: true,
		};
	}

	handleModalClose = () => {
		this.setState({
			showModal: false,
			enableAnimation: true,
		});
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

	render() {
		const { showModal, enableAnimation } = this.state;

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
									maxImages={100}
									intervalTime={5000}
									enableAnimation={enableAnimation}
									onImagesUpdate={this.handleImagesUpdate}
								/>

								{page && (
									<InfoBox title={page.title} excerpt={page.excerpt}>
										{page.content}
									</InfoBox>
								)}

								{showModal && (
									<Modal onClose={this.handleModalClose}>
										<h1>SPECIAL CARE NOTICE</h1>

										<p>
											This website may contain images or documentation relating
											to Aboriginal and Torres Strait Islander people who are
											deceased. The State Library of NSW acknowledges that its
											historical collection items can be offensive and
											confronting in today’s context. They are published with
											respect to the descendants and communities of the
											individuals they depict.
										</p>
									</Modal>
								)}
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
