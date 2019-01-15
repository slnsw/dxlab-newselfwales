import { Component } from 'react';
import PropTypes from 'prop-types';

import './SearchFilters.css';

class SearchFilters extends Component {
	static propTypes = {
		className: PropTypes.string,
		filters: PropTypes.array,
		value: PropTypes.string,
		onClick: PropTypes.func,
	};

	static defaultProps = {
		filters: [],
	};

	handleClick = (event, filter) => {
		if (typeof this.props.onClick === 'function') {
			this.props.onClick(event, filter);
		}
	};

	render() {
		const { className, filters, value } = this.props;

		return (
			<div className={['search-filters', className || ''].join(' ')}>
				<ul>
					{filters.map((filter) => {
						return (
							<li
								className={
									filter.value === value
										? 'search-filters__filter--is-selected'
										: ''
								}
								key={filter.value}
							>
								<button
									className="search-filters__filter-button"
									onClick={(event) => this.handleClick(event, filter)}
								>
									{filter.name}
								</button>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

export default SearchFilters;
