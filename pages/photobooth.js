import { Component } from 'react';

import ExampleApp from '../components/examples/ExampleApp';
import Webcam from 'react-webcam';

import './photobooth.css';

class Home extends Component {
	setRef = (webcam) => {
		this.webcam = webcam;
	};

	constructor(props) {
		super(props);
		this.state = {
			screenshot: null,
			tab: 0,
		};
	}
	handleClick = () => {
		const screenshot = this.webcam.getScreenshot();
		this.setState({ screenshot });
	};

	capture = () => {
		const screenshot = this.webcam.getScreenshot();
		this.setState({ screenshot });
	};

	componentDidMount() {
		//		this.webcam = webcam(window);
		//		this.webcam.init();
	}

	render() {
		return (
			<ExampleApp>
				<h1 id="title">Take a selfie</h1>
				<div>
					<Webcam
						audio={false}
						height={350}
						ref={this.setRef}
						screenshotFormat="image/jpeg"
						width={350}
					/>
					<input
						type="button"
						id="takeButton"
						value="take selfie"
						onClick={this.capture}
					/>
					{this.state.screenshot ? <img src={this.state.screenshot} /> : null}
				</div>
			</ExampleApp>
		);
	}
}

function goHome() {
	window.location = './';
}

export default Home;
