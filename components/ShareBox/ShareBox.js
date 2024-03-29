import { Component } from 'react';
import PropTypes from 'prop-types';

import './ShareBox.css';

class ShareBox extends Component {
	static propTypes = {
		pathname: PropTypes.string,
		title: PropTypes.string,
		text: PropTypes.string,
		imageUrl: PropTypes.string,
	};

	render() {
		const { title, text, pathname, imageUrl } = this.props;
		const tweetText = encodeURIComponent(`${title} #dxlab @statelibrarynsw`);
		const fbAppId = process.env.NEWSELFWALES_FB_APP_ID;

		// TODO: Use baseUrl variable
		const url = encodeURIComponent(`${process.env.BASE_URL}${pathname}`);
		const fbLink = `https://www.facebook.com/dialog/share?app_id=${fbAppId}&href=${url}&redirect_uri=${url}&name=%${encodeURIComponent(
			title,
		)}&description=${encodeURIComponent(text)}${
			imageUrl ? `&picture=${imageUrl}` : ''
		}`;

		const twitterLink = `https://twitter.com/intent/tweet?text=${tweetText}&url=${url}`;

		return (
			<div className="share-box">
				<div className="share-box__title">Share</div>

				<div className="share-box__icons">
					<a
						href={fbLink}
						aria-label="Share this item on Facebook"
						target="_blank"
					>
						<span
							className="share-box__icon icon ion-logo-facebook"
							aria-hidden="true"
						/>
					</a>

					<a
						href={twitterLink}
						aria-label="Share this item on Twitter"
						target="_blank"
					>
						<span
							className="share-box__icon icon ion-logo-twitter"
							aria-hidden="true"
						/>
					</a>
				</div>
			</div>
		);
	}
}

export default ShareBox;
