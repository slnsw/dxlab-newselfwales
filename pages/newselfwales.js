import { Component } from 'react';
import { ApolloProvider, Query, Subscription } from 'react-apollo';
import gql from 'graphql-tag';

import Packery from '../components/Packery';
import App from '../components/App';
import InfoBox from '../components/InfoBox';
import Modal from '../components/Modal';
import images from '../lib/imagesNew.json';
import shuffle from '../lib/shuffle';
import { scroller } from '../lib/scroll';
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

	componentDidMount() {
		if (window.location.search) {
			this.setState({
				axis: window.location.search.replace('?axis=', ''),
			});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.laidOutItems === undefined && this.state.laidOutItems) {
			// Init scroller
			scroller.init(
				this.imagesRef.refs.packeryContainer,
				this.state.laidOutItems,
				'x',
			);
		}

		if (!prevState.enableAnimation && this.state.enableAnimation) {
			// Start scroll
			scroller.start();
		} else if (prevState.enableAnimation && !this.state.enableAnimation) {
			// Stop scroll
			scroller.stop();
		}
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
					{({ loading, error, data }) => {
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

								<div
									style={{
										overflow: 'hidden',
									}}
								>
									<Packery
										className="images"
										ref={(element) => {
											this.imagesRef = element;
										}}
										style={{
											marginTop: '5px',
											height: 'calc(100vh - 10px)',
										}}
										options={{
											itemSelector: '.image-holder',
											gutter: 0,
											horizontalOrder: true,
											fitWidth: true,
											transitionDuration: '1s',
											stagger: 100,
											isHorizontal: true,
										}}
										onLayoutComplete={(laidOutItems) => {
											if (!this.state.laidOutItems) {
												this.setState({
													laidOutItems,
												});
											}
										}}
									>
										{allImages.map((image, i) => {
											const imageSize = setSize(i);

											return (
												<div
													className={`image-holder ${
														image.isSilhouette ? 'image-holder--is-person' : ''
													}
												image-holder--${imageSize}`}
													key={`image-${i}`}
												>
													<a href={image.url} target="_blank">
														{image.isSilhouette && (
															<div className="image-holder__content">
																<span>?</span>
																<p>This could be you!</p>
															</div>
														)}

														<img
															className={`image ${
																image.isSilhouette ? 'image--is-person' : ''
															}`}
															src={`/static/newselfwales/${
																image.isSelfie ? 'selfies' : 'images'
															}/${image.imageUrl}`}
															style={{
																// height: imageSize,
																marginBottom: '-4px',
															}}
															key={`${image.imageUrl}-${i}`}
															alt="Portrait from the State Library of NSW collection"
														/>
													</a>
												</div>
											);
										})}
									</Packery>

									{page && (
										<InfoBox title={page.title} excerpt={page.excerpt}>
											{page.content}
										</InfoBox>
									)}
								</div>

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

function setSize(i) {
	if (i % 6 === 1) {
		return 'lg';
	} else if (i % 10 === 1) {
		return 'xlg';
	}

	return 'md';
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
