import { Component } from 'react';
import PropTypes from 'prop-types';

import Link from '../Link';
import './SearchSuggestions.css';

class SearchSuggestions extends Component {
	static propTypes = {
		className: PropTypes.string,
		suggestions: PropTypes.array,
	};

	static defaultProps = {
		suggestions: [],
	};

	render() {
		const { className, suggestions } = this.props;

		return (
			<div className={['search-suggestions', className || ''].join(' ')}>
				<h2>Suggestions</h2>

				<ul>
					{suggestions.map((suggestion) => {
						return (
							<li>
								<Link to={suggestion.url}>
									<a>{suggestion.name}</a>
								</Link>
							</li>
						);
					})}
				</ul>

				{/* <p>
						<Link to="/newselfwales/search?q=ball">
							<a>Ball</a>
						</Link>
						<br />
						<Link to="/newselfwales/search?q=dupain">
							<a>Max Dupain</a>
						</Link>
						<br />
						<Link to="/newselfwales/search?q=grace">
							<a>Grace</a>
						</Link>
						<br />
						<Link to="/newselfwales/search?q=spring">
							<a>Spring</a>
						</Link>
						<br />
						<Link to="/newselfwales/search?q=mott">
							<a>Tony Mott</a>
						</Link>
						<br />
						<Link to="/newselfwales/search?q=architect">
							<a>Architects</a>
						</Link>
						<br />
						<Link to="/newselfwales/search?q=cricket">
							<a>Cricket</a>
						</Link>
						<br />
						<Link to="/newselfwales/search?q=Mitchell">
							<a>David Scott Mitchell</a>
						</Link>
						<br />
						<Link to="/newselfwales/search?q=newtown">
							<a>Newtown</a>
						</Link>
						<br />
						<Link to="/newselfwales/search?q=Aboriginal">
							<a>Aboriginal</a>
						</Link>
						<br />
						<Link to="/newselfwales/search?q=holterman">
							<a>B. O. Holtermann</a>
						</Link>
						<br />
						<Link to="/newselfwales/search?q=hood">
							<a>Hood</a>
						</Link>
						<br />
						<Link to="/newselfwales/search?q=waterloo">
							<a>Waterloo</a>
						</Link>
						<br />
						<Link to="/newselfwales/search?q=tribune">
							<a>Tribune</a>
						</Link>
					</p> */}
			</div>
		);
	}
}

export default SearchSuggestions;
