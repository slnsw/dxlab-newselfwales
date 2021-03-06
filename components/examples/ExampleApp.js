import Head from 'next/head';

import '../../styles/base.css';
import '../../styles/helpers.css';

export default ({ children }) => (
	<main>
		<Head>
			{/* <link rel="stylesheet" href="/_next/static/style.css" /> */}
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=1"
			/>
			<meta property="og:type" content="website" />
		</Head>
		{children}
	</main>
);
