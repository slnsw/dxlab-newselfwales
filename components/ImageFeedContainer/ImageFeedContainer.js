import { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './ImageFeedContainer.css';
import ImageFeed from '../ImageFeed';

class ImageFeedContainer extends Component {
	static propTypes = {
		enableAnimation: PropTypes.bool,
	};

	constructor() {
		super();

		this.state = {
			enableAnimation: false,
			increment: 0.5,
		};
	}

	componentDidMount() {
		window.addEventListener('keyup', this.handleKey, true);
	}

	// componentDidUpdate() {
	// 	if (
	// 		this.props.enableAnimation &&
	// 		this.props.enableAnimation !== this.state.enableAnimation
	// 	) {
	// 		this.setState({
	// 			enableAnimation: this.props.enableAnimation,
	// 		});
	// 	}
	// }

	static getDerivedStateFromProps(props, state) {
		console.log(props, state);

		return {
			enableAnimation: true,
		};
	}

	handleKey = (event) => {
		if (event.code === 'ArrowUp') {
			this.setState(
				{
					increment: this.state.increment + 0.5,
				},
				() => console.log('increment: ', this.state.increment),
			);
		} else if (event.code === 'ArrowDown') {
			this.setState(
				{
					increment: this.state.increment - 0.5,
				},
				() => console.log('increment: ', this.state.increment),
			);
		} else if (event.code === 'Space') {
			this.setState({
				enableAnimation: !this.state.enableAnimation,
			});
		}
	};

	render() {
		const { enableAnimation, increment } = this.state;
		// console.log(enableAnimation);

		// let enableAnimation = enableAnimationState;

		// if (
		// 	this.props.enableAnimation &&
		// 	this.props.enableAnimation !== this.state.enableAnimation
		// ) {
		// 	enableAnimation = this.props.enableAnimation;
		// }

		return (
			<div className="image-feed-container">
				<Query
					query={PAGE_QUERY}
					variables={{
						offset: 0,
						limit: 50,
					}}
				>
					{({ loading, error, data, fetchMore }) => {
						if (loading) {
							return <div />;
						}

						if (error) {
							console.log(error);
							return null;
						}

						// const page = data.pages && data.pages[0];
						const images = data.portraits.map((portrait) => {
							return {
								...portrait,
								imageUrl: portrait.featuredMedia.sourceUrl,
							};
						});

						return (
							<ImageFeed
								images={images}
								maxImages={100}
								enableAnimation={enableAnimation}
								increment={increment}
								onLoadMore={() =>
									fetchMore({
										variables: {
											offset: images.length,
											limit: 2,
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (!fetchMoreResult) return prev;

											return Object.assign({}, prev, {
												portraits: [
													...prev.portraits,
													...fetchMoreResult.portraits,
												],
											});
										},
									})
								}
							/>
						);
					}}
				</Query>
			</div>
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

export default ImageFeedContainer;
