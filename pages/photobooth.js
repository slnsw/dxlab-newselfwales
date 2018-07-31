import { Component } from 'react';

import WPAPI from 'wpapi';

import './photobooth.css';
import webcam from '../lib/webcam';
// import wpUpload from '../uploader';

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
			stage: 1,
		};
	}

	componentDidMount() {
		// Set up Wordpress
		this.wp = new WPAPI({
			endpoint: process.env.WP_API_ENDPOINT,
			username: process.env.WP_USERNAME,
			password: process.env.WP_PASSWORD,
		});
		this.wp.gallerySelfies = this.wp.registerRoute(
			'wp/v2',
			'/gallery-selfies/(?P<id>\\d+)',
		);

		// wpUpload.init({
		// 	endpoint: process.env.WP_API_ENDPOINT,
		// 	username: process.env.WP_USERNAME,
		// 	password: process.env.WP_PASSWORD,
		// });

		this.previewCTX = this.selfiePreview.getContext('2d');

		// Set up webcam
		webcam(this.videoFeed, CAM_NAME);

		// Check keyboard
		window.addEventListener('keyup', this.handleKeyUp);
	}

	handleKeyUp = (e) => {
		if (e.keyCode === TRIGGER_LETTER) {
			this.takeSelfie();
		}
	};

	takeSelfie = () => {
		this.blinkIt();
		this.context = this.canvas.getContext('2d');
		this.context.drawImage(this.videoFeed, 0, 0, 1080, 1080);
		this.previewCTX.drawImage(this.videoFeed, 0, 0, 300, 300);
		const dataURL = this.canvas.toDataURL('image/png');
		this.blob = this.dataURItoBlob(dataURL);

		this.setState({
			stage: 2,
		});
	};

	retakeSelfie = () => {
		this.setState({
			stage: 1,
		});
	};

	sendSelfie = () => {
		this.setState({
			stage: 3,
		});
	};

	handleSubmitForm = () => {
		// make buttons look like something is happening
		// submitBut.disabled = true;
		// submitBut.innerHTML = 'working...';
		// quitBut.disabled = true;
		// quitBut.innerHTML = 'working...';

		const date = new Date();
		const n = `selfie ${date.getTime()}`;

		// wpUpload.upload({
		// 	title: `New post ${n}`,
		// 	content: `Content ${n}`,
		// 	status: 'draft',
		// 	email: 'some@email.com',
		// 	name: 'test-test_some name',
		// 	blob: this.blob,
		// });

		// now create custom post type 'gallery selfie'
		this.wp
			.gallerySelfies()
			.create({
				title: `New post ${n}`,
				content: `Content ${n}`,
				status: 'draft',
				meta: {
					email: 'some@email.com',
					name: 'test-test_some name',
				},
			})
			.then((response) => {
				const newPost = response.id;

				this.wp
					.media()
					.file(this.blob, `${n}.png`)
					.create({
						title: n,
						alt_text: n,
						caption: n,
						description: n,
					})
					.then((response2) => {
						const newImageId = response2.id;
						return this.wp
							.gallerySelfies()
							.id(newPost)
							.update({
								featured_media: newImageId,
							});
					})
					.then(() => {
						this.showThanks();
					})
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	goHome = () => {
		window.location = './photobooth';
	};

	blinkIt = () => {
		document.body.style.background = '#e6007e';
		this.blink = setInterval(this.blinkOff, 75);
	};

	blinkOff = () => {
		document.body.style.background = '#080808';
		clearInterval(this.blink);
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

	handleUserInput = (e) => {
		const { name, value } = e.target;

		this.setState({ [name]: value }, () => {
			this.validateField(name, value);
		});
	};

	showThanks = () => {
		this.setState({
			stage: 4,
		});

		window.stream.getTracks().forEach((track) => {
			track.stop();
		});

		// also need to clear form fields!
		this.thanksInterval = setInterval(this.clearThanks, 1500);
	};

	clearThanks = () => {
		clearInterval(this.thanksInterval);
		this.goHome();
	};

	validateField(fieldName, value) {
		const fieldValidationErrors = this.state.formErrors;
		let { interestsValid, emailValid } = this.state;

		switch (fieldName) {
			case 'email': {
				if (value.length > 0) {
					emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				} else {
					// no email is a valid email
					emailValid = true;
				}
				fieldValidationErrors.email = emailValid
					? ''
					: 'Please enter a valid email.';
				break;
			}
			case 'interests': {
				const t = value
					.split(',') // separate interests by comma
					.filter((entry) => entry.trim() !== '')
					.filter(
						// rdon't count blank ones
						(entry) => entry.trim().length >= 4,
					); // make sure they aren't too short

				interestsValid = t.length > 2; // and make sure we have at least 3
				fieldValidationErrors.interests = interestsValid
					? ''
					: 'Could you enter a bit more info about your interests? Ideally 4 or 5, separated by commas.';
				break;
			}
			default:
				break;
		}

		this.setState(
			{
				formErrors: fieldValidationErrors,
				emailValid,
				interestsValid,
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
		const { stage } = this.state;

		return (
			<div>
				<h1 id="title">Take a selfie</h1>

				<div
					style={{
						display: stage === 1 ? 'block' : 'none',
					}}
				>
					<video
						className="photobooth__video-feed"
						ref={(element) => {
							this.videoFeed = element;
						}}
						width="1080"
						height="1080"
						autoPlay
					/>
					<br />
					<button onClick={this.takeSelfie}>take selfie</button>
				</div>

				<div
					style={{
						display: stage === 2 ? 'block' : 'none',
					}}
				>
					<canvas
						id="canvas"
						className="photobooth__canvas"
						ref={(element) => {
							this.canvas = element;
						}}
						width="1080"
						height="1080"
					/>
					<br />
					<button onClick={this.retakeSelfie} id="retake">
						re-take
					</button>
					<button id="sendSelfie" onClick={this.sendSelfie}>
						use this
					</button>
				</div>

				<div
					style={{
						display: stage === 3 ? 'block' : 'none',
					}}
				>
					<canvas
						id="preview"
						ref={(element) => {
							this.selfiePreview = element;
						}}
						width="300"
						height="300"
					/>
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
									onClick={this.handleSubmitForm}
									id="submitBut"
									disabled={!this.state.formValid}
								>
									submit
								</button>
								<button onClick={this.goHome} id="quitBut">
									quit
								</button>
							</li>
						</ul>
					</div>
				</div>

				{stage === 4 && (
					<div>
						<p>Thank you</p>
					</div>
				)}
			</div>
		);
	}
}

export default Home;
