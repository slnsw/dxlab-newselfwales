import { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import withRedux from 'next-redux-wrapper';
import gql from 'graphql-tag';

import App from '../components/App';
import ImageFeedContainer from '../components/ImageFeedContainer';
import ImageModalContainer from '../components/ImageModalContainer';
import SearchResultsContainer from '../components/SearchResultsContainer';
import InfoBox from '../components/InfoBox';
import Modal from '../components/Modal';
import SearchBox from '../components/SearchBox';
// import images from '../lib/imagesNew.json';
// import shuffle from '../lib/shuffle';
import withApollo from '../lib/withApollo';
// import { client } from '../lib/initApollo';
import { initStore } from '../lib/initRedux';
import { Router } from '../routes';

import './newselfwales.css';

class LandingPage extends Component {
	state = {
		axis: 'x',
		showModal: true,
		enableAnimation: false,
		sourceImageBoundingClientRect: null,
		isInfoBoxFullSize: false,
	};

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

		this.setState({
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

	handleMoreButtonClick = () => {
		this.setState({
			isInfoBoxFullSize: true,
			enableAnimation: false,
		});
	};

	handleCloseButtonClick = () => {
		this.setState({
			isInfoBoxFullSize: false,
			enableAnimation: true,
		});
	};

	handleSearchBoxIconClick = () => {
		Router.pushRoute('/newselfwales/search');
	};

	handleSearchBoxBackClick = () => {
		Router.pushRoute('/newselfwales');
	};

	handleSearchSubmit = (value) => {
		console.log(value);

		if (value) {
			Router.pushRoute(`/newselfwales/search?q=${value}`);
		}
	};

	render() {
		const { loading, error, pages, url } = this.props;
		const {
			showModal,
			enableAnimation,
			sourceImageBoundingClientRect,
			isInfoBoxFullSize,
		} = this.state;

		const showImageModal = url && url.query.param && url.query.id && true;
		const isSearch = url.query.param === 'search';

		if (loading) {
			return <div />;
		}

		if (error) {
			console.log(error);
			return null;
		}

		const page = pages && pages[0];

		return (
			<App
				title="#NewSelfWales"
				metaDescription={
					'Share your portrait and become part of our opening exhibitions'
				}
				metaImageUrl="https://dxlab.sl.nsw.gov.au/static/newselfwales/social-image.jpg"
				metaImageAlt="#NewSelfWales image feed of collection images"
				// url={url}
				pathname="/newselfwales"
			>
				<SearchBox
					className="newselfwales-page__search-box"
					isActive={isSearch}
					onSearchIconClick={this.handleSearchBoxIconClick}
					onBackClick={this.handleSearchBoxBackClick}
					onSubmit={this.handleSearchSubmit}
				/>

				<div className="newselfwales-page__search-results">
					{<SearchResultsContainer isActive={isSearch} url={url} />}
				</div>

				{!isSearch && (
					<Fragment>
						<button
							className="button newselfwales-page__toggle-animation-button"
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
					</Fragment>
				)}

				{page &&
					!isSearch && (
						<InfoBox
							className="newselfwales-page__info-box"
							title={page.title}
							excerpt={page.excerpt}
							isFullSize={isInfoBoxFullSize}
							onMoreButtonClick={this.handleMoreButtonClick}
							onCloseButtonClick={this.handleCloseButtonClick}
						>
							{page.content}
						</InfoBox>
					)}

				<ImageModalContainer
					isActive={showImageModal}
					imageType={url.query.param}
					id={parseInt(url.query.id, 10)}
					sourceImageBoundingClientRect={sourceImageBoundingClientRect}
					onClose={this.handleImageModalClose}
				/>

				<Modal isActive={showModal} onClose={this.handleModalClose}>
					<h1 className="newselfwales-page__special-care-title">
						Special Care Notice
					</h1>

					<p>
						This website may contain images or documentation relating to
						Aboriginal and Torres Strait Islander people who are deceased.
					</p>
					<p>
						The State Library of NSW acknowledges that its historical collection
						items can be offensive and confronting in today’s context. They are
						published with respect to the descendants and communities of the
						individuals they depict.
					</p>
				</Modal>
			</App>
		);
	}
}

const PAGE_QUERY = gql`
	query getFeed {
		pages(slug: "newselfwales") {
			id
			title
			excerpt
			content
		}
	}
`;

export default withRedux(initStore)(
	withApollo(
		graphql(PAGE_QUERY, {
			props: ({ data }) => {
				return {
					...data,
				};
			},
		})(LandingPage),
	),
);
