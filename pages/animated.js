import { Component } from 'react';
// import Masonry from 'react-masonry-component';
import Packery from 'react-packery-component';

import ExampleApp from '../components/examples/ExampleApp';
import images from '../lib/images.json';
import selfiesRaw from '../lib/selfieSelected.json';
import shuffle from '../lib/shuffle';

import './index.css';

class Home extends Component {
	render() {
		const selfies = Object.keys(selfiesRaw).map((s) => {
			return {
				isSelfie: true,
				url: selfiesRaw[s].filename,
			};
		});

		const allImages = shuffle(images.concat(selfies));

		return (
			<ExampleApp>
				<div style={{ height: '600px', width: '20000px' }}>
					<Packery
						// style={{ height: '500px' }}
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
											height: i % 7 === 1 ? '300px' : '300px',
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
