import { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

import './photo-booth.css';
import App from '../components/App';
import ImageFeedContainer from '../components/ImageFeedContainer';
import PhotoBoothModal from '../components/PhotoBoothModal';
import { client } from '../lib/initApollo';

class PhotoBoothPage extends Component {
	render() {
		return (
			<ApolloProvider client={client}>
				<App title="Photo Booth">
					<div className="photo-booth-page">
						<ImageFeedContainer maxImages={20} />
						<PhotoBoothModal />
					</div>
				</App>
			</ApolloProvider>
		);
	}
}

export default PhotoBoothPage;
