import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';

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
			<CSSTransition
				in={isActive}
				classNames="modal__overlay-"
				timeout={300}
				appear={true}
				unmountOnExit={true}
			>
				{(state) => {
					console.log(state);

					return (
						<Fragment>
							<div
								className={`modal__overlay modal__overlay--${state}`}
								onClick={this.handleClose}
							/>

							<div className={`modal modal--${state} ${className}`}>
								<button
									onClick={this.handleClose}
									className="modal__close-button"
								>
									<i className="ion-md-close" />
								</button>
								{this.props.children}
							</div>
						</Fragment>
					);
				}}
			</CSSTransition>
		);
	}
}

export default Modal;
