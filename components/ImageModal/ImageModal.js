import { Component } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import './ImageModal.css';
import Modal from '../Modal';
import { SCREEN_SM } from '../../styles/variables';

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
		date: PropTypes.string,
		instagramUsername: PropTypes.string,
		flNumber: PropTypes.string,
	};

	state = {
		screenWidth: null,
		screenHeight: null,
	};

	componentDidMount() {
		// TODO: Update on resize
		this.setState({
			// screenWidth: window.innerWidth,
			// screenHeight: window.innerHeight,
			screenWidth: document.documentElement.clientWidth,
			screenHeight: document.documentElement.clientHeight,
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
			date,
			instagramUsername,
			flNumber,
			// loading,
		} = this.props;

		const { screenWidth } = this.state;

		// if (isActive !== true) {
		// 	return null;
		// }

		const timeout = 500;

		let dateString;

		if (date) {
			const d = new Date(date);
			dateString = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
		}

		console.log('ImageModal', isActive);

		return (
			<Transition
				in={isActive}
				timeout={timeout}
				appear={true}
				// unmountOnExit={true}
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
							// top: screenHeight / 2,
							// left: screenWidth / 2,
							top: '50%',
							left: '50%',
							height: screenWidth > SCREEN_SM ? '80%' : 'calc(100% - 2em)',
							width: screenWidth > SCREEN_SM ? '80%' : 'calc(100% - 0.91em)',
						},
					};

					console.log(screenWidth);

					return (
						<Modal
							className={`image-modal image-modal--${state}`}
							isActive={isActive}
							onClose={this.handleClose}
							style={{
								...defaultStyle,
								...(screenWidth && (state === 'entering' || state === 'entered')
									? transitionStyles.entering
									: {}),
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
								<div className="image-modal__type">
									{imageType && imageType.replace('-', ' ')}
								</div>

								<h1
									className="image-modal__title"
									dangerouslySetInnerHTML={{ __html: title }}
								/>
								<div
									className="image-modal__content"
									dangerouslySetInnerHTML={{ __html: content }}
								/>

								<footer className="image-modal__footer">
									{instagramUsername && (
										<a
											className="image-modal__instagram-username"
											href={`https://www.instagram.com/${instagramUsername}`}
										>
											@{instagramUsername}
										</a>
									)}

									{dateString && (
										<div className="image-modal__date">{dateString}</div>
									)}

									{flNumber && (
										<a
											className="image-modal__collection-link button button--small"
											href={`http://digital.sl.nsw.gov.au/delivery/DeliveryManagerServlet?embedded=true&toolbar=false&dps_pid=${flNumber.toUpperCase()}`}
										>
											Collection Image
										</a>
									)}
								</footer>
							</div>
						</Modal>
					);
				}}
			</Transition>
		);
	}
}

export default ImageModal;
