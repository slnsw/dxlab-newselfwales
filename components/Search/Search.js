import { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import queryString from 'query-string';

import ImageModalContainer from '../ImageModalContainer';
import Link from '../Link';
import './Search.css';

class Search extends Component {
	static propTypes = {
		className: PropTypes.string,
		url: PropTypes.object,
		portraits: PropTypes.array,
		instagramSelfies: PropTypes.array,
		gallerySelfies: PropTypes.array,
		inputTextValue: PropTypes.string,
		loading: PropTypes.bool,
		isActive: PropTypes.bool,
		onSubmit: PropTypes.func,
		onInputTextFocus: PropTypes.func,
		onInputTextBlur: PropTypes.func,
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

	handleInputTextFocus = (event) => {
		if (typeof this.props.onInputTextFocus === 'function') {
			this.props.onInputTextFocus(event);
		}
	};

	handleInputTextBlur = () => {
		if (typeof this.props.onInputTextBlur === 'function') {
			this.props.onInputTextFocus();
		}
	};

	handleFormSubmit = (event) => {
		if (typeof this.props.onSubmit === 'function') {
			this.props.onSubmit(event, this.state.inputTextValue);
		}

		// Stops page from refreshing
		event.preventDefault();
	};

	handleImageClick = (event, image) => {
		this.setState({ imageId: image.id, imageType: image.type });
	};

	handleImageModalClose = () => {
		this.setState({ imageId: null });
	};

	render() {
		const {
			url,
			portraits,
			instagramSelfies,
			gallerySelfies,
			className,
			isActive,
		} = this.props;
		const { inputTextValue } = this.state;

		return (
			<CSSTransition
				in={isActive}
				appear
				timeout={300}
				classNames="search-"
				// unmountOnExit
			>
				<div className={['search', className].join(' ')}>
					<h1>Search</h1>

					<form onSubmit={this.handleFormSubmit}>
						<div className="search__form">
							<input
								type="text"
								name="q"
								placeholder="Start searching"
								value={inputTextValue}
								id="search-field"
								className="search__form__input-text"
								onInput={(event) => this.handleInputTextChange(event)}
								onFocus={() => this.handleInputTextFocus(this.searchInput)}
								onBlur={this.handleInputTextBlur}
								ref={(input) => {
									this.searchInput = input;
								}}
							/>
							<input type="submit" className="button" />
						</div>
					</form>

					<div className="search__results">
						{['gallery-selfie', 'portrait', 'instagram-selfie'].map((type) => {
							let items = [];
							let titleField = 'title';
							let typeTitle;

							if (type === 'gallery-selfie') {
								items = gallerySelfies;
								titleField = 'galleryName';
								typeTitle = 'Gallery Selfies';
							} else if (type === 'portrait') {
								items = portraits;
								typeTitle = 'Portraits';
							} else if (type === 'instagram-selfie') {
								items = instagramSelfies;
								typeTitle = 'Instagram Selfies';
							}

							return (
								<section>
									<h2 className="search__results__title">
										{typeTitle} <span> ({items.length})</span>
									</h2>
									<div className="search__results__row">
										{items.map((item) => {
											return (
												<Link
													href={`${url.pathname}?${queryString.stringify({
														...url.query,
														imageType: type,
														id: item.id,
													})}`}
												>
													<a>
														<article
															className="search__results__item"
															onClick={(event) =>
																this.handleImageClick(event, {
																	...item,
																	type,
																})
															}
															key={item.id}
														>
															<img
																src={item.featuredMedia.sourceUrl}
																alt=""
																className=""
															/>
															<br />
															<h1
																dangerouslySetInnerHTML={{
																	__html: item[titleField],
																}}
															/>
														</article>
													</a>
												</Link>
											);
										})}
									</div>
								</section>
							);
						})}
					</div>

					<ImageModalContainer
						id={this.state.imageId}
						imageType={this.state.imageType}
						isActive={this.state.imageId === null}
						onClose={this.handleImageModalClose}
					/>
				</div>
			</CSSTransition>
		);
	}
}

export default Search;
