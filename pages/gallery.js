import { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

import App from '../components/App';
import ImageFeedContainer from '../components/ImageFeedContainer';
// import ImageModalContainer from '../components/ImageModalContainer';
import { client } from '../lib/initApollo';

import './gallery.css';

class GalleryPage extends Component {
	handleImageClick = (event, image) => {
		window.open(
			`https://newselfwales.dxlab.sl.nsw.gov.au/selfie/wp-admin/post.php?post=${
				image.id
			}&action=edit`,
			'_blank',
		);
	};

	render() {
		const {
			url: {
				query: {
					enableAnimation = 'true',
					startImages = 20,
					maxImages = 100,
					increment = 0.5,
					intervalTime,
					fetchMoreImages,
					loadMoreGap,
				},
			},
		} = this.props;

		return (
			<ApolloProvider client={client}>
				<App>
					<ImageFeedContainer
						enableAnimation={enableAnimation === 'true'}
						name="top"
						intervalTime={
							typeof intervalTime === 'string'
								? parseInt(intervalTime, 10)
								: intervalTime
						}
						startImages={
							typeof startImages === 'string'
								? parseInt(startImages, 10)
								: startImages
						}
						maxImages={
							typeof maxImages === 'string'
								? parseInt(maxImages, 10)
								: maxImages
						}
						increment={
							typeof increment === 'string'
								? parseFloat(increment, 10)
								: increment
						}
						fetchMoreImages={
							typeof fetchMoreImages === 'string'
								? parseInt(fetchMoreImages, 10)
								: fetchMoreImages
						}
						loadMoreGap={
							typeof loadMoreGap === 'string'
								? parseInt(loadMoreGap, 10)
								: loadMoreGap
						}
						onImageClick={this.handleImageClick}
					/>
				</App>
			</ApolloProvider>
		);
	}
}

export default GalleryPage;
