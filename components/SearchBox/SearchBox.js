import { Component } from 'react';
import PropTypes from 'prop-types';

import './SearchBox.css';

class SearchBox extends Component {
	static propTypes = {
		defaultValue: PropTypes.string,
		className: PropTypes.string,
		isActive: PropTypes.bool,
		onFocus: PropTypes.func,
		onBackClick: PropTypes.func,
		onSubmit: PropTypes.func,
	};

	state = {
		value: '',
		isChanged: false,
	};

	componentDidUpdate(prevProps) {
		if (prevProps.isActive !== this.props.isActive) {
			this.setState({
				value: '',
			});
		}
	}

	handleFocus = () => {
		if (typeof this.props.onFocus === 'function') {
			this.props.onFocus();
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
		if (this.state.isChanged === false) {
			this.setState({
				isChanged: true,
			});
		}

		this.setState({
			value: event.target.value,
		});
	};

	render() {
		const { className, isActive, defaultValue } = this.props;
		const { value, isChanged } = this.state;

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

				{/* {!isActive && (
					<button
						onClick={this.handleSearchIconClick}
						className="search-box__search-text-holder"
					>
						<i className="search-box__search-icon ion ion-ios-search icon" />
						<span className="search-box__search-text">Search</span>
					</button>
				)} */}

				<div className="search-box__form">
					{/* {isActive && ( */}
					<form onSubmit={this.handleFormSubmit} onFocus={this.handleFocus}>
						<input
							type="text"
							value={isChanged === false ? defaultValue : value}
							className="search-box__input"
							// autoFocus
							placeholder="Search"
							onChange={this.handleChange}
						/>
						<button className="search-box__search-icon ion ion-ios-search icon" />
					</form>
					{/* )} */}
				</div>
			</div>
		);
	}
}

export default SearchBox;
