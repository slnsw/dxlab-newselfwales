import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import './InfoBox.css';

class InfoBox extends Component {
	static propTypes = {
		className: PropTypes.string,
		title: PropTypes.string,
		children: PropTypes.string,
		excerpt: PropTypes.string,
		isFullSize: PropTypes.bool,
		onMoreButtonClick: PropTypes.func,
		onCloseButtonClick: PropTypes.func,
		onHideButtonClick: PropTypes.func,
	};

	static defaultProps = {
		isFullSize: false,
	};

	handleMoreButton = () => {
		if (typeof this.props.onMoreButtonClick === 'function') {
			this.props.onMoreButtonClick();
		}
	};

	handleCloseButton = () => {
		if (typeof this.props.onCloseButtonClick === 'function') {
			this.props.onCloseButtonClick();
		}
	};

	handleHideButton = () => {
		if (typeof this.props.onHideButtonClick === 'function') {
			this.props.onHideButtonClick();
		}
	};

	render() {
		const { className, excerpt, isFullSize } = this.props;

		return (
			<div
				className={[
					'info-box',
					isFullSize ? 'info-box--is-full-size' : '',
					className || '',
				].join(' ')}
			>
				{isFullSize && (
					<button
						onClick={this.handleCloseButton}
						className="info-box__toggle-button"
					>
						<i className="ion-md-close" />
					</button>
				)}

				<div className="info-box__inside">
					<img
						alt="#NewSelfWales"
						className="info-box__title-image"
						src="/static/newselfwales/newselfwales-logo-01.gif"
					/>
					{/* <h1 className="info-box__title">#NewSelfWales</h1> */}

					{!isFullSize && excerpt && (
						<Fragment>
							<div>
								<p
									className="info-box__excerpt"
									dangerouslySetInnerHTML={{ __html: excerpt }}
								/>

								<button
									className="button button--xs"
									onClick={this.handleMoreButton}
								>
									More Info
								</button>
							</div>
						</Fragment>
					)}

					{isFullSize && (
						<Fragment>
							<div
								className="info-box__content"
								dangerouslySetInnerHTML={{ __html: this.props.children }}
							/>

							<div className="info-box__logo-holder">
								<a href="https://dxlab.sl.nsw.gov.au">
									<img
										className="info-box__logo info-box__logo--dxlab"
										src="/static/newselfwales/images/logos/logo-dxlab.png"
										alt="DX Lab Home"
									/>
								</a>
								<a href="http://sl.nsw.gov.au">
									<img
										className="info-box__logo info-box__logo--slnsw"
										src="/static/newselfwales/images/logos/logo-slnsw-white.png"
										alt="State Library of NSW Home"
									/>
								</a>
								<button
									onClick={this.handleHideButton}
									className="secondary-button info-box__hide-button"
								>
									Images Only
								</button>
							</div>

							<div className="info-box__footer">
								<ul className="footer-menu">
									{footerItems.map((item, i) => (
										<li key={`footer-menu-${i}`}>
											<a href={item.url}>{item.name}</a>
										</li>
									))}
								</ul>
							</div>
						</Fragment>
					)}
				</div>

				{!isFullSize && (
					<button
						className="info-box__more-button"
						onClick={this.handleHideButton}
					>
						<i className="ion-ios-arrow-down" />
					</button>
				)}
			</div>
		);
	}
}

const footerItems = [
	{ name: 'Disclaimer', url: 'https://www.sl.nsw.gov.au/disclaimer' },
	{
		name: 'Privacy',
		url: 'https://www.sl.nsw.gov.au/privacy/web-privacy-statement',
	},
	{ name: 'Copyright', url: 'https://www.sl.nsw.gov.au/copyright' },
	{
		name: 'Right to information',
		url: 'https://www.sl.nsw.gov.au/right-to-information',
	},
];

export default InfoBox;
