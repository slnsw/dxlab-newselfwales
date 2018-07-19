import { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

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
		return (
			<ApolloProvider client={client}>
				<ImageFeedContainer />
			</ApolloProvider>
		);
	}
}

export default GalleryPage;
