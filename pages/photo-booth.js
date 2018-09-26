import { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import withRedux from 'next-redux-wrapper';

import './photo-booth.css';
import '../styles/kiosk.css';
import App from '../components/App';
import ImageFeedContainer from '../components/ImageFeedContainer';
import ImageModalContainer from '../components/ImageModalContainer';
// import SearchContainer from '../components/SearchContainer/SearchContainer';
import PhotoBoothModal from '../components/PhotoBoothModal';
import { client } from '../lib/initApollo';
import { initStore } from '../lib/initRedux';
import { Router } from '../routes';
import { idleTimer } from '../lib/idleTimer';

class PhotoBoothPage extends Component {
	state = {
		enableAnimation: true,
		sourceImageBoundingClientRect: null,
	};

	static defaultProps = {
		url: {
			query: {
				stage: null,
				location: 'local',
			},
		},
	};

	componentDidMount() {
		const { url } = this.props;
		const { idleTimeout = 10, stage, position } = url.query;

		// Redirect if no position param is found, otherwise things will break.
		if (!position) {
			window.location = `/photo-booth/test`;
		}

		// Idle Timer
		console.log('Set idleTimeout to', idleTimeout);
		idleTimer.init(idleTimeout);

		if (stage !== 'start') {
			idleTimer.start(() => {
				Router.pushRoute(`${url.pathname}/${position}?stage=start`);
			});
		}

		if (process.env.BASE_URL !== 'http://localhost:5020') {
			// Disable right click
			console.log('contextmenu disabled');

			document.addEventListener('contextmenu', (event) =>
				event.preventDefault(),
			);
		}
	}

	componentDidUpdate(prevProps) {
		const { url } = this.props;
		const { stage, position } = url.query;
		const { stage: prevStage } = prevProps.url.query;

		if (prevStage !== stage) {
			// Control gallery animation depending on stage

			if (stage === 'take-selfie' || stage === 'about') {
				this.setState({
					enableAnimation: false,
				});
			} else if (stage === 'start' || stage === 'hidden') {
				this.setState({
					enableAnimation: true,
				});
			}

			if (stage !== 'start') {
				idleTimer.start(() => {
					Router.pushRoute(`${url.pathname}/${position}?stage=start`);
				});
			} else {
				idleTimer.stop();
			}
		}
	}

	handleImageClick = (event, image) => {
		const { url } = this.props;

		// console.log(event.target.parentElement.getBoundingClientRect(), image);
		// console.log(image);

		Router.pushRoute(
			`${url.pathname}/${url.query.position}/${image.type}/${image.id}`,
		);

		this.setState({
			enableAnimation: false,
			sourceImageBoundingClientRect: event.target.parentElement.getBoundingClientRect(),
		});
	};

	handleImageModalClose = () => {
		const { url } = this.props;

		Router.pushRoute(
			`${url.pathname}/${url.query.position}${
				url.query.stage === 'search' ? '?stage=search' : ''
			}`,
		);

		this.setState({
			enableAnimation: true,
		});
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

						<PhotoBoothModal
							stage={url.query.stage}
							url={url}
							useScreenKeyboard={true}
						/>

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
