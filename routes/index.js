const routes = require('next-routes')();

routes.add('newselfwales', '/newselfwales/:imageType/:id');
routes.add('photo-booth', '/photo-booth/:position/:imageType?/:id?');

module.exports = routes;
