import { Component } from 'react';

import ExampleApp from '../components/examples/ExampleApp';
import webcam from '../lib/webcam';

import './photobooth.css';

class Home extends Component {
	componentDidMount() {
		this.webcam = webcam(window); 
		this.webcam.init();
	}

	render() {
		return (
			<ExampleApp>
				<h1 id="title">Take a selfie</h1>
				<div id="my_photo_booth">
					<div id="my_camera" />
					<form>
						<div id="pre_take_buttons">
							<input id="takeButton" type="button" value="Take Snapshot" />
						</div>
						<div id="post_take_buttons" style={{ display: 'none' }}>
							<input
								type="button"
								id="retakeButton"
								value="&lt; Take Another"
							/>
							<input
								type="button"
								id="saveButton"
								value="Save Photo &gt;"
								style={{ fontWeight: 'bold' }}
							/>
						</div>
					</form>
				</div>
				<div id="results" style={{ display: 'none' }} />
				<br />
				<div
					id="post_take_buttons2"
					style={{ display: 'none', marginTop: '1em' }}
				>
					<input
						type="button"
						id="resetButton"
						value="Begin again"
						onClick={goHome}
					/>
				</div>
			</ExampleApp>
		);
	}
}

function goHome() {
	window.location = './';
}

export default Home;
