import { Component } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import './LoaderText.css';

class LoaderText extends Component {
	static propTypes = {
		className: PropTypes.string,
		text: PropTypes.string,
		isActive: PropTypes.bool,
	};

	static defaultProps = {
		text: 'Loading',
		isActive: true,
	};

	render() {
		const { className, text, isActive } = this.props;

		return (
			<Transition in={isActive} timeout={500} unmountOnExit={true}>
				{(state) => {
					// console.log(state);

					return (
						<div
							className={[
								'loader-text',
								`loader-text--${state}`,
								className || '',
							].join(' ')}
						>
							{text} <span>.</span>
							<span>.</span>
							<span>.</span>
						</div>
					);
				}}
			</Transition>
		);
	}
}

export default LoaderText;
