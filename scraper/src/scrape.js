import scrapeRecord from './scrape-record';
import scrapeRecords from './scrape-records';
import scrapeInstagram from './scrape-instagram';

require('dotenv').config();

// console.log(process.env.GRAPHQL_URL);

// Naughty hack to get local http server to access https endpoint
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Assign cli variables
const source = process.argv[2];
const id = process.argv[3];

export const scrape = (source, id) => {
  // Switch between different sources here
  if (source === 'record') {
    scrapeRecord(id);
  } else if (source === 'records') {

    // pick one:
   // const ids = null; // choose this option to search by term and using offset and max
    // otherwise use a list of IDs here
     const ids = [

'ADLIB110060425',
'ADLIB110088251',
'ADLIB110089388',
'ADLIB110200090',
'ADLIB110200139',
'ADLIB110200096',
'ADLIB110200143',
'ADLIB110200116',
'ADLIB110200080',
'ADLIB110200133',
'ADLIB110375073',
'ADLIB110374796',
'ADLIB110332916',
'ADLIB110341222',
'ADLIB110342587',
'ADLIB110361550',
'ADLIB110311676',
'ADLIB110326264',
'ADLIB110342579',
'ADLIB110342594',
'ADLIB110060346',
'ADLIB110192873',
'ADLIB110192888',
'ADLIB110192887',
'ADLIB110192872',
'ADLIB110192868',
'ADLIB110301235',
'ADLIB110321552',
'ADLIB110326575',

     ];

    let offset = 0;
    const limit = 10;
    const max = 30000;
    const term = "portraits";

    scrapeRecords(ids, offset, limit, max, term);
  } else if (source === 'instagram') {

    const hashtag = 'newselfwales'; // 'selfie';
    const count = 10;
    
    console.log('Scraping instagram for #' + hashtag);
    console.log('Asking for ' + count);
    scrapeInstagram(hashtag, count);
    

  } else {
    console.log('Source not available');
  }

  return null;
};

scrape(source, id);
