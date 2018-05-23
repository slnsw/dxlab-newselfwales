import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import './InfoBox.css';

class InfoBox extends Component {
	static propTypes = {
		title: PropTypes.string,
		children: PropTypes.string,
		excerpt: PropTypes.string,
	};

	constructor() {
		super();

		this.state = {
			showMore: false,
		};
	}

	handleMoreButton = () => {
		this.setState({
			showMore: !this.state.showMore,
		});
	};

	render() {
		// const {} = this.props;

		return (
			<div
				className={`info-box ${this.state.showMore ? 'info-box--full' : ''}`}
			>
				{this.state.showMore && (
					<button
						onClick={this.handleMoreButton}
						className="info-box__toggle-button"
					>
						<i className="slnsw-icon-modal-close" />
					</button>
				)}

				<h1 className="info-box__title">#NewSelfWales</h1>

				{this.props.excerpt && <p>{this.props.excerpt}</p>}

				{this.state.showMore && (
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
						</div>
					</Fragment>
				)}

				<button
					className="button info-box__more-button"
					onClick={this.handleMoreButton}
				>
					{this.state.showMore ? 'Hide' : 'Read More'}
				</button>
			</div>
		);
	}
}

export default InfoBox;
