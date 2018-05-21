import { Component } from 'react';
import Packery from '../components/Packery';

import App from '../components/App';
import InfoBox from '../components/InfoBox';
import Modal from '../components/Modal';
import images from '../lib/imagesNew.json';
// import selfiesRaw from '../lib/selfieSelected.json';
import shuffle from '../lib/shuffle';
import scroll from '../lib/scroll';

import './index.css';

class Home extends Component {
	constructor() {
		super();

		// const selfies = Object.keys(selfiesRaw).map((s) => {
		// 	return {
		// 		isSelfie: true,
		// 		url: selfiesRaw[s].filename,
		// 	};
		// });

		// this.allImages = shuffle(images.concat(selfies));
		let allImages = shuffle(images).concat(shuffle(images));
		allImages.splice(1, 0, {
			isPerson: true,
			url: 'silhouettes/39331-silhouette.png',
		});
		allImages.splice(14, 0, {
			isPerson: true,
			url: 'silhouettes/39331-silhouette.png',
		});
		allImages.splice(25, 0, {
			isPerson: true,
			url: 'silhouettes/39331-silhouette.png',
		});

		// console.log(allImages);

		this.state = {
			allImages: allImages,
			axis: 'x',
			showModal: true,
		};
	}

	componentDidMount() {
		if (window.location.search) {
			this.setState({
				axis: window.location.search.replace('?axis=', ''),
			});
		}
	}

	handleModalClose = () => {
		this.setState({
			showModal: false,
		});
	};

	render() {
		const { allImages, showModal } = this.state;

		return (
			<App>
				<div
					style={{
						// width: this.state.axis === 'x' ? '1000px' : 'auto',
						// height: '100vh',
						overflow: 'hidden',
					}}
				>
					<Packery
						className="images"
						style={{
							height: '100vh',
							// transition: 'all 4s',
						}}
						options={{
							itemSelector: '.image-holder',
							gutter: 10,
							horizontalOrder: true,
							fitWidth: true,
							transitionDuration: '1s',
							// stagger: 30,
							// rowHeight: 60,
							isHorizontal: true,
						}}
						onLayoutComplete={(laidOutItems) => {
							console.log('onLayoutComplete');
							scroll(laidOutItems, this.state.axis);
						}}
					>
						{allImages.map((image, i) => {
							const imageSize = setSize(i);

							return (
								<div
									className={`image-holder ${
										image.isPerson ? 'image-holder--is-person' : ''
									}
                  ${imageSize === '250px' ? 'image-holder--medium' : ''}`}
									key={`image-${i}`}
								>
									{image.isPerson && (
										<div className="image-holder__content">
											<span>?</span>
											{imageSize === '250px' && <p>This could be you!</p>}
										</div>
									)}

									<img
										className={`image ${
											image.isPerson ? 'image--is-person' : ''
										}`}
										src={`/static/${image.isSelfie ? 'selfies' : 'images'}/${
											image.url
										}`}
										style={{
											height: imageSize,
											// maxWidth: '300px',
											// marginBottom: '-4px',
										}}
										key={`${image.url}-${i}`}
										alt="test"
									/>
								</div>
							);
						})}
					</Packery>
					<InfoBox />
				</div>

				{showModal && (
					<Modal onClose={this.handleModalClose}>
						<h1>SPECIAL CARE NOTICE</h1>

						<p>
							This website may contain images or documentation relating to
							Aboriginal and Torres Strait Islander people who are deceased. The
							State Library of NSW acknowledges that its historical collection
							items can be offensive and confronting in today’s context. They
							are published with respect to the descendants and communities of
							the individuals they depict.
						</p>
					</Modal>
				)}
			</App>
		);
	}
}

function setSize(i) {
	if (i % 6 === 1) {
		return '250px';
	} else if (i % 10 === 1) {
		return '380px';
		// return '610px';
	}

	return '120px';
}

export default Home;
