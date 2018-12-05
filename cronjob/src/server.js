import cron from 'node-cron';

import { hit } from './hit';

require('dotenv').config();

console.log('Start cron job');

cron.schedule('*/20 * * * * *', () => {
  hit();
});

/* Setup Server for Now - otherwise it stays on the BUILDING state */

const { createServer } = require('http');

const server = createServer(() => {});

server.listen(3000);
