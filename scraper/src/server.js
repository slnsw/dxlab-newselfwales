require('dotenv').config();

import { scrape } from './scrape';
import cron from 'node-cron';

console.log('Start cron job');

cron.schedule('*/10 * * * *', () => {
  scrape('instagram', 1);
});

/* Setup Server for Now - otherwise it stays on the BUILDING state */

const { createServer } = require('http');
const server = createServer(() => {});

server.listen(3000);
