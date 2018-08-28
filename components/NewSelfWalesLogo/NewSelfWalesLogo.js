import { Component } from 'react';
import PropTypes from 'prop-types';
import Vivus from 'vivus';

import './NewSelfWalesLogo.css';

class NewSelfWalesLogo extends Component {
	static propTypes = {
		className: PropTypes.string,
	};

	static defaultProps = {
		className: '',
	};

	state = {
		isActive: false,
	};

	componentDidMount() {
		/* eslint-disable no-unused-vars */
		const logoAnimation = new Vivus('newselfwales-logo', {}, (item) => {
			item.play(item.getStatus() === 'end' ? -1 : 1);
		});

		this.setState({
			isActive: true,
		});
	}

	render() {
		const { className } = this.props;
		const { isActive } = this.state;

		return (
			<object
				className={[
					'new-self-wales-logo',
					isActive ? 'new-self-wales-logo--is-active' : '',
					className,
				].join(' ')}
				id="newselfwales-logo"
				type="image/svg+xml"
				data="/static/newselfwales/NewSelfWales-Logo-01.svg"
				aria-label="#NewSelfWales logo"
			/>
		);
	}
}

export default NewSelfWalesLogo;
