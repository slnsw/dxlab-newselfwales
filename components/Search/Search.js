import { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import ImageModalContainer from '../ImageModalContainer';
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

					<form onSubmit={this.handleFormSubmit} className="search__form">
						<input
							type="text"
							name="q"
							placeholder="Start searching"
							value={inputTextValue}
							id="search-field"
							className="search__form__input-text"
							onInput={(event) => this.handleInputTextChange(event)}
							onFocus={() => this.handleInputTextFocus(this.searchInput)}
							ref={(input) => {
								this.searchInput = input;
							}}
						/>
						<input type="submit" className="button" />
					</form>

					<div className="search__results">
						<section>
							<h2>
								Gallery Selfies<span> ({gallerySelfies.length})</span>
							</h2>
							<div className="search__results__row">
								{gallerySelfies.map((gallerySelfie) => {
									return (
										<article
											className="search__results__item"
											onClick={(event) =>
												this.handleImageClick(event, {
													...gallerySelfie,
													type: 'gallery-selfie',
												})
											}
											key={gallerySelfie.id}
										>
											<img
												src={gallerySelfie.featuredMedia.sourceUrl}
												alt=""
												className=""
											/>
											<h1
												dangerouslySetInnerHTML={{
													__html: gallerySelfie.galleryName,
												}}
											/>
										</article>
									);
								})}
							</div>
						</section>
						<section>
							<h2>
								portraits<span> ({portraits.length})</span>
							</h2>
							<div className="search__results__row">
								{portraits.map((portrait) => {
									return (
										<article
											className="search__results__item"
											onClick={(event) =>
												this.handleImageClick(event, {
													...portrait,
													type: 'portrait',
												})
											}
											key={portrait.id}
										>
											<img
												src={portrait.featuredMedia.sourceUrl}
												alt=""
												className=""
											/>
											<h1
												dangerouslySetInnerHTML={{ __html: portrait.title }}
											/>
										</article>
									);
								})}
							</div>
						</section>
						<section>
							<h2>
								Instagram Selfies<span> ({instagramSelfies.length})</span>
							</h2>
							<div className="search__results__row">
								{instagramSelfies.map((instagramSelfie) => {
									return (
										<article
											className="search__results__item"
											onClick={(event) =>
												this.handleImageClick(event, {
													...instagramSelfie,
													type: 'instagram-selfie',
												})
											}
											key={instagramSelfie.id}
										>
											<img
												src={instagramSelfie.featuredMedia.sourceUrl}
												alt=""
												className=""
											/>
											<h1
												dangerouslySetInnerHTML={{
													__html: instagramSelfie.title,
												}}
											/>
										</article>
									);
								})}
							</div>
						</section>
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
