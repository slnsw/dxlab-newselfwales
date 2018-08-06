require('dotenv').config();

import { scrape } from './scrape';

// const cron = require('node-cron');
import cron from 'node-cron';

// scrape('instagram',1);

cron.schedule('*/10 * * * *', function() { scrape('instagram',1); } ); // scrape('instagram',1)