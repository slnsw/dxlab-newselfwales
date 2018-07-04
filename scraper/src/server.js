require('dotenv').config();

import { scrape } from './scrape';
// const cron = require('node-cron');
import cron from 'node-cron';

cron.schedule('*/2 * * * *', function() { scrape('instagram',1); } ); // scrape('instagram',1)