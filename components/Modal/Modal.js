import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, Transition } from 'react-transition-group';

import './Modal.css';

class Modal extends Component {
	static propTypes = {
		className: PropTypes.string,
		isActive: PropTypes.bool,
		onClose: PropTypes.func,
	};

	static defaultProps = {
		isActive: false,
	};

	handleClose = () => {
		this.props.onClose();
	};

	render() {
		const { className = '', isActive } = this.props;

		return (
			<Transition in={isActive} timeout={300} unmountOnExit={true}>
				{(state) => {
					return (
						<Fragment>
							<div className={`modal modal--${state} ${className}`}>
								<button
									onClick={this.handleClose}
									className="modal__close-button"
								>
									<i className="ion-md-close" />
								</button>
								{this.props.children}
							</div>

							<div
								className={`modal__overlay modal__overlay--${state}`}
								onClick={this.handleClose}
							/>
						</Fragment>
					);
				}}
			</Transition>
		);
	}
}

export default Modal;
