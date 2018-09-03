import gql from 'graphql-tag';
import axios from 'axios';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import wpUpload from '@slnsw/dxlab-selfie-uploader';

import client from './lib/client';
import getPrimoRecord from './utils/get-primo-record';

export default async (id) => {
  const nl = '\n';
  let err;
  let log = '';
  let dt = new Date().toLocaleString("en-AU", {timeZone: "Australia/Sydney"});
  log += dt + nl; // .toUTCString()
  try {
    if (id) {
      // Fetch from GraphQL
      chalkAnimation.rainbow('Fetching primoRecord');
      log += 'Fetching primoRecord ' + id + nl;
      const { data: { primoRecord } } = await getPrimoRecord(id);
      console.log(JSON.stringify(primoRecord));
      log += JSON.stringify(primoRecord) + nl + '......................' + nl;
      // Get Image
      chalkAnimation.rainbow('Fetching image');
      console.log('Fetching image');
      log += 'Fetching image' + nl;
      console.log(primoRecord.images[0].url);
      log += primoRecord.images[0].url + nl;
      const image = await axios.get(primoRecord.images[0].url, {
        responseType: 'arraybuffer',
      });
      const imgBuf = new Buffer(image.data, 'binary');

      // Get WP API ready
      chalkAnimation.rainbow('Init WP API');
      console.log('Init WP API');
      log += 'Init WP API' + nl;
      wpUpload.init({
        endpoint: process.env.WP_API_ENDPOINT,
        username: process.env.WP_USERNAME,
        password: process.env.WP_PASSWORD,
      });

      // now use WP API to upload selfie and data
      chalkAnimation.rainbow('Upload to WP API');
      console.log('Upload to WP API');
      log += 'Upload to WP API' + nl;
      // smoosh topics and subjects together
      const t = primoRecord.topics.concat(primoRecord.subjects);
      // remove duplicates
      const s = t.filter((v, i, a) => a.indexOf(v) === i);
      wpUpload.upload(
        {
          type: 'portrait',
          title: primoRecord.title,
          status: 'publish',
          description: ( s ? s.join(', ') : '' ), // imploded list of subjects and topics
          dateText: primoRecord.date,
          name: (primoRecord.personNames ? primoRecord.personNames.join('. ') : '' ), // primoRecord.name,
          archiveNotes: ( primoRecord.notes ? primoRecord.notes.join('; ') : '' ),
          primoRef: id,
          digId: '',
          blob: imgBuf,
        },
        () => {
          console.log('done');
          // log += 'Done!' + nl;
        },
      );
      log += 'Done!' + nl + nl;
      err = '';
      return { log: log, err: err };
    } else {
      console.log('Need primoId!');
      log += nl + 'ERROR: Need primoId!' + nl;
      err = 'ERROR: Need primoId!';
      return { log: log, err: err };
    }
  } catch (e) {
    console.log(e);
    log += nl + 'ERROR: ' + e + nl;
    err = e;
    return { log: log, err: err };
  }
};
