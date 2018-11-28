import { Component } from 'react';
import PropTypes from 'prop-types';

import './SearchBox.css';

class SearchBox extends Component {
	static propTypes = {
		className: PropTypes.string,
		isActive: PropTypes.bool,
		onSearchIconClick: PropTypes.func,
		onBackClick: PropTypes.func,
		onSubmit: PropTypes.func,
	};

	state = {
		value: '',
	};

	handleSearchIconClick = () => {
		if (typeof this.props.onSearchIconClick === 'function') {
			this.props.onSearchIconClick();
		}
	};

	handleBackClick = () => {
		if (typeof this.props.onBackClick === 'function') {
			this.props.onBackClick();
		}
	};

	handleFormSubmit = (event) => {
		event.preventDefault();

		if (typeof this.props.onSubmit === 'function') {
			this.props.onSubmit(this.state.value);
		}
	};

	handleChange = (event) => {
		this.setState({
			value: event.target.value,
		});
	};

	render() {
		const { className, value, isActive } = this.props;

		return (
			<div
				className={[
					'search-box',
					className || '',
					isActive ? 'search-box--is-active' : '',
				].join(' ')}
			>
				{isActive && (
					<button
						className="ion ion-ios-arrow-back icon"
						onClick={this.handleBackClick}
					/>
				)}

				<div className="search-box__form">
					<form onSubmit={this.handleFormSubmit}>
						{isActive && (
							<input
								type="text"
								value={value}
								className="search-box__input"
								autoFocus
								onChange={this.handleChange}
							/>
						)}

						<button
							className="search-box__search-icon ion ion-ios-search icon"
							onClick={this.handleSearchIconClick}
						>
							{/* <i className="ion ion-ios-search icon" /> */}
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default SearchBox;
