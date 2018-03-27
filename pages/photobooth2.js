import { Component } from 'react';

import WPAPI from 'wpapi';
import ExampleApp from '../components/examples/ExampleApp';

import './photobooth.css';

class Home extends Component {
	componentDidMount() {
		const wp = new WPAPI({
			endpoint: 'https://local.dxlab.sl.nsw.gov.au/selfie/wp-json',
			username: 'upload',
			password: 'djYU05v5gy0T',
		});

		const camName = 'HD Pro Webcam C920';
		const triggerLetter = 192; // backtick
		const takeBut = document.getElementById('snap');
		const retakeBut = document.getElementById('retake');
		const useBut = document.getElementById('sendSelfie');
		const submitBut = document.getElementById('submitBut');
		const quitBut = document.getElementById('quitBut');
		const stage1 = document.getElementById('stage1');
		const stage2 = document.getElementById('stage2');
		const stage3 = document.getElementById('stage3');
		const stage4 = document.getElementById('stage4');
		let devId;
		let blob;
		let blink;
		let thanksInterval;
		const video = document.getElementById('video');
		const canvas = document.getElementById('canvas');
		const context = canvas.getContext('2d');
		const previewCVS = document.getElementById('preview');
		const previewCTX = previewCVS.getContext('2d');
		let constraints = {};

		function dataURItoBlob(dataURI) {
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
		}

		function blinkIt() {
			document.body.style.background = '#e6007e';
			blink = setInterval(blinkOff, 75);
		}

		function blinkOff() {
			document.body.style.background = '#080808';
			clearInterval(blink);
		}

		function showThanks() {
			// also need to clear form fields!
			stage4.style.display = 'block';
			stage3.style.display = 'none';
			thanksInterval = setInterval(clearThanks, 1500);
		}

		function clearThanks() {
			stage4.style.display = 'none';
			stage1.style.display = 'block';
			useBut.disabled = false;
			retakeBut.disabled = false;
			clearInterval(thanksInterval);
		}

		function quitFromForm() {
			stage3.style.display = 'none';
			stage1.style.display = 'block';
			useBut.disabled = false;
			retakeBut.disabled = false;
		}

		function goHome() {
			window.location = './';
		}

		function gotDevices(deviceInfos) {
			for (let i = 0; i !== deviceInfos.length; ++i) {
				const deviceInfo = deviceInfos[i];
				if (
					deviceInfo.kind === 'videoinput' &&
					deviceInfo.label.substring(0, 18) === camName
				) {
					devId = deviceInfo.deviceId;
				}
			}
		}

		function getStream() {
			if (window.stream) {
				window.stream.getTracks().forEach(function(track) {
					track.stop();
				});
			}
			constraints = {
				video: {
					deviceId: { exact: devId }, // videoSelect.value
					width: 1080,
					height: 1080,
				},
			};
			navigator.mediaDevices
				.getUserMedia(constraints)
				.then(gotStream)
				.catch(handleError);
		}

		function gotStream(stream) {
			window.stream = stream; // make stream available to console
			video.srcObject = stream;
		}

		function handleError(error) {
			console.error('Error: ', error);
		}

		function takeSelfie() {
			blinkIt();
			context.drawImage(video, 0, 0, 1080, 1080);
			previewCTX.drawImage(video, 0, 0, 300, 300);
			stage1.style.display = 'none';
			stage2.style.display = 'block';
			const dataURL = canvas.toDataURL('image/png');
			blob = dataURItoBlob(dataURL);
		}

		function retakeSelfie() {
			stage1.style.display = 'block';
			stage2.style.display = 'none';
		}

		function uploadSelfie() {
			//		useBut.disabled = true;
			//		retakeBut.disabled = true;
			const d = new Date();
			const n = 'selfie' + d.getTime();
			wp
				.media()
				.file(blob, n+'.png')
				.create({
					title: n,
					alt_text: n,
					caption: n,
					description: n,
				})
				.then(function(response) {
					const newImageId = response.id; // will need to send this to the matching algorithm
					console.log(newImageId);
					showThanks();
				});
		}

		function doPreview() {
			stage3.style.display = 'block';
			stage2.style.display = 'none';
		}

		function checkKeyPressed(e) {
			// console.log(e.keyCode);
			if (e.keyCode === triggerLetter) {
				takeSelfie();
			}
		}

		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.enumerateDevices()
				.then(gotDevices)
				.then(getStream)
				.catch(handleError);

			window.addEventListener('keydown', checkKeyPressed, false);
			takeBut.addEventListener('click', takeSelfie);
			useBut.addEventListener('click', doPreview);
			submitBut.addEventListener('click', uploadSelfie);
			retakeBut.addEventListener('click', retakeSelfie);
			quitBut.addEventListener('click', quitFromForm);
		} else {
			console.log("This browser doesn't support a camera");
		}
	}

	constructor(props) {
		super(props);
		this.state = {
			interests: '',
			email: '',
			name: '',
			formErrors: {interests: '', email: ''},
			interestsValid: false,
			emailValid: true,
			formValid: false
		};
		this.handleUserInput = this.handleUserInput.bind(this);
	}

	handleUserInput(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({[name]: value}, 
									() => { this.validateField(name, value) });
	}

validateField(fieldName, value) {
  let fieldValidationErrors = this.state.formErrors;
  let interestsValid = this.state.interestsValid;
  let emailValid = this.state.emailValid;

  switch(fieldName) {
    case 'email':
    	if (value.length > 0) {
				emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    	} else {
    		// no email is a valid email
    		emailValid = true;
    	}
      fieldValidationErrors.email = emailValid ? '' : 'Please enter a valid email.';
      break;
    case 'interests':
    	let t = value.split(','); // separate interests by comma
    	t = t.filter(entry => entry.trim() != ''); // rdon't count blank ones
    	t = t.filter(entry => entry.trim().length >= 4); // make sure they aren't too short
      interestsValid = t.length > 2; // and make sure we have at least 3
      fieldValidationErrors.interests = interestsValid ? '': 'Could you enter a bit more info about your interests? Ideally 4 or 5, separated by commas.';
      break;
    default:
      break;
  }
	this.setState({
		formErrors: fieldValidationErrors,
		emailValid: emailValid,
		interestsValid: interestsValid
		}, this.validateForm);
}

validateForm() {
  this.setState({formValid: this.state.emailValid && this.state.interestsValid});
}

	render() {
		return (
			<ExampleApp>
				<h1 id="title">Take a selfie</h1>
				<div id="stage1">
					<video id="video" width="1080" height="1080" autoPlay />
					<br />
					<button id="snap">take selfie</button>
				</div>
				<div id="stage2">
					<canvas id="canvas" width="1080" height="1080" />
					<br />
					<button id="retake">re-take</button>
					<button id="sendSelfie">use this</button>
				</div>
				<div id="stage3">
					<canvas id="preview" width="300" height="300" />
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
								<div className='formErrors interests'>{this.state.formErrors.interests}</div>
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
								<span className='formErrors email'>{this.state.formErrors.email}</span>
							</li>
							<li>
								<button id="submitBut" disabled={!this.state.formValid}>submit</button>
								<button id="quitBut">quit</button>
							</li>
						</ul>
					</div>
				</div>
				<div id="stage4">
					<p>Thank you</p>
				</div>
			</ExampleApp>
		);
	}
}

export default Home;
