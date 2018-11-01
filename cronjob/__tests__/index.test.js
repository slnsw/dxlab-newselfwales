import { getFeed, sendFeed } from '../src/hit';

describe('GraphQL Queries', () => {
  it('Get Image Feed from GraphQL', async () => {
    const { data } = await getFeed();

    expect(data.feed.length).toBe(10);
  });

  it('Should Send Mutation to GraphQL', async () => {
    const { data } = await sendFeed([{ id: 1 }]);

    console.log(data);

    expect(data.sendControl).toEqual({
      appId: 'NEWSELFWALES',
      channel: 'FEED',
      action: 'SEND_FEED',
      value: '[{"id":1}]',
      __typename: 'ControlMessage',
    });
  });
});
