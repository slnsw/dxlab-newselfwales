import { Component } from 'react';

import WPAPI from 'wpapi';
import ExampleApp from '../components/examples/ExampleApp';

import './photobooth.css';

class Home extends Component {
	componentDidMount() {
		//		const WPAPI = require('wpapi');
		const wp = new WPAPI({
			endpoint: 'https://local.dxlab.sl.nsw.gov.au/selfie/wp-json',
			username: 'upload',
			password: 'djYU05v5gy0T',
		});

		const camName = 'HD Pro Webcam C920';
		const triggerLetter = 76;
		const takeBut = document.getElementById('snap');
		const retakeBut = document.getElementById('retake');
		const useBut = document.getElementById('sendSelfie');
		const submitBut = document.getElementById('submitBut');
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
			wp
				.media()
				.file(blob, 'selfie.png')
				.create({
					title: 'test selfie',
					alt_text: 'test selfie',
					caption: 'test selfie',
					description: 'test selfie',
				})
				.then(function(response) {
					const newImageId = response.id; // will need to send this to the matching algorithm
					showThanks();
				});
		}

		function doPreview() {
			stage3.style.display = 'block';
			stage2.style.display = 'none';
		}

		function checkKeyPressed(e) {
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
		} else {
			console.log("This browser doesn't support a camera");
		}
	}

constructor(props) {
    super(props);
    this.state = {
      interests: '',
      email: '',
      name: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
/*
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

    handleChange(event) {
 */

    this.setState({value: event.target.value});
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
						<li></li>
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
									placeholder="Up to 5, separated by commas"
									onChange={this.handleInputChange}
								/>
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
									onChange={this.handleInputChange}
								/>
							</li>
							<li>
								<label>
									Your email:<br />
								</label>
								<input
									type="text"
									name="email"
									id="email"
									value={this.state.email}
									placeholder="fiend@selfie-land.com"
									onChange={this.handleInputChange}
								/>
							</li>
							<li>
								<button id="submitBut">submit</button>
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
