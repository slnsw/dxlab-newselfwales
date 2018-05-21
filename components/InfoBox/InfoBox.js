import { Component, Fragment } from 'react';
// import PropTypes from 'prop-types';

import './InfoBox.css';

class InfoBox extends Component {
	// static propTypes = {};
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
				<p>Share your portrait and become part of our opening exhibitions.</p>

				{this.state.showMore && (
					<Fragment>
						<p>
							#NewSelfWales is the{' '}
							<a href="https://dxlab.sl.nsw.gov.au">DX Lab’s </a>biggest
							experiment and you can be part of it.
						</p>

						<h2>What does the face of NSW look like in 2018?</h2>

						<p>
							To find out, we are asking you to take a portrait of yourself and
							submit it via Instagram using the #NewSelfWales. Your portrait
							will become part of an immersive exhibition experience that will
							be launched in our new galleries, opening on{' '}
							<strong>6 October 2018.</strong>
						</p>

						<p>
							Featuring thousands of portraits from the Library’s collection,
							from people around NSW and yours of course, this experience will
							become part of history as we collect the face of NSW in 2018.
						</p>

						<p>
							Here are some images from our collection to inspire your portrait.
							We would love to see some really creative photographs that we can
							re-gram on our{' '}
							<a
								href="https://www.instagram.com/statelibrarynsw/"
								target="_blank"
								rel="noopener noreferrer"
							>
								Instagram account.
							</a>
						</p>

						<p>
							Please direct message{' '}
							<a
								href="https://www.instagram.com/statelibrarynsw/"
								target="_blank"
								rel="noopener noreferrer"
							>
								@statelibrarynsw
							</a>{' '}
							for enquiries.
						</p>

						<p>
							* By submitting your photo on Instagram using the #NewSelfWales
							you are allowing the State Library of NSW to collect, store and
							show your image as part of this digital experience. We will use
							your portrait in the gallery and online through the Library’s
							digital channels. This will only include public metadata that you
							have in the caption, tagged people and locations fields. We will
							not collect comments, shares or likes that are added to your post.
						</p>
						<p>
							Instagram requires everyone to be at least{' '}
							<a
								href="https://help.instagram.com/517920941588885"
								target="_blank"
								rel="noopener noreferrer"
							>
								13 years old before they can create an account
							</a>{' '}
							(in some jurisdictions, this age limit may be higher).
						</p>
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
