import { Component } from 'react';
import PropTypes from 'prop-types';
// import { CSSTransition, Transition } from 'react-transition-group';

import './ImageModal.css';
import Modal from '../Modal';

class ImageModal extends Component {
	static propTypes = {
		title: PropTypes.string,
		primoId: PropTypes.string,
		imageUrl: PropTypes.string,
		content: PropTypes.string,
		onClose: PropTypes.func,
		isActive: PropTypes.bool,
		loading: PropTypes.bool,
	};

	handleClose = () => {
		this.props.onClose();
	};

	render() {
		const { title, primoId, imageUrl, content, isActive, loading } = this.props;

		// if (isActive !== true) {
		// 	return null;
		// }

		return (
			// <Transition in={isActive} timeout={300} unmountOnExit={true}>
			// 	{(state) => {
			// 		if (loading) {
			// 			return null;
			// 		}

			// return (
			<Modal
				className={`image-modal`}
				isActive={isActive}
				onClose={this.handleClose}
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
					{primoId && <div className="image-modal__primo-id">{primoId}</div>}
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
			// 		);
			// 	}}
			// </Transition>
		);
	}
}

export default ImageModal;
