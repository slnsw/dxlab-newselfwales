import { Component } from 'react';
import PropTypes from 'prop-types';

import './SearchBox.css';

class SearchBox extends Component {
	static propTypes = {
		defaultValue: PropTypes.string,
		className: PropTypes.string,
		isActive: PropTypes.bool,
		onSearchIconClick: PropTypes.func,
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

				<div className="search-box__form">
					{!isActive && (
						<button
							className="search-box__search-icon ion ion-ios-search icon"
							onClick={this.handleSearchIconClick}
						/>
					)}

					{isActive && (
						<form onSubmit={this.handleFormSubmit}>
							<input
								type="text"
								value={isChanged === false ? defaultValue : value}
								className="search-box__input"
								autoFocus
								placeholder="Search here"
								onChange={this.handleChange}
							/>
							<button className="search-box__search-icon ion ion-ios-search icon" />
						</form>
					)}
				</div>
			</div>
		);
	}
}

export default SearchBox;
