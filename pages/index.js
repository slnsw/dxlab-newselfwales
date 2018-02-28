import { Component } from 'react';
// import Masonry from 'react-masonry-component';
import Packery from '../components/Packery';
// import Packery from 'react-packery-component';

import ExampleApp from '../components/examples/ExampleApp';
import images from '../lib/images.json';
import selfiesRaw from '../lib/selfieSelected.json';
import shuffle from '../lib/shuffle';

import './index.css';

class Home extends Component {
	constructor() {
		super();

		const selfies = Object.keys(selfiesRaw).map((s) => {
			return {
				isSelfie: true,
				url: selfiesRaw[s].filename,
			};
		});

		this.allImages = shuffle(images.concat(selfies));

		this.state = {
			// allImages: this.allImages.slice(0, 50),
			allImages: this.allImages,
		};
	}

	componentDidMount() {
		// const timeout = setInterval(() => {
		// 	this.addNewImage();
		// }, 5000);
	}

	addNewImage = () => {
		const randomNumber = Math.floor(Math.random() * this.allImages.length);

		const randomImage = this.allImages[randomNumber];

		this.setState({
			allImages: [randomImage, ...this.state.allImages],
		});
	};

	render() {
		const { allImages } = this.state;

		return (
			<ExampleApp>
				<div style={{ height: '900px', width: '30000px' }}>
					<Packery
						options={{
							gutter: 10,
							horizontalOrder: true,
							fitWidth: true,
							// stagger: 30,
							// rowHeight: 60,
							// isHorizontal: true,
						}}
					>
						{allImages.slice(0, 500).map((image, i) => {
							return (
								<div className="image">
									<img
										src={`/static/${image.isSelfie ? 'selfies' : 'images'}/${
											image.url
										}`}
										style={{
											height: i % 7 === 1 ? '601px' : '300px',
											// maxWidth: '300px',
											marginBottom: '-4px',
										}}
										key={image.url}
										alt="test"
									/>
								</div>
							);
						})}
					</Packery>
				</div>
			</ExampleApp>
		);
	}
}

export default Home;
