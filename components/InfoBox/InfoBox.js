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

					{!isFullSize &&
						excerpt && (
							<p
								className="info-box__excerpt"
								dangerouslySetInnerHTML={{ __html: excerpt }}
							/>
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
									hide interface
								</button>
							</div>
						</Fragment>
					)}
				</div>

				{!isFullSize && (
					<button
						className="info-box__more-button"
						onClick={this.handleMoreButton}
					>
						<i className="ion-ios-arrow-up" />
					</button>
				)}
			</div>
		);
	}
}

export default InfoBox;
