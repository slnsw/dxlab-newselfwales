import scrapeSLNSW from './scrape-slnsw';
import scrapeInstagram from './scrape-instagram';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Assign cli variables
const source = process.argv[2];
const id = process.argv[3];

const scrape = (source, id) => {
  // Switch between different sources here
  if (source === 'slnsw') {
    scrapeSLNSW(id);
  } else if (source === 'instagram') {
    scrapeInstagram(id);
    console.log('Scraping instagram...');
  } else {
    console.log('Source not available');
  }
};

scrape(source, id);
