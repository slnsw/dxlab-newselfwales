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
import SearchSuggestions from '../components/SearchSuggestions';
import Overlay from '../components/Overlay';
import MessageWidget from '../components/MessageWidget';
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
			isSearchState: false,
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

	componentDidUpdate(prevProps) {
		if (prevProps.url.query !== this.props.url.query) {
			const { query } = this.props.url;

			let isSearch;

			if (query.param === 'search') {
				isSearch = true;
			} else {
				isSearch = this.state.isSearchState;
			}

			this.setState({
				// Use query.param but also check internal flag for search
				isSearch,
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
		const { q, filters } = this.props.url.query;

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
			this.setState(
				{
					// isSearchState: false,
					enableAnimation: false,
					pauseInterval: true,
				},
				() => {
					Router.pushRoute('/newselfwales/search');
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
		// 	q,
		// 	filterValue,
		// isImageFeedInitiallyLoading,
		// isImageFeedLoading,
		// hasInitiallyScrolled,
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
							<SearchSuggestions
								className="newselfwales-page__search-suggestions"
								limit={5}
								suggestions={[
									{
										name: 'Ball',
										url: '/newselfwales/search?q=ball',
									},
									{
										name: 'Max Dupain',
										url: '/newselfwales/search?q=max',
									},
									{
										name: 'Grace',
										url: '/newselfwales/search?q=grace',
									},
									{
										name: 'Tony Mott',
										url: '/newselfwales/search?q=mott',
									},
									{
										name: 'Architects',
										url: '/newselfwales/search?q=architect',
									},
									{
										name: 'Spring',
										url: '/newselfwales/search?q=spring',
									},
									{
										name: 'Cricket',
										url: '/newselfwales/search?q=cricket',
									},
									{
										name: 'David Scott Mitchell',
										url: '/newselfwales/search?q=Mitchell',
									},
									{
										name: 'Newtown',
										url: '/newselfwales/search?q=newtown',
									},
									{
										name: 'Aboriginal',
										url: '/newselfwales/search?q=Aboriginal',
									},
									{
										name: 'B. O. Holtermann',
										url: '/newselfwales/search?q=holterman',
									},
									{
										name: 'Hood',
										url: '/newselfwales/search?q=hood',
									},
									{
										name: 'Waterloo',
										url: '/newselfwales/search?q=waterloo',
									},
									{
										name: 'Tribune',
										url: '/newselfwales/search?q=tribune',
									},
								]}
							/>
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
