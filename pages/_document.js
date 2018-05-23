import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
	render() {
		return (
			<html>
				<Head>
					<link
						rel="stylesheet"
						href={`${process.env.BASE_URL}/_next/static/style.css`}
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
