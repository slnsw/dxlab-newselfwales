import { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

import App from '../components/App';
import ImageFeedContainer from '../components/ImageFeedContainer';
import { client } from '../lib/initApollo';

import './gallery.css';

class GalleryPage extends Component {
	constructor() {
		super();

		this.state = {
			enableAnimation: true,
		};
	}

	render() {
		const { url } = this.props;
		const { enableAnimation } = this.state;

		return (
			<ApolloProvider client={client}>
				<App>
					<ImageFeedContainer
						startImages={url.query.startImages || 50}
						enableAnimation={enableAnimation}
					/>
				</App>
			</ApolloProvider>
		);
	}
}

export default GalleryPage;
