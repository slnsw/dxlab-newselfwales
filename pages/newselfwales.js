import { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
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
import SearchSuggestions from '../components/SearchSuggestions';
import Overlay from '../components/Overlay';
import MessageWidget from '../components/MessageWidget';
import { Router } from '../routes';

import './newselfwales.css';
import LoaderText from '../components/LoaderText';

class LandingPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isSearch: false,
			isSearchState: false,
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
			showModal: false,
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

	static getInitialProps(props) {
		return {
			// Wierd annoying hack to get componentDidUpdate to recognise route changes.
			// Seems to be a bug in Next 7, or I haven't configured it properly.
			path: props.asPath,
		};
	}

	componentDidMount() {
		const { cookies } = this.props;

		window.addEventListener('keyup', this.handleKey, true);

		const isSearch = this.props.router.query.param === 'search';
		const page = isSearch ? 'search' : 'home';
		const { q } = this.props.router.query;

		this.setState({
			isSearch,
			isSearchState: isSearch,
			q,
			enableAnimation: page === 'home',
			pauseInterval: page === 'search',
			showModal: !cookies.get('specialcareacknowledged'),
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.path !== this.props.path) {
			const { query } = this.props.router;

			let isSearch;

			if (query.param === 'search') {
				isSearch = true;
			} else {
				isSearch = this.state.isSearchState;
			}

			// const page = isSearch ? 'search' : 'home';

			this.setState({
				// Use query.param but also check internal flag for search
				isSearch,
				// q: query.q,
			});
		}
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
		const { q, filters } = this.props.router.query;

		Router.pushRoute(`/newselfwales/${image.type}/${image.id}`);

		this.setState({
			enableAnimation: false,
			q: this.state.isSearch ? q : '',
			// Keep internal search state flag
			isSearchState: this.state.isSearch,
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

	handleImageModalTagClick = (tag) => {
		// No need to route, already done in ImageModal.
		// Just update state.

		this.setState({
			q: tag,
		});
	};

	handleKey = (event) => {
		if (event.code === 'Escape') {
			this.handleImageModalClose();

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

	handleInfoBoxHideButtonClick = () => {
		this.setState({
			isInfoBoxFullSize: false,
			enableAnimation: true,
		});
		Router.pushRoute('/newselfwales?hide=1');
	};

	// --------------------------------------------------------------------------
	// Search
	// --------------------------------------------------------------------------

	handleSearchBoxChange = (value) => {
		this.setState({
			q: value,
		});
	};

	handleSearchBoxFocus = () => {
		// Check if already on search page
		if (this.props.router.query.param !== 'search') {
			this.setState(
				{
					// isSearchState: false,
					enableAnimation: false,
					pauseInterval: true,
				},
				() => {
					Router.pushRoute('/newselfwales/search', '/newselfwales/search', {
						shallow: true,
					});
				},
			);
		}
	};

	handleSearchBoxBackClick = () => {
		this.setState(
			{
				q: '',
				// Clear internal flag for search
				isSearchState: false,
				enableAnimation: true,
				pauseInterval: false,
			},
			() => {
				Router.pushRoute('/newselfwales');
			},
		);
	};

	handleSearchSubmit = () => {
		const { filters } = this.props.router.query;

		const query = {
			// Use state's q value
			q: this.state.q,
			...(filters
				? {
						filters,
					}
				: {}),
		};

		if (this.state.q) {
			const url = `/newselfwales/search?${queryString.stringify(query)}`;
			Router.pushRoute(url);
		}
	};

	handleSearchFilterClick = (event, filter) => {
		const query = {
			...this.props.router.query,
			filters: filter.value,
		};

		delete query.param;

		if (filter.value === 'all') {
			delete query.filters;
		}

		const url = `/newselfwales/search?${queryString.stringify(query)}`;

		Router.pushRoute(url);
	};

	handleSearchSuggestionsClick = (q) => {
		// No need to route, already done in SearchSuggestions.
		// Just update state.

		this.setState({
			q,
		});
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
		const { error, pages, router } = this.props;
		const { query } = router;
		const {
			showModal,
			enableAnimation,
			sourceImageBoundingClientRect,
			isInfoBoxFullSize,
			isSearch,
			// isSearchState,
			searchFilters,
			isImageFeedLoading,
			isImageFeedInitiallyLoading,
			hasInitiallyScrolled,
		} = this.state;

		const showImageModal =
			router && router.query.param && router.query.id && true;
		const hideUI = router && router.query.hide === '1';
		const q = query.q || this.state.q;
		const filters = query.filters || this.state.filters;
		const filterValue = filters || 'all';

		if (error) {
			console.log(error);
			return null;
		}

		const page = pages && pages[0];

		// console.log({ isSearch, isSearchState });
		// console.log('state q', this.state.q);
		// console.log('props q', query.q);

		return (
			<App
				title={isSearch ? 'Search' : 'Home'}
				metaDescription={
					// If image is being show, let ImageModal control contents of meta tags
					showImageModal
						? null
						: 'The results of our exhibition #NewSelfWales featuring over 12,000 portraits from the State Library of NSW’s collection, together with selfies from Instagram and our in-gallery photo booth.'
				}
				metaImageUrl={
					showImageModal
						? null
						: 'https://dxlab.sl.nsw.gov.au/static/newselfwales/social-image.jpg'
				}
				metaImageAlt={
					showImageModal
						? null
						: '#NewSelfWales image feed of collection, Instagram and photo booth images'
				}
				pathname="/newselfwales"
			>
				<div className="line" />
				<SearchBox
					value={this.state.q}
					// defaultValue={router.query && router.query.q ? router.query.q : ''}
					className={[
						'newselfwales-page__search-box',
						hideUI ? 'newselfwales-page__search-box--is-hidden' : '',
					].join(' ')}
					isActive={isSearch}
					onChange={this.handleSearchBoxChange}
					onFocus={this.handleSearchBoxFocus}
					onBackClick={this.handleSearchBoxBackClick}
					onSubmit={this.handleSearchSubmit}
				/>

				{isSearch && (
					<Fragment>
						<SearchFilters
							className="newselfwales-page__search-filters"
							filters={searchFilters.map((searchFilter) => {
								return {
									...searchFilter,
									isDisabled: searchFilter.value === 'all' ? false : !q,
								};
							})}
							value={filterValue}
							onClick={this.handleSearchFilterClick}
						/>

						{!q && (
							<SearchSuggestions
								className="newselfwales-page__search-suggestions"
								limit={5}
								suggestions={suggestions}
								onClick={this.handleSearchSuggestionsClick}
							/>
						)}

						<div className="newselfwales-page__search-results">
							<SearchResultsContainer
								// Use state's q when showing image modal because route loses search and q params.
								q={showImageModal ? this.state.q : query.q}
								filters={filters ? [filters] : null}
								onImageClick={this.handleImageModalClick}
								onImageKeyPress={this.handleImageModalClick}
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

					<LoaderText
						className="newselfwales-page__image-feed-loader"
						isActive={
							isImageFeedLoading ||
							isImageFeedInitiallyLoading ||
							hasInitiallyScrolled === false
						}
					/>

					{/* {(isImageFeedLoading ||
						isImageFeedInitiallyLoading ||
						hasInitiallyScrolled === false) && (
						<LoaderText className="newselfwales-page__image-feed-loader" />
					)} */}

					{isImageFeedInitiallyLoading && (
						<div className="newselfwales-page__image-feed-loader-text">
							<p>Please wait for our live image feed...</p>
							<MessageWidget
								className="newselfwales-page__message-widget"
								messages={[
									'The feed broadcasts every 20 seconds from a central server',
									"Around 5,500 portraits from the Library's collection appear in the feed.",
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
							className={[
								'newselfwales-page__info-box',
								hideUI ? 'newselfwales-page__info-box--is-hidden' : '',
							].join(' ')}
							title={page.title}
							excerpt={page.excerpt}
							isFullSize={isInfoBoxFullSize}
							onMoreButtonClick={this.handleMoreButtonClick}
							onCloseButtonClick={this.handleInfoBoxCloseButtonClick}
							onHideButtonClick={this.handleInfoBoxHideButtonClick}
						>
							{page.content}
						</InfoBox>
					)}

				<ImageModalContainer
					isActive={showImageModal}
					imageType={router.query.param}
					id={parseInt(router.query.id, 10)}
					sourceImageBoundingClientRect={sourceImageBoundingClientRect}
					onClose={this.handleImageModalClose}
					onTagClick={this.handleImageModalTagClick}
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

export default graphql(PAGE_QUERY, {
	props: ({ data }) => {
		return {
			...data,
		};
	},
})(withCookies(LandingPage));

const suggestions = [
	{
		name: 'Ball',
		q: 'ball',
	},
	{
		name: 'Max Dupain',
		q: 'max dupain',
	},
	{
		name: 'Grace',
		q: 'grace',
	},
	{
		name: 'Tony Mott',
		q: 'mott',
	},
	{
		name: 'Architects',
		q: 'architect',
	},
	{
		name: 'Spring',
		q: 'spring',
	},
	{
		name: 'Cricket',
		q: 'cricket',
	},
	{
		name: 'David Scott Mitchell',
		q: 'Mitchell',
	},
	{
		name: 'Newtown',
		q: 'newtown',
	},
	{
		name: 'Aboriginal',
		q: 'Aboriginal',
	},
	{
		name: 'B. O. Holtermann',
		q: 'holterman',
	},
	{
		name: 'Hood',
		q: 'hood',
	},
	{
		name: 'Waterloo',
		q: 'waterloo',
	},
	{
		name: 'Tribune',
		q: 'tribune',
	},
];
