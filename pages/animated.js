import { Component } from 'react';
// import Masonry from 'react-masonry-component';
// import Packery from 'react-packery-component';
import Packery from '../components/Packery';

import ExampleApp from '../components/examples/ExampleApp';
import images from '../lib/images.json';
import selfiesRaw from '../lib/selfieSelected.json';
import shuffle from '../lib/shuffle';
// import scroll from '../lib/scroll';

// import './index.css';

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
			allImages: this.allImages.slice(0, 100),
		};
	}

	componentDidMount() {
		setInterval(() => {
			this.addNewImage();
		}, 8000);
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
				<div style={{ height: '2000px', width: '2000px' }}>
					<Packery
						// style={{ height: '500px' }}
						options={{
							gutter: 10,
							horizontalOrder: true,
							fitWidth: true,
							transitionDuration: '1s',
							// stagger: 30,
							// rowHeight: 60,
							// isHorizontal: true,
						}}
					>
						{allImages.slice(0, 500).map((image, i) => {
							return (
								<div className="image" key={`image-${i}`}>
									<img
										src={`/static/${image.isSelfie ? 'selfies' : 'images'}/${
											image.url
										}`}
										style={{
											height: setSize(i),
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

function setSize(i) {
	if (i % 12 === 1) {
		return '210px';
	} else if (i % 30 === 2) {
		return '610px';
	}

	return '100px';
}

export default Home;
