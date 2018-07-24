import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import './Modal.css';

class Modal extends Component {
	static propTypes = {
		className: PropTypes.string,
		onClose: PropTypes.func,
	};

	handleClose = () => {
		this.props.onClose();
	};

	render() {
		const { className = '' } = this.props;

		return (
			<Fragment>
				<div className={`modal ${className}`}>
					<button onClick={this.handleClose} className="modal__close-button">
						<i className="ion-md-close" />
					</button>
					{this.props.children}
				</div>

				<div className="modal__overlay" onClick={this.handleClose} />
			</Fragment>
		);
	}
}

export default Modal;
