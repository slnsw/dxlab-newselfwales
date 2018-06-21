import { Component } from 'react';

import ExampleApp from '../components/examples/ExampleApp';
import wpUpload from '../lib/wpUpload';
import webcam from '../lib/webcam';

// TODO: Re-enable after rescoping CSS
import './photobooth.css';

// this is the letter that will trigger the snapshot
const triggerLetter = 192; // backtick

class Home extends Component {
	componentDidMount() {
		// get WP API ready
		wpUpload.init({
			endpoint: process.env.WP_API_ENDPOINT,
			username: process.env.WP_USERNAME,
			password: process.env.WP_PASSWORD,
		});

		// this is the camera we want to use
		const camName = 'HD Pro Webcam C920';
		// display the stream from this cam in the video element
		webcam(this.refs.video, camName);
		// wait for keystrokes to take a selfie
		window.addEventListener('keydown', this.checkKeyPressed, false);
	}

	constructor(props) {
		super(props);
		this.state = {
			interests: '',
			email: '',
			name: '',
			formErrors: { interests: '', email: '' },
			interestsValid: false,
			emailValid: true,
			formValid: false,
			blob: null,
			stage: 'stage1',
		};

		this.handleUserInput = this.handleUserInput.bind(this);
	}

	uploadSelfie = () => {
		// make buttons look like something is happening
		submitBut.disabled = true;
		submitBut.innerHTML = 'working...';
		quitBut.disabled = true;
		quitBut.innerHTML = 'working...';
		// now use WP API to upload selfie and data
		wpUpload.upload(
			{
				type: 'gallery',
				blob: this.state.blob,
				content: this.state.interests,
				email: this.state.email,
				name: this.state.name,
			},
			this.showThanks,
		);
	};

	dataURItoBlob = (dataURI) => {
		let byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
		else byteString = unescape(dataURI.split(',')[1]);
		const mimeString = dataURI
			.split(',')[0]
			.split(':')[1]
			.split(';')[0];
		const ia = new Uint8Array(byteString.length);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ia], { type: mimeString });
	};

	takeSelfie = () => {
		this.blinkIt();
		const c = this.refs.canvas;
		const context = c.getContext('2d');
		context.drawImage(this.refs.video, 0, 0, 1080, 1080);
		const p = this.refs.previewCVS;
		const previewCTX = p.getContext('2d');
		previewCTX.drawImage(this.refs.video, 0, 0, 300, 300);
		const dataURL = c.toDataURL('image/png');
		this.setState({
			stage: 'stage2',
			blob: this.dataURItoBlob(dataURL),
		});
	};

	blinkIt = () => {
		document.body.style.background = '#e6007e';
		this.blink = setInterval(this.blinkOff, 75);
	};

	blinkOff = () => {
		document.body.style.background = '#080808';
		clearInterval(this.blink);
	};

	retakeSelfie = () => {
		this.setState({ stage: 'stage1' });
	};

	doPreview = () => {
		this.setState({ stage: 'stage3' });
	};

	quitFromForm = () => {
		this.goHome();
	};

	goHome = () => {
		window.location = './photobooth';
	};

	showThanks = () => {
		this.setState({ stage: 'stage4' });
		this.thanksInterval = setInterval(this.clearThanks, 1800);
	};

	clearThanks = () => {
		clearInterval(this.thanksInterval);
		this.goHome();
	};

	checkKeyPressed = (e) => {
		// console.log(e.keyCode);
		if (e.keyCode === triggerLetter) {
			this.takeSelfie();
		}
	};

	handleUserInput(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value }, () => {
			this.validateField(name, value);
		});
	}

	validateField(fieldName, value) {
		const fieldValidationErrors = this.state.formErrors;
		let interestsValid = this.state.interestsValid;
		let emailValid = this.state.emailValid;

		switch (fieldName) {
			case 'email': {
				if (value.length > 0) {
					emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				} else {
					// no email is a valid email (the field is optional)
					emailValid = true;
				}
				fieldValidationErrors.email = emailValid
					? ''
					: 'Please enter a valid email.';
				break;
			}
			case 'interests': {
				let t = value.split(','); // separate interests by comma
				t = t.filter((entry) => entry.trim() !== ''); // don't count blank ones
				t = t.filter((entry) => entry.trim().length >= 4); // make sure they aren't too short
				interestsValid = t.length > 2; // and make sure we have at least 3
				fieldValidationErrors.interests = interestsValid
					? ''
					: 'Could you enter a bit more info about your interests? Ideally 4 or 5, separated by commas.';
				break;
			}
			default: {
				break;
			}
		}
		this.setState(
			{
				formErrors: fieldValidationErrors,
				emailValid: emailValid,
				interestsValid: interestsValid,
			},
			this.validateForm,
		);
	}

	validateForm() {
		this.setState({
			formValid: this.state.emailValid && this.state.interestsValid,
		});
	}

	render() {
		return (
			<ExampleApp>
				<div className="photobooth">
					<h1 id="title">Take a selfie</h1>
					<div
						id="stage1"
						style={{
							display: this.state.stage === 'stage1' ? 'block' : 'none',
						}}
					>
						<video id="video" ref="video" width="1080" height="1080" autoPlay />
						<br />
						<button id="takeBut" onClick={this.takeSelfie}>
							take selfie
						</button>
					</div>
					<div
						id="stage2"
						style={{
							display: this.state.stage === 'stage2' ? 'block' : 'none',
						}}
					>
						<canvas
							className="photobooth__canvas"
							ref="canvas"
							id="canvas"
							width="1080"
							height="1080"
						/>
						<br />
						<button id="retake" onClick={this.retakeSelfie}>
							re-take
						</button>
						<button id="sendSelfie" onClick={this.doPreview}>
							use this
						</button>
					</div>
					<div
						id="stage3"
						style={{
							display: this.state.stage === 'stage3' ? 'block' : 'none',
						}}
					>
						<canvas ref="previewCVS" id="preview" width="300" height="300" />
						<div id="formdeets" className="selfieForm">
							<ul>
								<li />
								<li>
									Please tell us a few things about yourself so we can match you
									to a portrait from our collection.
								</li>
								<li>
									<label>Your interests:</label>
									<input
										type="text"
										name="interests"
										id="interests"
										value={this.state.interests}
										placeholder="Enter around 4 or 5, separated by commas"
										onChange={(event) => this.handleUserInput(event)}
									/>
									<div className="formErrors interests">
										{this.state.formErrors.interests}
									</div>
								</li>
								<li>
									And supply the follwoing if you would like us to email you the
									results of the match.
								</li>
								<li>
									<label>Your name:</label>
									<input
										type="text"
										name="name"
										id="name"
										value={this.state.name}
										placeholder="Selfie Fiend"
										onChange={(event) => this.handleUserInput(event)}
									/>
								</li>
								<li>
									<label>
										Your email:<br />
									</label>
									<input
										type="email"
										name="email"
										id="email"
										value={this.state.email}
										placeholder="fiend@selfie-land.com"
										onChange={(event) => this.handleUserInput(event)}
									/>
									<span className="formErrors email">
										{this.state.formErrors.email}
									</span>
								</li>
								<li>
									<button
										id="submitBut"
										onClick={this.uploadSelfie}
										disabled={!this.state.formValid}
									>
										submit
									</button>
									<button id="quitBut" onClick={this.quitFromForm}>
										quit
									</button>
								</li>
							</ul>
						</div>
					</div>
					<div
						id="stage4"
						style={{
							display: this.state.stage === 'stage4' ? 'block' : 'none',
						}}
					>
						<p>Thank you</p>
					</div>
				</div>
			</ExampleApp>
		);
	}
}

export default Home;
