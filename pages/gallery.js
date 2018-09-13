import { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import withRedux from 'next-redux-wrapper';

import App from '../components/App';
import ImageFeedContainer from '../components/ImageFeedContainer';
import TransceiverContainer from '../components/TransceiverContainer';
import { client } from '../lib/initApollo';
import { initStore } from '../lib/initRedux';

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
					startImages,
					maxImages = 100,
					increment = 0.5,
					intervalTime,
					loadMoreGap,
					marginTop,
					heightAdjust,
					fps,
				},
			},
		} = this.props;

		return (
			<ApolloProvider client={client}>
				<App>
					<ImageFeedContainer
						name="gallery"
						enableAnimation={enableAnimation === 'true'}
						intervalTime={parseStringToInt(intervalTime)}
						startImages={parseStringToInt(startImages)}
						maxImages={parseStringToInt(maxImages)}
						increment={parseStringToFloat(increment)}
						loadMoreGap={parseStringToInt(loadMoreGap)}
						marginTop={marginTop}
						heightAdjust={heightAdjust}
						fps={parseStringToInt(fps)}
						onImageClick={this.handleImageClick}
					/>

					<TransceiverContainer />
				</App>
			</ApolloProvider>
		);
	}
}

export default withRedux(initStore)(GalleryPage);

function parseStringToInt(string) {
	return typeof string === 'string' ? parseInt(string, 10) : string;
}

function parseStringToFloat(string) {
	return typeof string === 'string' ? parseFloat(string, 10) : string;
}
