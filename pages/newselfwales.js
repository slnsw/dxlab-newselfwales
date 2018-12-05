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
			axis: 'x',
			enableAnimation: true,
			sourceImageBoundingClientRect: null,
			isInfoBoxFullSize: false,
			isImageFeedLoading: false,
			isImageFeedInitiallyLoading: true,
			hasInitiallyScrolled: false,
			showModal: !cookies.get('specialcareacknowledged'),
		};
	}

	componentDidMount() {
		window.addEventListener('keyup', this.handleKey, true);

		this.setState({
			isSearch: this.props.url.query.param === 'search',
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.url.query !== this.props.url.query) {
			this.setState({
				isSearch:
					this.props.url.query.param === 'search' ||
					Boolean(this.props.url.query.q),
			});
		}
	}

	handleModalClose = () => {
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

	handleImageClick = (event, image) => {
		// console.log(event.target.parentElement.getBoundingClientRect(), image);
		const { q } = this.props.url.query;

		Router.pushRoute(
			`/newselfwales/${image.type}/${image.id}${q ? `?q=${q}` : ''}`,
		);

		this.setState({
			enableAnimation: false,
			sourceImageBoundingClientRect: event.target.parentElement.getBoundingClientRect(),
		});
	};

	handleImageModalClose = () => {
		if (this.props.url.query.param === 'search') {
			Router.pushRoute('/newselfwales/search');
		} else if (this.props.url.query.q) {
			Router.pushRoute(`/newselfwales/search?q=${this.props.url.query.q}`);
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

	handleCloseButtonClick = () => {
		this.setState({
			isInfoBoxFullSize: false,
			enableAnimation: true,
		});
	};

	handleSearchBoxIconClick = () => {
		Router.pushRoute('/newselfwales/search');

		this.setState({
			enableAnimation: false,
		});
	};

	handleSearchBoxBackClick = () => {
		Router.pushRoute('/newselfwales');

		this.setState({
			enableAnimation: true,
		});
	};

	handleSearchSubmit = (value) => {
		if (value) {
			Router.pushRoute(`/newselfwales/search?q=${value}`);
		}
	};

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
					onSearchIconClick={this.handleSearchBoxIconClick}
					onBackClick={this.handleSearchBoxBackClick}
					onSubmit={this.handleSearchSubmit}
				/>

				{isSearch && (
					<Fragment>
						<div className="newselfwales-page__search-results">
							<SearchResultsContainer
								q={url.query.q}
								onImageClick={(event, image) =>
									this.handleImageClick(event, image)
								}
							/>
						</div>
						<div className="newselfwales-page__overlay" />
					</Fragment>
				)}

				{/* {!isSearch && ( */}
				<Fragment>
					{/* <button
							className="button newselfwales-page__toggle-animation-button"
							onClick={this.handleToggleAnimationButton}
						>
							{enableAnimation ? 'Pause' : 'Play'}
						</button> */}

					<ImageFeedContainer
						startImages={20}
						maxImages={100}
						intervalTime={5000}
						enableAnimation={enableAnimation}
						shouldFetchImagesOnMount={false}
						onImagesUpdate={this.handleImagesUpdate}
						onImageClick={(event, image) => this.handleImageClick(event, image)}
						onLayoutComplete={this.handleLayoutComplete}
						onScrollerWait={this.handleScrollerWait}
						onScrollerResume={this.handleScrollerResume}
					/>

					{(isImageFeedLoading ||
						isImageFeedInitiallyLoading ||
						hasInitiallyScrolled === false) && (
						<LoaderText className="newselfwales-page__image-feed-loader" />
					)}
				</Fragment>
				{/* )} */}

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
		})(withCookies(LandingPage)),
	),
);
