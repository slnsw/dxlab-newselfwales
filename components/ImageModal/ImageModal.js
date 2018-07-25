import { Component } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import './ImageModal.css';
import Modal from '../Modal';

class ImageModal extends Component {
	static propTypes = {
		title: PropTypes.string,
		primoId: PropTypes.string,
		imageUrl: PropTypes.string,
		content: PropTypes.string,
		imageType: PropTypes.string,
		sourceImageBoundingClientRect: PropTypes.object,
		onClose: PropTypes.func,
		isActive: PropTypes.bool,
		loading: PropTypes.bool,
	};

	state = {
		screenWidth: null,
		screenHeight: null,
	};

	componentDidMount() {
		this.setState({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
		});
	}

	handleClose = () => {
		this.props.onClose();
	};

	render() {
		const {
			title,
			// primoId,
			imageUrl,
			content,
			imageType,
			sourceImageBoundingClientRect,
			isActive,
			loading,
		} = this.props;

		const { screenWidth, screenHeight } = this.state;

		// if (isActive !== true) {
		// 	return null;
		// }

		const timeout = 500;

		return (
			<Transition
				in={isActive}
				timeout={timeout}
				appear={true}
				unmountOnExit={true}
			>
				{(state) => {
					// if (loading) {
					// 	return null;
					// }

					const defaultStyle = {
						transition: `all ${timeout}ms cubic-bezier(0.86, 0, 0.07, 1)`,
						opacity: 1,
						top:
							sourceImageBoundingClientRect &&
							sourceImageBoundingClientRect.y +
								sourceImageBoundingClientRect.height / 2,
						left:
							sourceImageBoundingClientRect &&
							sourceImageBoundingClientRect.x +
								sourceImageBoundingClientRect.width / 2,
						width:
							sourceImageBoundingClientRect &&
							sourceImageBoundingClientRect.width,
						height:
							sourceImageBoundingClientRect &&
							sourceImageBoundingClientRect.height,
					};

					const transitionStyles = {
						entering: {
							opacity: 1,
							top: screenHeight / 2,
							left: screenWidth / 2,
							height: '50%',
							width: '50%',
						},
						entered: {
							opacity: 1,
							top: screenHeight / 2,
							left: screenWidth / 2,
							height: '50%',
							width: '50%',
						},
					};

					return (
						<Modal
							className={`image-modal image-modal--${state}`}
							isActive={isActive}
							onClose={this.handleClose}
							style={{
								...defaultStyle,
								...transitionStyles[state],
							}}
						>
							<div className="image-modal__image-holder">
								<div
									className="image-modal__image"
									style={{
										backgroundImage: `url(${imageUrl}`,
									}}
								>
									{/* <img
										className="image-modal__image"
										src={imageUrl}
										alt={title}
										width="100%"
										height="auto"
									/> */}
								</div>
							</div>

							<div className="image-modal__info">
								<div className="image-modal__type">{imageType}</div>

								<h1
									className="image-modal__title"
									dangerouslySetInnerHTML={{ __html: title }}
								/>
								<div
									className="image-modal__content"
									dangerouslySetInnerHTML={{ __html: content }}
								/>
							</div>
						</Modal>
					);
				}}
			</Transition>
		);
	}
}

export default ImageModal;
