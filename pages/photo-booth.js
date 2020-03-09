import { Component } from 'react';

import App from '../components/App';
import ImageFeedContainer from '../components/ImageFeedContainer';
import ImageModalContainer from '../components/ImageModalContainer';
import PhotoBoothModal from '../components/PhotoBoothModal';
import { Router } from '../routes';
import { idleTimer } from '../lib/idleTimer';
import { createHealthCheck } from '../lib/healthCheck';

import './photo-booth.css';
// Re-enable if using in-gallery again. This adds unwanted styles to live website
// import '../styles/kiosk.css';

class PhotoBoothPage extends Component {
	state = {
		enableAnimation: true,
		sourceImageBoundingClientRect: null,
	};

	static defaultProps = {
		router: {
			query: {
				stage: null,
			},
		},
	};

	// https://hc-ping.com/af031661-4e3c-4a4c-9cf0-76f665144788

	componentDidMount() {
		const { router } = this.props;
		const { idleTimeout = 60, stage, position } = router.query;
		let healthCheck;

		if (!position) {
			// Redirect if no position param is found, otherwise things will break.

			window.location = `/photo-booth/test`;
		} else if (position === 'left' && process.env.HEALTHCHECK_LEFT_URL) {
			// Set up healthCheck for left photo booth
			healthCheck = createHealthCheck(
				process.env.HEALTHCHECK_LEFT_URL,
				process.env.HEALTHCHECK_LEFT_INTERVAL,
			);

			healthCheck.start();
		} else if (position === 'right' && process.env.HEALTHCHECK_RIGHT_URL) {
			// Set up healthCheck for right photo booth

			healthCheck = createHealthCheck(
				process.env.HEALTHCHECK_RIGHT_URL,
				process.env.HEALTHCHECK_RIGHT_INTERVAL,
			);

			healthCheck.start();
		}

		// Initialise Idle Timer
		console.log('Set idleTimeout to', idleTimeout);
		idleTimer.init(idleTimeout);

		if (stage !== 'start') {
			this.idleTimerStart(router.pathname, position);
		}

		if (process.env.NEWSELFWALES_BASE_URL !== 'http://localhost:5020') {
			// Disable right click
			console.log('contextmenu disabled');

			document.addEventListener('contextmenu', (event) =>
				event.preventDefault(),
			);
		}
	}

	componentDidUpdate(prevProps) {
		const { router } = this.props;
		const { stage, position } = router.query;
		const { stage: prevStage } = prevProps.router.query;

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
				this.idleTimerStart(router.pathname, position);
			} else {
				idleTimer.stop();
			}
		}
	}

	idleTimerStart = (pathname, position) => {
		idleTimer.start(() => {
			Router.pushRoute(`${pathname}/${position}?stage=start&timeout=true`);
		});
	};

	handleImageClick = (event, image) => {
		const { router } = this.props;

		// console.log(event.target.parentElement.getBoundingClientRect(), image);
		// console.log(image);

		Router.pushRoute(
			`${router.pathname}/${router.query.position}/${image.type}/${image.id}`,
		);

		this.setState({
			enableAnimation: false,
			sourceImageBoundingClientRect: event.target.parentElement.getBoundingClientRect(),
		});
	};

	handleImageModalClose = () => {
		const { router } = this.props;

		Router.pushRoute(
			`${router.pathname}/${router.query.position}${
			router.query.stage === 'search' ? '?stage=search' : ''
			}`,
		);

		this.setState({
			enableAnimation: true,
		});
	};

	render() {
		const { router } = this.props;
		const { sourceImageBoundingClientRect, enableAnimation } = this.state;
		const showImageModal =
			router && router.query.imageType && router.query.id && true;

		return (
			<App title="Photo Booth">
				<div className="photo-booth-page">
					<ImageFeedContainer
						name="photo-booth"
						startImages={50}
						maxImages={100}
						enableAnimation={enableAnimation}
						onImageClick={(event, image) => this.handleImageClick(event, image)}
					/>

					<PhotoBoothModal
						stage={router.query.stage}
						url={router}
						useScreenKeyboard={true}
					/>

					{/* {url.query.stage === 'search' && (
							<div className="photo-booth-page__search">
								<SearchContainer url={url} />
							</div>
						)} */}

					<ImageModalContainer
						isActive={showImageModal || false}
						imageType={router.query.imageType}
						id={parseInt(router.query.id, 10)}
						sourceImageBoundingClientRect={sourceImageBoundingClientRect}
						onClose={this.handleImageModalClose}
					/>
				</div>
			</App>
		);
	}
}

// export default withRedux(initStore)(PhotoBoothPage);
export default PhotoBoothPage;
