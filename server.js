require('dotenv').config();

const express = require('express');
const next = require('next');
const uaCompatible = require('ua-compatible');
const helmet = require('helmet');
// const proxy = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production' && !process.env.NOW;
const app = next({ dev });
const routes = require('./routes');

const handler = routes.getRequestHandler(app);

console.log('----------------------------------');
console.log('Environment Variables:');
console.log('----------------------------------');
console.log(`PORT=${process.env.PORT}`);
console.log(`NEWSELFWALES_GRAPHQL_URL=${process.env.NEWSELFWALES_GRAPHQL_URL}`);
console.log(`TEST=${process.env.TEST}`);
console.log(`NEWSELFWALES_BASE_URL=${process.env.NEWSELFWALES_BASE_URL}`);
console.log(`NEWSELFWALES_FB_APP_ID=${process.env.NEWSELFWALES_FB_APP_ID}`);
console.log(
	`NEWSELFWALES_GOOGLE_ANALYTICS_ID=${process.env.NEWSELFWALES_GOOGLE_ANALYTICS_ID}`,
);
console.log('----------------------------------');

const port = process.env.PORT || 3000;

app
	.prepare()
	.then(() => {
		const server = express();

		// Add Security headers
		server.use(helmet());

		// Adds X-UA-Compatible: IE=edge, chrome=1 header for our IE friends.
		server.use(uaCompatible);

		// Redirect all trailing slashes
		// https://stackoverflow.com/questions/13442377/redirect-all-trailing-slashes-globally-in-express
		server.use((req, res, nextMiddleWare) => {
			if (req.path.substr(-1) === '/' && req.path.length > 1) {
				const query = req.url.slice(req.path.length);
				res.redirect(301, req.path.slice(0, -1) + query);
			} else {
				nextMiddleWare();
			}
		});

		// Proxy GraphQL API
		// server.use(
		// 	proxy('/api/graphql', {
		// 		target: process.env.GRAPHQL_HOST,
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/api/graphql': '/graphql',
		// 		},
		// 	}),
		// );

		server.use('/newselfwales/assets', app.getRequestHandler());

		server.all('*', (req, res) => handler(req, res));

		server.listen(port, (err) => {
			if (err) throw err;
			console.log(`> Ready on http://localhost:${port}`);
		});
	})
	.catch((ex) => {
		console.error(ex.stack);
		process.exit(1);
	});
