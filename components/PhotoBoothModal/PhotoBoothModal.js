import { Component } from 'react';

import './PhotoBoothModal.css';
import PhotoBoothModalForm from '../PhotoBoothModalForm';
import { Router } from '../../routes';
import webcam, { dataURItoBlob } from '../../lib/webcam';

const TRIGGER_LETTER = 192; // backtick
const CAM_NAME = 'HD Pro Webcam C920';

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			interests: 'food, candy, money, books, glue',
			email: 'test@test.com',
			name: 'Selfie Test',
			formErrors: { interests: '', email: '' },
			interestsValid: false,
			emailValid: true,
			formValid: false,
			isBlink: false,
		};
	}

	static defaultProps = {
		stage: 'start',
	};

	componentDidMount() {
		// Check keyboard
		window.addEventListener('keyup', this.handleKeyUp);

		// Set up webcam if stage is 'take-selfie'
		if (this.props.stage === 'take-selfie') {
			// Set up webcam
			webcam(this.videoFeed, CAM_NAME);
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.stage !== this.props.stage) {
			if (this.props.stage === 'take-selfie') {
				// Set up webcam
				webcam(this.videoFeed, CAM_NAME);
			} else {
				/* eslint-disable no-lonely-if */
				if (window.stream) {
					window.stream.getTracks().forEach((track) => {
						track.stop();
					});
				}
			}
		}
	}

	handleKeyUp = (e) => {
		if (e.keyCode === TRIGGER_LETTER) {
			this.takeSelfie();
		}
	};

	startSelfie = () => {
		Router.pushRoute('/photo-booth?stage=take-selfie');
	};

	takeSelfie = () => {
		this.blinkIt();

		this.context = this.canvas.getContext('2d');
		this.context.drawImage(this.videoFeed, 0, 0, 1080, 1080);
		this.previewCTX = this.selfiePreview.getContext('2d');
		this.previewCTX.drawImage(this.videoFeed, 0, 0, 300, 300);
		const dataURL = this.canvas.toDataURL('image/png');
		this.blob = dataURItoBlob(dataURL);

		// Router.pushRoute('/photo-booth?stage=confirm-selfie');
		Router.pushRoute('/photo-booth?stage=send-selfie');
	};

	retakeSelfie = () => {
		Router.pushRoute('/photo-booth?stage=take-selfie');
	};

	sendSelfie = () => {
		Router.pushRoute('/photo-booth?stage=send-selfie');
	};

	handleFormSubmitComplete = () => {
		this.showThanks();
	};

	goHome = () => {
		Router.pushRoute('/photo-booth?stage=start');
	};

	blinkIt = () => {
		this.setState({
			isBlink: true,
		});

		this.blink = setInterval(this.blinkOff, 75);
	};

	blinkOff = () => {
		this.setState({
			isBlink: false,
		});

		clearInterval(this.blink);
	};

	showThanks = () => {
		Router.pushRoute('/photo-booth?stage=show-thanks');

		// also need to clear form fields!
		this.thanksInterval = setInterval(this.clearThanks, 1500);
	};

	clearThanks = () => {
		clearInterval(this.thanksInterval);
		this.goHome();
	};

	render() {
		const { isBlink } = this.state;
		const { stage } = this.props;

		return (
			<div
				className={`photo-booth-modal ${
					stage !== 'start' ? 'photo-booth-modal--full' : ''
				} ${isBlink ? 'photo-booth-modal--is-blink' : ''}`}
			>
				{stage !== 'start' && (
					<button
						className="photo-booth-modal__close-button"
						onClick={this.goHome}
					>
						<i className="ion-md-close" />
					</button>
				)}

				<div className="photo-booth-modal__photo-box">
					<h1 className="photo-booth-modal__title">Take a selfie</h1>

					{stage === 'start' && (
						<img
							src="../../static/newselfwales/images/silhouettes/silhouette.png"
							alt="Silhouette of person"
							className="photo-booth-modal__silhouette"
						/>
					)}

					<br />

					{stage === 'take-selfie' && (
						<video
							className="photo-booth-modal__video photo-booth-modal__video--feed"
							ref={(element) => {
								this.videoFeed = element;
							}}
							width="1080"
							height="1080"
							autoPlay
						/>
					)}

					{(stage === 'start' || stage === 'take-selfie') && (
						<button
							className="photo-booth-modal__camera-button"
							onClick={stage === 'start' ? this.startSelfie : this.takeSelfie}
						>
							{stage === 'start' ? 'Start' : 'Take'}
						</button>
					)}

					<div
						style={{
							display: stage === 'confirm-selfie' ? 'block' : 'none',
						}}
					>
						<canvas
							id="canvas"
							className="photo-booth-modal__video photo-booth-modal__video--preview"
							ref={(element) => {
								this.canvas = element;
							}}
							width="1080"
							height="1080"
						/>

						<div className="photo-booth-modal__buttons">
							<button
								className="button"
								onClick={this.retakeSelfie}
								id="retake"
							>
								re-take
							</button>
							<button className="button" onClick={this.sendSelfie}>
								use this
							</button>
						</div>
					</div>
				</div>

				<div
					className="photo-booth-modal__send-selfie"
					style={{
						display: stage === 'send-selfie' ? 'flex' : 'none',
					}}
				>
					<div className="photo-booth-modal__send-selfie__preview">
						<canvas
							id="preview"
							className="photo-booth-modal__video photo-booth-modal__video--preview"
							ref={(element) => {
								this.selfiePreview = element;
							}}
							width="300"
							height="300"
						/>
						<button className="button" onClick={this.retakeSelfie}>
							<i className="ion-md-arrow-back" /> re-take
						</button>
					</div>

					<PhotoBoothModalForm
						blob={this.blob}
						onFormSubmitComplete={this.handleFormSubmitComplete}
						onQuitClick={this.goHome}
					/>
				</div>

				{stage === 'show-thanks' && (
					<div className="photo-booth-modal__show-thanks">
						<p>Thank you!</p>
						<button className="button" onClick={this.goHome}>
							Start again
						</button>
					</div>
				)}

				<footer className="photo-booth-modal__footer">
					<img
						className="photo-booth-modal__nsw-logo"
						alt="NewSelfWales Logo"
						src="../../static/newselfwales/newselfwales-logo-01.gif"
					/>
				</footer>
			</div>
		);
	}
}

export default Home;
