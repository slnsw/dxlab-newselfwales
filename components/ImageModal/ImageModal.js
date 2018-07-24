import { Component } from 'react';
import PropTypes from 'prop-types';

import './ImageModal.css';
import Modal from '../Modal';

class ImageModal extends Component {
	static propTypes = {
		title: PropTypes.string,
		loading: PropTypes.bool,
		onClose: PropTypes.func,
	};

	handleClose = () => {
		this.props.onClose();
	};

	render() {
		const { title, loading } = this.props;

		if (loading) {
			return null;
		}

		return (
			<Modal onClose={this.handleClose}>
				<div className="image-modal">
					<h1>{title}</h1>
				</div>
			</Modal>
		);
	}
}

export default ImageModal;
