import { Component } from 'react';
import PropTypes from 'prop-types';

import Link from '../Link';
import './SearchSuggestions.css';

class SearchSuggestions extends Component {
	static propTypes = {
		className: PropTypes.string,
		limit: PropTypes.number,
		suggestions: PropTypes.array,
	};

	static defaultProps = {
		suggestions: [],
		limit: 0,
	};

	knuthShuffle = (array) => {
		// This does an in-place shuffle of an array and is order O(n)
		// Also known as the Fisher-Yates shuffle.
		let currentIndex = array.length;
		// copy input array to a variable to stop ESlint having a cry when we change it
		const out = array;
		let temporaryValue;
		let randomIndex;
		// While there remain elements to shuffle...
		while (currentIndex !== 0) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			// And swap it with the current element.
			temporaryValue = out[currentIndex];
			out[currentIndex] = out[randomIndex];
			out[randomIndex] = temporaryValue;
		}
		return out;
	};

	render() {
		const { className, limit, suggestions } = this.props;
		let selection = [];
		if (limit > 0 && limit <= suggestions.length) {
			selection = this.knuthShuffle(suggestions).slice(0, limit);
		}
		return (
			<div className={['search-suggestions', className || ''].join(' ')}>
				<h2>Suggestions</h2>

				<ul>
					{selection.map((item) => {
						return (
							<li>
								<Link to={item.url}>
									<a>{item.name}</a>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

export default SearchSuggestions;
