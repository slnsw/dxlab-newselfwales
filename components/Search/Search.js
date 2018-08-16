import { Component } from 'react';
// import PropTypes from 'prop-types';

import './Search.css';

class Search extends Component {
	// static propTypes = {};

	handleInputTextChange = (event) => {
		this.setState({ inputTextValue: event.target.value });
	};

	handleFormSubmit = (event) => {
		console.log(this.state.inputTextValue);

		//  Router.pushRoute(`/search?q=${this.props.inputTextValue}`);
		this.props.onSubmit(event, this.state.inputTextValue);
		event.preventDefault();
	};

	render() {
		// const {} = this.props;

		return (
			<div className="search">
				<form onSubmit={this.handleFormSubmit}>
					<input
						type="text"
						name="q"
						placeholder="Start searching"
						//    defaultValue={url.query.q}
						id="search-field"
						onChange={this.handleInputTextChange}
					/>
					<input type="submit" className="button" />
				</form>
			</div>
		);
	}
}

export default Search;
