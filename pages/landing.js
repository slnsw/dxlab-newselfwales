import { Component } from 'react';
import Packery from '../components/Packery';

import App from '../components/App';
import InfoBox from '../components/InfoBox';
import Modal from '../components/Modal';
import images from '../lib/imagesNew.json';
import shuffle from '../lib/shuffle';
import { scroller } from '../lib/scroll';

import './index.css';

class Home extends Component {
	constructor() {
		super();

		// Build images for wall
		const allImages = shuffle(images).concat(shuffle(images));
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
		allImages.splice(35, 0, {
			isPerson: true,
			url: 'silhouettes/39331-silhouette.png',
		});

		// console.log(allImages);

		this.state = {
			allImages,
			axis: 'x',
			showModal: true,
			enableAnimation: false,
			laidOutItems: undefined,
		};
	}

	componentDidMount() {
		if (window.location.search) {
			this.setState({
				axis: window.location.search.replace('?axis=', ''),
			});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.laidOutItems === undefined && this.state.laidOutItems) {
			// Init scroller
			scroller.init(
				this.imagesRef.refs.packeryContainer,
				this.state.laidOutItems,
				'x',
			);
		}

		if (!prevState.enableAnimation && this.state.enableAnimation) {
			// Start scroll
			scroller.start();
		} else if (prevState.enableAnimation && !this.state.enableAnimation) {
			// Stop scroll
			scroller.stop();
		}
	}

	handleModalClose = () => {
		this.setState({
			showModal: false,
			enableAnimation: true,
		});
	};

	handleToggleAnimationButton = () => {
		this.setState({
			enableAnimation: !this.state.enableAnimation,
		});
	};

	render() {
		const { allImages, showModal, enableAnimation } = this.state;

		return (
			<App>
				<button
					className="button landing__toggle-animation-button"
					onClick={this.handleToggleAnimationButton}
				>
					{enableAnimation ? 'Pause' : 'Play'}
				</button>

				<div
					style={{
						overflow: 'hidden',
					}}
				>
					<Packery
						className="images"
						ref={(element) => {
							this.imagesRef = element;
						}}
						style={{
							marginTop: '5px',
							height: 'calc(100vh - 10px)',
						}}
						options={{
							itemSelector: '.image-holder',
							gutter: 0,
							horizontalOrder: true,
							fitWidth: true,
							transitionDuration: '1s',
							stagger: 100,
							isHorizontal: true,
						}}
						onLayoutComplete={(laidOutItems) => {
							if (!this.state.laidOutItems) {
								this.setState({
									laidOutItems,
								});
							}
							// if (enableAnimation) {
							// 	scroll(laidOutItems, this.state.axis);
							// }
						}}
					>
						{allImages.map((image, i) => {
							const imageSize = setSize(i);

							return (
								<div
									className={`image-holder ${
										image.isPerson ? 'image-holder--is-person' : ''
									}
									image-holder--${imageSize}`}
									key={`image-${i}`}
								>
									{image.isPerson && (
										<div className="image-holder__content">
											<span>?</span>
											<p>This could be you!</p>
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
											// height: imageSize,
											marginBottom: '-4px',
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
		return 'lg';
	} else if (i % 10 === 1) {
		return 'xlg';
	}

	return 'md';
}

export default Home;
