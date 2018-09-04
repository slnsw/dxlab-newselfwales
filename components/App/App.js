import { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { initGA, logPageView } from '../../lib/analytics';
import logBase from '../../lib/log';
import packageJson from '../../package.json';

import '../../styles/base.css';
import '../../styles/helpers.css';

const log = (...args) => {
	return logBase('<App />', ...args);
};

class App extends Component {
	static propTypes = {
		title: PropTypes.string,
		children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
		pathname: PropTypes.string,
		isLoading: PropTypes.bool,
		metaDescription: PropTypes.string,
		metaImageUrl: PropTypes.string,
		metaImageAlt: PropTypes.string,
	};

	componentDidMount() {
		document.addEventListener('scroll', this.handleOnScroll);

		if (!window.GA_INITIALIZED) {
			initGA();
			window.GA_INITIALIZED = true;
		}

		logPageView();

		log('version', packageJson.version);
	}

	render() {
		const {
			title,
			children,
			pathname,
			metaDescription,
			metaImageUrl,
			metaImageAlt,
		} = this.props;

		const baseUrl = 'https://dxlab.sl.nsw.gov.au';
		const metaUrl = `${baseUrl}${pathname}`;

		return (
			<main>
				<Head>
					<title>#NewSelfWales | DX Lab - State Library of NSW</title>
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=1"
					/>
					<meta property="og:type" content="website" />
					{title && <meta property="og:title" content={title} />}
					{metaDescription && (
						<meta property="og:description" content={metaDescription} />
					)}
					{metaDescription && (
						<meta name="description" content={metaDescription} />
					)}
					{metaImageUrl && (
						<meta property="og:image" content={`${metaImageUrl}`} />
					)}
					{metaUrl && <meta property="og:url" content={metaUrl} />}
					{metaImageAlt && (
						<meta name="twitter:image:alt" content={metaImageAlt} />
					)}
					<meta name="twitter:card" content="summary_large_image" />
					<meta
						property="og:site_name"
						content="DX Lab - State Library of NSW"
					/>
					<meta property="fb:app_id" content={process.env.FB_APP_ID} />
					<meta name="twitter:site" content="@statelibrarynsw" />
					<link
						rel="shortcut icon"
						href="http://www.sl.nsw.gov.au/sites/all/themes/slnsw_frontend/favicon.ico"
						type="image/vnd.microsoft.icon"
					/>
					<link
						href="https://fonts.googleapis.com/css?family=Lekton:400,400i,700"
						rel="stylesheet"
					/>
					<link
						href="https://fonts.googleapis.com/css?family=Barlow:300,300i,400,400i,500,500i"
						rel="stylesheet"
					/>
					<link
						href="https://unpkg.com/ionicons@4.2.5/dist/css/ionicons.min.css"
						rel="stylesheet"
					/>
					{/* <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.1/TweenMax.min.js" /> */}
				</Head>
				{children}
			</main>
		);
	}
}

export default App;
