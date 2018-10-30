import cron from 'node-cron';

require('dotenv').config();

console.log('Start cron job');

cron.schedule('*/10 * * * * *', () => {
  console.log('hi');
});

/* Setup Server for Now - otherwise it stays on the BUILDING state */

const { createServer } = require('http');

const server = createServer(() => {});

server.listen(3000);
