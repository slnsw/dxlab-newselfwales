import { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import withRedux from 'next-redux-wrapper';
import gql from 'graphql-tag';
import { withCookies } from 'react-cookie';
import queryString from 'query-string';

import App from '../components/App';
import ImageFeedContainer from '../components/ImageFeedContainer';
import ImageModalContainer from '../components/ImageModalContainer';
import SearchResultsContainer from '../components/SearchResultsContainer';
import InfoBox from '../components/InfoBox';
import Modal from '../components/Modal';
import SearchBox from '../components/SearchBox';
import SearchFilters from '../components/SearchFilters';
import Overlay from '../components/Overlay';
import MessageWidget from '../components/MessageWidget';
import Link from '../components/Link';
import withApollo from '../lib/withApollo';
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
			// We rely on state.q and state.filters to switch back to correct search query after opening image modal.
			q: '',
			filters: null,
			axis: 'x',
			enableAnimation: true,
			sourceImageBoundingClientRect: null,
			isInfoBoxFullSize: false,
			isImageFeedLoading: false,
			isImageFeedInitiallyLoading: true,
			hasInitiallyScrolled: false,
			showModal: !cookies.get('specialcareacknowledged'),
			pauseInterval: false,
			searchFilters: [
				{
					name: 'All',
					value: 'all',
				},
				{
					name: 'Collection',
					value: 'portrait',
				},
				{
					name: 'Instagram',
					value: 'instagram-selfie',
				},
				{
					name: 'Gallery',
					value: 'gallery-selfie',
				},
			],
		};
	}

	componentDidMount() {
		window.addEventListener('keyup', this.handleKey, true);

		const isSearch = this.props.url.query.param === 'search';
		const isHome = typeof this.props.url.query.param === 'undefined';

		this.setState({
			isSearch,
			enableAnimation: isHome,
			pauseInterval: !isHome,
		});
	}

	// --------------------------------------------------------------------------
	// Special Care Modal
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

	// --------------------------------------------------------------------------
	// Image Modal
	// --------------------------------------------------------------------------

	handleImageModalClick = (event, image) => {
		// Store query and filters in state so when ImageModal closes,
		// we can return back to correct search.
		const { q, filters } = this.props.url.query;

		Router.pushRoute(`/newselfwales/${image.type}/${image.id}`);

		this.setState({
			enableAnimation: false,
			q: this.state.isSearch ? q : '',
			filters: this.state.isSearch ? filters : null,
			sourceImageBoundingClientRect: event.target.parentElement.getBoundingClientRect(),
			pauseInterval: true,
		});
	};

	handleImageModalClose = () => {
		const { q, filters } = this.state;

		if (this.state.isSearch) {
			const query = {
				q,
				...(filters
					? {
							filters,
						}
					: {}),
			};

			const url = `/newselfwales/search?${queryString.stringify(query)}`;

			Router.pushRoute(url);

			this.setState({
				q: '',
				filters: null,
			});
		} else {
			Router.pushRoute('/newselfwales');

			this.setState({
				enableAnimation: true,
				pauseInterval: false,
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

	// --------------------------------------------------------------------------
	// Image Feed
	// --------------------------------------------------------------------------

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

	// --------------------------------------------------------------------------
	// Info Box
	// --------------------------------------------------------------------------

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
		const { filters } = this.props.url.query;

		const query = {
			q: value,
			...(filters
				? {
						filters,
					}
				: {}),
		};

		const url = `/newselfwales/search?${queryString.stringify(query)}`;

		if (value) {
			Router.pushRoute(url);
		}
	};

	handleSearchFilterClick = (event, filter) => {
		const query = {
			...this.props.url.query,
			filters: filter.value,
		};

		delete query.param;

		if (filter.value === 'all') {
			delete query.filters;
		}

		const url = `/newselfwales/search?${queryString.stringify(query)}`;

		Router.pushRoute(url);
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
		const { error, pages, url } = this.props;
		const { query } = url;
		const {
			showModal,
			enableAnimation,
			sourceImageBoundingClientRect,
			isInfoBoxFullSize,
			isSearch,
			searchFilters,
			isImageFeedLoading,
			isImageFeedInitiallyLoading,
			hasInitiallyScrolled,
		} = this.state;

		const showImageModal = url && url.query.param && url.query.id && true;
		const q = query.q || this.state.q;
		const filters = query.filters || this.state.filters;
		const filterValue = filters || 'all';

		// if (loading) {
		// 	return <div />;
		// }

		if (error) {
			console.log(error);
			return null;
		}

		const page = pages && pages[0];

		// console.log({
		// 	isSearch,
		// 	isImageFeedInitiallyLoading,
		// 	isImageFeedLoading,
		// 	hasInitiallyScrolled,
		// });

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
							filters={searchFilters}
							value={filterValue}
							onClick={this.handleSearchFilterClick}
						/>
						{!q && (
							<div className="newselfwales-page__search-suggestions">
								<h2>
									Enter a search term above, or try some of these suggested
									searches:
								</h2>
								<p>
									<Link to="/newselfwales/search?q=ball">
										<a>Ball</a>
									</Link>
									<br />
									<Link to="/newselfwales/search?q=dupain">
										<a>Max Dupain</a>
									</Link>
									<br />
									<Link to="/newselfwales/search?q=grace">
										<a>Grace</a>
									</Link>
									<br />
									<Link to="/newselfwales/search?q=spring">
										<a>Spring</a>
									</Link>
									<br />
									<Link to="/newselfwales/search?q=mott">
										<a>Tony Mott</a>
									</Link>
									<br />
									<Link to="/newselfwales/search?q=architect">
										<a>Architects</a>
									</Link>
									<br />
									<Link to="/newselfwales/search?q=cricket">
										<a>Cricket</a>
									</Link>
									<br />
									<Link to="/newselfwales/search?q=Mitchell">
										<a>David Scott Mitchell</a>
									</Link>
									<br />
									<Link to="/newselfwales/search?q=newtown">
										<a>Newtown</a>
									</Link>
									<br />
									<Link to="/newselfwales/search?q=Aboriginal">
										<a>Aboriginal</a>
									</Link>
									<br />
									<Link to="/newselfwales/search?q=holterman">
										<a>B. O. Holtermann</a>
									</Link>
									<br />
									<Link to="/newselfwales/search?q=hood">
										<a>Hood</a>
									</Link>
									<br />
									<Link to="/newselfwales/search?q=waterloo">
										<a>Waterloo</a>
									</Link>
									<br />
									<Link to="/newselfwales/search?q=tribune">
										<a>Tribune</a>
									</Link>
								</p>
							</div>
						)}
						<div className="newselfwales-page__search-results">
							<SearchResultsContainer
								q={q}
								filters={filters ? [filters] : null}
								onImageClick={(event, image) =>
									this.handleImageModalClick(event, image)
								}
							/>
						</div>
					</Fragment>
				)}

				<Overlay isActive={isSearch} />

				<Fragment>
					{/* <button
							className="button newselfwales-page__toggle-animation-button"
							onClick={this.handleToggleAnimationButton}
						>
							{enableAnimation ? 'Pause' : 'Play'}
						</button> */}

					<ImageFeedContainer
						startImages={20}
						maxImages={150}
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
							<p>Our live image feed updates every 20 seconds.</p>
							<MessageWidget
								messages={[
									"Around 5,500 portrairts from the Library's collection appear in the feed.",
									'The public have contributed around one thousand images via Instagram using the hashtag #NewSelfWales',
									'Using the in-gallery photo-booths visitors have added nearly 6,000 pictures to the feed.',
								]}
								timePerMessage={5000}
							/>
						</div>
					)}
				</Fragment>

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

				<Modal
					className="newselfwales-page__special-care"
					isActive={showModal}
					onClose={this.handleSpecialCareModalClose}
				>
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
