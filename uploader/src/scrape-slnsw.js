import gql from 'graphql-tag';
import client from './lib/client';
import wpUpload from '../../lib/wpUpload';
import axios from 'axios';

export default async (id) => {
  try {
    if (id) {
      const { data: {primoRecord} } = await client.query({
        query: gql`
          query getPrimoRecord($id: String!) {
            primoRecord(id: $id) {
              id
              title
              date
              #name
              format
              description
              subjects
              topics
              notes
              physicalDescription
              images(size: FULL) {
                url
                width
                height
                fileNumber
              }
            }
          }
        `,
        variables: {
          id,
        },
      });
      console.log(primoRecord);

      const image = await axios.get(
        primoRecord.images[0].url,
        {
          responseType: 'arraybuffer'
        }
        );
      const imgBuf = new Buffer(image.data, 'binary')
//      console.log(image.data);

          // get WP API ready
      wpUpload.init();

        // now use WP API to upload selfie and data
    wpUpload.upload(
      {
        type: 'portrait',

        title: primoRecord.title,
        description: primoRecord.topics.join(', ') + ', ' + primoRecord.subjects.join(', '),// imploded list of subjects and topics
        dateText: primoRecord.date,
        name: '', // primoRecord.name,
        archiveNotes: primoRecord.notes.join(', '),
        primoRef: id,
        digId: '',
        blob: imgBuf,

      },
      () => {
        console.log('done');
      },
    );

      return primoRecord;
    } else {
      console.log('Need primoId!');
    }

  } catch (e) {
    console.log(e);
  }

};
