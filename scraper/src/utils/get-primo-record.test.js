import getPrimoRecord from './get-primo-record';
import client from '../lib/client';

jest.mock('../lib/client');

// TODO: Write new test! Needs image
test("Should return a video record of beloved children's book character Spot", async () => {
  // Mock Apollo client so test doesn't have to hit server
  client.query.mockImplementation(() =>
    Promise.resolve({
      data: {
        primoRecord: {
          title:
            "Spot's first video [videorecording] : six delightful adventures with the world's favourite puppy.",
        },
      },
    }),
  );

  const { data: { primoRecord } } = await getPrimoRecord(
    'SLNSW_ALMA21124805750002626',
  );

  expect(primoRecord.title).toBe(
    "Spot's first video [videorecording] : six delightful adventures with the world's favourite puppy.",
  );
});
