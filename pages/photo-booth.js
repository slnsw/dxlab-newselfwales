import { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import withRedux from 'next-redux-wrapper';

import './photo-booth.css';
import App from '../components/App';
import ImageFeedContainer from '../components/ImageFeedContainer';
import ImageModalContainer from '../components/ImageModalContainer';
// import SearchContainer from '../components/SearchContainer/SearchContainer';
import PhotoBoothModal from '../components/PhotoBoothModal';
import { client } from '../lib/initApollo';
import { initStore } from '../lib/initRedux';
import { Router } from '../routes';

class PhotoBoothPage extends Component {
	state = {
		enableAnimation: true,
		sourceImageBoundingClientRect: null,
	};

	handleImageClick = (event, image) => {
		// console.log(event.target.parentElement.getBoundingClientRect(), image);
		// console.log(image);

		Router.pushRoute(`/photo-booth/${image.type}/${image.id}`);

		this.setState({
			enableAnimation: false,
			sourceImageBoundingClientRect: event.target.parentElement.getBoundingClientRect(),
		});
	};

	handleImageModalClose = () => {
		const { url } = this.props;

		Router.pushRoute(
			`${url.pathname}${url.query.stage === 'search' ? '?stage=search' : ''}`,
		);
	};

	render() {
		const { url } = this.props;
		const { sourceImageBoundingClientRect, enableAnimation } = this.state;
		const showImageModal = url && url.query.imageType && url.query.id && true;

		return (
			<ApolloProvider client={client}>
				<App title="Photo Booth">
					<div className="photo-booth-page">
						<ImageFeedContainer
							name="photo-booth"
							startImages={30}
							maxImages={50}
							enableAnimation={enableAnimation}
							onImageClick={(event, image) =>
								this.handleImageClick(event, image)
							}
						/>

						<PhotoBoothModal stage={url.query.stage} url={url} />

						{/* {url.query.stage === 'search' && (
							<div className="photo-booth-page__search">
								<SearchContainer url={url} />
							</div>
						)} */}

						<ImageModalContainer
							isActive={showImageModal || false}
							imageType={url.query.imageType}
							id={parseInt(url.query.id, 10)}
							sourceImageBoundingClientRect={sourceImageBoundingClientRect}
							onClose={this.handleImageModalClose}
						/>
					</div>
				</App>
			</ApolloProvider>
		);
	}
}

export default withRedux(initStore)(PhotoBoothPage);
