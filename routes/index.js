const routes = require('next-routes')();

routes.add(
	'newselfwales',
	'/newselfwales/:param(search|portrait|instagram-selfie|gallery-selfie)/:id?',
);
routes.add(
	'photo-booth',
	'/photo-booth/:position(test|left|right)/:imageType?/:id?',
);

module.exports = routes;
