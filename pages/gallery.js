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
		const { enableAnimation } = this.state;

		return (
			<ApolloProvider client={client}>
				<ImageFeedContainer enableAnimation={enableAnimation} />
			</ApolloProvider>
		);
	}
}

export default GalleryPage;
