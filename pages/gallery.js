import { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

import App from '../components/App';
import ImageFeedContainer from '../components/ImageFeedContainer';
import { client } from '../lib/initApollo';

import './gallery.css';

class GalleryPage extends Component {
	static defaultProps = {
		url: {
			query: {
				enableAnimation: false,
				startImages: 50,
				intervalTime: 10000,
				fetchMoreImages: 5,
				maxImages: 1000,
			},
		},
	};

	render() {
		const {
			url: {
				query: {
					enableAnimation = true,
					startImages,
					intervalTime,
					fetchMoreImages,
					maxImages,
				},
			},
		} = this.props;

		return (
			<ApolloProvider client={client}>
				<App>
					<ImageFeedContainer
						enableAnimation={enableAnimation}
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
				</App>
			</ApolloProvider>
		);
	}
}

export default GalleryPage;
