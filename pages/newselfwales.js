import { Component } from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

import App from '../components/App';
import ImageFeed from '../components/ImageFeed';
import InfoBox from '../components/InfoBox';
import Modal from '../components/Modal';
import images from '../lib/imagesNew.json';
import shuffle from '../lib/shuffle';
import { client } from '../lib/initApollo';

import './index.css';

class LandingPage extends Component {
	constructor() {
		super();

		const silhouette = {
			isSilhouette: true,
			imageUrl: 'silhouettes/silhouette.png',
		};

		// Build images for wall
		const allImages = shuffle(images).concat(shuffle(images));
		allImages.splice(1, 0, silhouette);
		allImages.splice(14, 0, silhouette);
		allImages.splice(25, 0, silhouette);
		allImages.splice(35, 0, silhouette);

		// console.log(allImages);

		this.state = {
			allImages,
			axis: 'x',
			showModal: true,
			enableAnimation: false,
			laidOutItems: undefined,
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

	render() {
		const { allImages, showModal, enableAnimation } = this.state;

		return (
			<ApolloProvider client={client}>
				<Query query={PAGE_QUERY}>
					{({
						// loading,
						// error,
						data,
					}) => {
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

								<ImageFeed
									images={allImages}
									enableAnimation={enableAnimation}
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
	query {
		pages(slug: "newselfwales") {
			title
			excerpt
			content
		}
	}
`;

export default LandingPage;
