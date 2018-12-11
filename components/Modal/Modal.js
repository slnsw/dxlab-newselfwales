import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';

import './Modal.css';

class Modal extends Component {
	static propTypes = {
		className: PropTypes.string,
		style: PropTypes.object,
		isActive: PropTypes.bool,
		onClose: PropTypes.func,
	};

	static defaultProps = {
		className: '',
		style: null,
		isActive: false,
	};

	handleClose = () => {
		if (typeof this.props.onClose === 'function') {
			this.props.onClose();
		}
	};

	render() {
		const { className, style, isActive } = this.props;

		return (
			<CSSTransition
				in={isActive}
				classNames="modal__overlay-"
				timeout={300}
				appear={true}
				unmountOnExit={true}
			>
				{(state) => {
					// console.log(state);

					return (
						<Fragment>
							<div
								className={`modal__overlay modal__overlay--${state}`}
								onClick={this.handleClose}
							/>

							<div
								className={`modal modal--${state} ${className}`}
								style={style}
							>
								<button
									onClick={this.handleClose}
									className="modal__close-button"
								>
									<i className="ion-md-close" />
								</button>

								<div className="modal__inside">{this.props.children}</div>
							</div>
						</Fragment>
					);
				}}
			</CSSTransition>
		);
	}
}

export default Modal;
