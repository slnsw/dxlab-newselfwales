import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Keyboard from 'react-screen-keyboard';

import './PhotoBoothModal.css';
import './Keyboard.css';
import PhotoBoothModalForm from '../PhotoBoothModalForm';
import SearchContainer from '../SearchContainer';
import { Router } from '../../routes';
import webcam, { dataURItoBlob } from '../../lib/webcam';
import { LatinLayoutCustom } from '../../lib';

const TRIGGER_LETTER = 192; // backtick
const CAM_NAME = 'HD Pro Webcam C920';

class Home extends Component {
	static propTypes = {
		url: PropTypes.object,
		stage: PropTypes.string,
	};

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

		this.setState({
			inputNode: null,
		});
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

		this.setState({
			inputNode: null,
		});
	};

	sendSelfie = () => {
		Router.pushRoute('/photo-booth?stage=send-selfie');
	};

	handleFormSubmitComplete = () => {
		this.showThanks();
	};

	goHome = () => {
		Router.pushRoute('/photo-booth?stage=start');

		// Reset keyboard
		this.setState({
			inputNode: null,
		});
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

	handleHideButtonClick = () => {
		if (this.props.stage === 'start') {
			Router.pushRoute('/photo-booth?stage=hidden');
		} else if (this.props.stage === 'hidden') {
			Router.pushRoute('/photo-booth?stage=start');
		}
	};

	handleSearchButton = () => {
		Router.pushRoute('/photo-booth?stage=search');
	};

	handleSearchInputTextFocus = (input) => {
		this.setState({
			inputNode: input,
		});
	};

	handleSearchInputTextBlur = () => {
		console.log('hi');

		this.setState({
			inputNode: null,
		});
	};

	render() {
		const { isBlink, inputNode } = this.state;
		const { stage, url } = this.props;

		return (
			<div
				className={[
					'photo-booth-modal',
					stage !== 'start' && stage !== 'hidden'
						? 'photo-booth-modal--full'
						: '',
					stage === 'hidden' ? 'photo-booth-modal--hidden' : '',
					isBlink ? 'photo-booth-modal--is-blink' : '',
				].join(' ')}
			>
				{(stage === 'start' || stage === 'hidden') && (
					<button
						className={['photo-booth-modal__hide-button']}
						onClick={this.handleHideButtonClick}
					>
						<i
							className={`ion-ios-arrow-${
								stage === 'hidden' ? 'back' : 'forward'
							}`}
						/>
					</button>
				)}

				{stage !== 'start' &&
					stage !== 'hidden' && (
						<button
							className="photo-booth-modal__close-button"
							onClick={this.goHome}
						>
							<i className="ion-md-close" />
						</button>
					)}

				<div className="photo-booth-modal__photo-box">
					{(stage === 'start' || stage === 'take-selfie') && (
						<h1 className="photo-booth-modal__title">Take a Selfie!</h1>
					)}

					{stage === 'start' && (
						<Fragment>
							<img
								src="../../static/newselfwales/images/silhouettes/silhouette.png"
								alt="Silhouette of person"
								className="photo-booth-modal__silhouette"
							/>

							<br />

							<button className="button" onClick={this.startSelfie}>
								Start
							</button>
						</Fragment>
					)}

					{stage === 'take-selfie' && (
						<Fragment>
							<video
								className="photo-booth-modal__video photo-booth-modal__video--feed"
								ref={(element) => {
									this.videoFeed = element;
								}}
								width="1080"
								height="1080"
								autoPlay
							/>

							<button
								className="photo-booth-modal__camera-button"
								onClick={this.takeSelfie}
							>
								Take
							</button>
						</Fragment>
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

					{stage === 'send-selfie' && (
						<PhotoBoothModalForm
							blob={this.blob}
							onFormSubmitComplete={this.handleFormSubmitComplete}
							onQuitClick={this.goHome}
							onInputTextFocus={this.handleSearchInputTextFocus}
						/>
					)}
				</div>

				{stage === 'show-thanks' && (
					<div className="photo-booth-modal__show-thanks">
						<h1>Thank you!</h1>
						<p>Your selfie has been added</p>

						<button className="button" onClick={this.goHome}>
							Start again
						</button>
					</div>
				)}

				<div
					className={[
						'photo-booth-modal__search',
						stage === 'search' ? 'photo-booth-modal__search--is-active' : '',
					].join(' ')}
				>
					<SearchContainer
						url={url}
						isActive={stage === 'search'}
						onInputTextFocus={this.handleSearchInputTextFocus}
						onInputTextBlur={this.handleSearchInputTextBlur}
					/>
				</div>

				<footer className="photo-booth-modal__footer">
					{stage === 'start' && (
						<ul className="photo-booth-modal__menu">
							<li
								className="photo-booth-modal__menu-item"
								onClick={this.handleSearchButton}
							>
								<i className="ion-md-search" /> Search
							</li>
							<li className="photo-booth-modal__menu-item">
								<i className="ion-md-information-circle-outline" /> About
							</li>
						</ul>
					)}

					<img
						className="photo-booth-modal__nsw-logo"
						alt="NewSelfWales Logo"
						src="../../static/newselfwales/newselfwales-logo-01.gif"
					/>
				</footer>

				<div
					className={[
						'photo-booth-modal__keyboard',
						inputNode ? 'photo-booth-modal__keyboard--is-active' : '',
					].join(' ')}
				>
					{process.browser &&
						inputNode && (
							<Keyboard inputNode={inputNode} layouts={[LatinLayoutCustom]} />
						)}
				</div>
			</div>
		);
	}
}

export default Home;
