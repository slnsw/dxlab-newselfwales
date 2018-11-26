import { Component } from 'react';
import PropTypes from 'prop-types';

import './SearchBox.css';

class SearchBox extends Component {
	static propTypes = {
		className: PropTypes.string,
		isActive: PropTypes.bool,
		onSearchIconClick: PropTypes.func,
		onBackClick: PropTypes.func,
	};

	handleSearchIconClick = () => {
		console.log('hi 2');

		if (typeof this.props.onSearchIconClick === 'function') {
			this.props.onSearchIconClick();
		}
	};

	handleBackClick = () => {
		if (typeof this.props.onBackClick === 'function') {
			this.props.onBackClick();
		}
	};

	render() {
		const { className, isActive } = this.props;

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
					{isActive && (
						<input type="text" className="search-box__input" autoFocus />
					)}

					<button
						className="search-box__search-icon"
						onClick={this.handleSearchIconClick}
					>
						<i className="ion ion-ios-search icon" />
					</button>
				</div>
			</div>
		);
	}
}

export default SearchBox;
