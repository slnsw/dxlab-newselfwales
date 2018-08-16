import { Component } from 'react';
import PropTypes from 'prop-types';

import './Search.css';

class Search extends Component {
	static propTypes = {
		portraits: PropTypes.array,
		instagramSelfies: PropTypes.array,
		gallerySelfies: PropTypes.array,
		inputTextValue: PropTypes.string,
		loading: PropTypes.bool,
		onSubmit: PropTypes.func,
	};

	static defaultProps = {
		portraits: [],
		instagramSelfies: [],
		gallerySelfies: [],
	};

	state = {
		inputTextValue: '',
		hasInitialValue: false,
	};

	componentDidMount() {
		// this.setState({
		// 	inputTextValue: this.props.inputTextValue,
		// });
	}

	componentDidUpdate(prevProps) {
		if (
			prevProps.inputTextValue !== this.props.inputTextValue &&
			!this.state.hasInitialValue
		) {
			this.setState({
				inputTextValue: this.props.inputTextValue,
				hasInitialValue: true,
			});
		}
	}

	handleInputTextChange = (event) => {
		this.setState({ inputTextValue: event.target.value });
	};

	handleFormSubmit = (event) => {
		if (typeof this.props.onSubmit === 'function') {
			this.props.onSubmit(event, this.state.inputTextValue);
		}

		event.preventDefault();
	};

	render() {
		const { portraits, instagramSelfies, gallerySelfies } = this.props;

		const { inputTextValue } = this.state;

		return (
			<div className="search">
				<form onSubmit={this.handleFormSubmit}>
					<input
						type="text"
						name="q"
						placeholder="Start searching"
						value={inputTextValue}
						// defaultValue={url.query.q}
						id="search-field"
						onChange={this.handleInputTextChange}
					/>
					<input type="submit" className="button" />
				</form>
				<div className="search__results">
					<div className="search__results__row">
						<h2>
							Gallery Selfies<span> ({gallerySelfies.length})</span>
						</h2>
						{gallerySelfies.map((gallerySelfie) => {
							return (
								<div className="search__results__item">
									<p>{gallerySelfie.title}</p>
									<img
										src={gallerySelfie.featuredMedia.sourceUrl}
										alt=""
										className=""
									/>
								</div>
							);
						})}
					</div>
					<div className="search__results__row">
						<h2>
							portraits<span> ({portraits.length})</span>
						</h2>
						{portraits.map((portrait) => {
							return (
								<div className="search__results__item">
									<p>{portrait.title}</p>
									<img
										src={portrait.featuredMedia.sourceUrl}
										alt=""
										className=""
									/>
								</div>
							);
						})}
					</div>
					<div className="search__results__row">
						<h2>
							Instagram Selfies<span> ({instagramSelfies.length})</span>
						</h2>
						{instagramSelfies.map((instagramSelfie) => {
							return (
								<div className="search__results__item">
									<p>{instagramSelfie.title}</p>
									<img
										src={instagramSelfie.featuredMedia.sourceUrl}
										alt=""
										className=""
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default Search;
