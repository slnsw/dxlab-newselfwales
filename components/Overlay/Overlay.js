import { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import './Overlay.css';

class Overlay extends Component {
	static propTypes = {
		isActive: PropTypes.bool,
		className: PropTypes.string,
		onClick: PropTypes.func,
	};

	handleClick = () => {
		if (typeof this.props.onClick === 'function') {
			this.props.onClick();
		}
	};

	render() {
		const { isActive, className } = this.props;

		// console.log(isActive);

		return (
			<CSSTransition
				in={isActive}
				appear={true}
				timeout={300}
				classNames="overlay-"
				unmountOnExit={true}
			>
				{() => (
					<div
						className={['overlay', className || ''].join(' ')}
						onClick={this.handleClick}
					/>
				)}
			</CSSTransition>
		);
	}
}

export default Overlay;
