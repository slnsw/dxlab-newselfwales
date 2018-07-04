'use strict';

const { createServer, proxy } = require('aws-serverless-express');
const app = require('./build/app').app;

const server = createServer(app);

exports.graphql = (event, context) => {
  event.headers['Access-Control-Allow-Origin'] = '*';
  event.headers['Access-Control-Allow-Credentials'] = true;

  return proxy(server, event, context);
}
