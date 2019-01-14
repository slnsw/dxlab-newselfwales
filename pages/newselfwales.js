import { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import withRedux from 'next-redux-wrapper';
import gql from 'graphql-tag';
import { withCookies } from 'react-cookie';

import App from '../components/App';
import ImageFeedContainer from '../components/ImageFeedContainer';
import ImageModalContainer from '../components/ImageModalContainer';
import SearchResultsContainer from '../components/SearchResultsContainer';
import InfoBox from '../components/InfoBox';
import Modal from '../components/Modal';
import SearchBox from '../components/SearchBox';
import SearchFilters from '../components/SearchFilters';
import Overlay from '../components/Overlay';
// import images from '../lib/imagesNew.json';
// import shuffle from '../lib/shuffle';
import withApollo from '../lib/withApollo';
// import { client } from '../lib/initApollo';
import { initStore } from '../lib/initRedux';
import { Router } from '../routes';

import './newselfwales.css';
import LoaderText from '../components/LoaderText';

class LandingPage extends Component {
	constructor(props) {
		super(props);

		const { cookies } = props;

		this.state = {
			isSearch: false,
			// Need to store this in local state even though we mainly use url.query.q in props.
			// We rely on state.q to switch back to correct search query after opening image modal.
			q: '',
			axis: 'x',
			enableAnimation: true,
			sourceImageBoundingClientRect: null,
			isInfoBoxFullSize: false,
			isImageFeedLoading: false,
			isImageFeedInitiallyLoading: true,
			hasInitiallyScrolled: false,
			showModal: !cookies.get('specialcareacknowledged'),
			pauseInterval: false,
		};
	}

	componentDidMount() {
		window.addEventListener('keyup', this.handleKey, true);

		this.setState({
			isSearch: this.props.url.query.param === 'search',
		});
	}

	// componentDidUpdate(prevProps) {
	// 	if (prevProps.url.query !== this.props.url.query) {
	// 		const isSearch =
	// 			this.props.url.query.param === 'search' ||
	// 			Boolean(this.props.url.query.q);

	// 		this.setState({
	// 			isSearch,
	// 			pauseInterval: isSearch,
	// 		});
	// 	}
	// }

	// --------------------------------------------------------------------------
	// Modals
	// --------------------------------------------------------------------------

	handleSpecialCareModalClose = () => {
		this.setState({
			showModal: false,
			enableAnimation: true,
		});

		const expDate = new Date();
		expDate.setFullYear(expDate.getFullYear() + 10);

		this.props.cookies.set('specialcareacknowledged', true, {
			path: '/',
			expires: expDate,
		});
	};

	handleImageModalClick = (event, image) => {
		const { q } = this.props.url.query;

		Router.pushRoute(`/newselfwales/${image.type}/${image.id}`);

		this.setState({
			enableAnimation: false,
			q: this.state.isSearch ? q : '',
			sourceImageBoundingClientRect: event.target.parentElement.getBoundingClientRect(),
		});
	};

	handleImageModalClose = () => {
		const { q } = this.state;

		if (this.state.isSearch) {
			Router.pushRoute(`/newselfwales/search${q ? `?q=${q}` : ''}`);
		} else {
			Router.pushRoute('/newselfwales');

			this.setState({
				enableAnimation: true,
			});
		}
	};

	handleToggleAnimationButton = () => {
		this.setState({
			enableAnimation: !this.state.enableAnimation,
		});
	};

	handleImagesUpdate = (images) => {
		if (images.length > 0 && this.state.isImageFeedInitiallyLoading) {
			this.setState({
				isImageFeedInitiallyLoading: false,
			});
		}

		// const silhouetteInterval = 11;
		// const silhouette = {
		// 	isSilhouette: true,
		// 	imageUrl: '/static/newselfwales/images/silhouettes/silhouette.png',
		// };

		// // Build images for wall
		// const totalSilhouettes = Math.ceil(images.length / silhouetteInterval);

		// // Loop through and slice in silhoutte
		// [...Array(totalSilhouettes)].forEach((item, i) => {
		// 	images.splice(i * silhouetteInterval + 1, 0, silhouette);
		// });

		// return images;
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
				this.props.url.query.param &&
				this.props.url.query.id
			) {
				Router.pushRoute(`/newselfwales`);

				this.setState({
					enableAnimation: true,
				});
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

	handleInfoBoxCloseButtonClick = () => {
		this.setState({
			isInfoBoxFullSize: false,
			enableAnimation: true,
		});
	};

	// --------------------------------------------------------------------------
	// Search
	// --------------------------------------------------------------------------

	handleSearchBoxFocus = () => {
		// Check if already on search page
		if (this.props.url.query.param !== 'search') {
			Router.pushRoute('/newselfwales/search');

			this.setState({
				isSearch: true,
				enableAnimation: false,
				pauseInterval: true,
			});
		}
	};

	handleSearchBoxBackClick = () => {
		Router.pushRoute('/newselfwales');

		this.setState({
			isSearch: false,
			q: '',
			enableAnimation: true,
			pauseInterval: false,
		});
	};

	handleSearchSubmit = (value) => {
		if (value) {
			Router.pushRoute(`/newselfwales/search?q=${value}`);
		}
	};

	handleSearchFilterClick = (event, value) => {
		console.log(value);
	};

	// --------------------------------------------------------------------------
	// Scroller
	// --------------------------------------------------------------------------

	handleScrollerWait = () => {
		this.setState({
			isImageFeedLoading: true,
		});
	};

	handleScrollerResume = () => {
		this.setState({
			isImageFeedLoading: false,
		});

		if (this.state.hasInitiallyScrolled === false) {
			this.setState({
				hasInitiallyScrolled: true,
			});
		}
	};

	render() {
		const { loading, error, pages, url } = this.props;
		const {
			showModal,
			enableAnimation,
			sourceImageBoundingClientRect,
			isInfoBoxFullSize,
			isSearch,
			isImageFeedLoading,
			isImageFeedInitiallyLoading,
			hasInitiallyScrolled,
		} = this.state;

		const showImageModal = url && url.query.param && url.query.id && true;
		const q = url.query.q || this.state.q;

		console.log(isSearch, 'search');

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
					defaultValue={url.query && url.query.q ? url.query.q : ''}
					className="newselfwales-page__search-box"
					isActive={isSearch}
					onFocus={this.handleSearchBoxFocus}
					onBackClick={this.handleSearchBoxBackClick}
					onSubmit={this.handleSearchSubmit}
				/>

				{isSearch && (
					<Fragment>
						<SearchFilters
							className="newselfwales-page__search-filters"
							filters={['all', 'gallery', 'instagram', 'collection']}
							value={'all'}
							onClick={this.handleSearchFilterClick}
						/>
						<div className="newselfwales-page__search-results">
							<SearchResultsContainer
								q={q}
								onImageClick={(event, image) =>
									this.handleImageModalClick(event, image)
								}
							/>
						</div>
					</Fragment>
				)}

				<Overlay isActive={isSearch} />

				{!isSearch && (
					<Fragment>
						{/* <button
							className="button newselfwales-page__toggle-animation-button"
							onClick={this.handleToggleAnimationButton}
						>
							{enableAnimation ? 'Pause' : 'Play'}
						</button> */}

						<ImageFeedContainer
							startImages={20}
							maxImages={50}
							intervalTime={5000}
							pauseInterval={this.state.pauseInterval}
							enableAnimation={enableAnimation}
							shouldFetchImagesOnMount={false}
							onImagesUpdate={this.handleImagesUpdate}
							onImageClick={(event, image) =>
								this.handleImageModalClick(event, image)
							}
							onLayoutComplete={this.handleLayoutComplete}
							onScrollerWait={this.handleScrollerWait}
							onScrollerResume={this.handleScrollerResume}
						/>

						{(isImageFeedLoading ||
							isImageFeedInitiallyLoading ||
							hasInitiallyScrolled === false) && (
							<LoaderText className="newselfwales-page__image-feed-loader" />
						)}

						{isImageFeedInitiallyLoading && (
							<div className="newselfwales-page__image-feed-loader-text">
								<p>This live image feed updates every 10 seconds.</p>
								<p>
									Images from our collection, exhibition and Instagram should
									appear soon.
								</p>
							</div>
						)}
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
							onCloseButtonClick={this.handleInfoBoxCloseButtonClick}
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

				<Modal isActive={showModal} onClose={this.handleSpecialCareModalClose}>
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
		})(withCookies(LandingPage)),
	),
);
