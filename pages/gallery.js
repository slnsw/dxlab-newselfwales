import { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

import App from '../components/App';
import ImageFeedContainer from '../components/ImageFeedContainer';
import { client } from '../lib/initApollo';

import './gallery.css';

class GalleryPage extends Component {
	render() {
		const {
			url: {
				query: {
					enableAnimation = false,
					startImages = 10,
					maxImages = 100,
					intervalTime,
					fetchMoreImages,
				},
			},
		} = this.props;

		return (
			<ApolloProvider client={client}>
				<App>
					<ImageFeedContainer
						enableAnimation={enableAnimation}
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
						fetchMoreImages={
							typeof fetchMoreImages === 'string'
								? parseInt(fetchMoreImages, 10)
								: fetchMoreImages
						}
					/>

					{/* <ImageFeedContainer
						enableAnimation={enableAnimation}
						name="bottom"
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
						fetchMoreImages={
							typeof fetchMoreImages === 'string'
								? parseInt(fetchMoreImages, 10)
								: fetchMoreImages
						}
					/> */}
				</App>
			</ApolloProvider>
		);
	}
}

export default GalleryPage;
