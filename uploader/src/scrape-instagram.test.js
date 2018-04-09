import fs from 'fs';
import axios from 'axios';
import {
  getCompletePostsByHashtag,
  getPostsByHashtag,
  getPost,
} from './scrape-instagram';

jest.mock('axios');

const instagramHTML = fs.readFileSync('./data/instagram.html', 'utf8');
const instagramPostHTML = fs.readFileSync('./data/instagram-post.html', 'utf8');

describe('Instagram', () => {
  it('Should return posts from Instagram', async () => {
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: instagramHTML,
      }),
    );

    const result = await getPostsByHashtag('selfie');

    expect(result.length).toBe(62);
    expect(result[0].shortcode).toEqual('BhGQv44AL5-');
    expect(result[0].desc).toEqual(
      'Salam #Hi-five and Thank you @aetrajakarta for visiting BPO #worldclass @ptvadsindonesia. Ready to support your #CX with our #omnichannel solutions. #letsgodigital & #yakin with #ptvadsindonesia #consideritdone',
    );
    expect(result[0].filename).toBe(
      '29737751_168587553800553_668815013162516480_n.jpg',
    );
  });

  it('Should return 10 posts from Instagram', async () => {
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: instagramHTML,
      }),
    );

    const result = await getPostsByHashtag('selfie', 10);

    expect(result.length).toBe(10);
  });

  it('Should return a post from Instagram', async () => {
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: instagramPostHTML,
      }),
    );

    const result = await getPost('BhGQv44AL5-');

    expect(result.username).toBe('deddy_hermansyah');
    expect(result.name).toBe('Deddy Safrudin Hermansyah');
    expect(result.locationName).toBe('PT VADS Indonesia');
  });

  it('Should return JSON of Instagram posts with user data', async () => {
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: instagramHTML,
      }),
    );

    axios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: instagramPostHTML,
      }),
    );

    const result = await getCompletePostsByHashtag('selfie', 1);

    expect(result.length).toBe(1);
    expect(result[0].shortcode).toBe('BhGQv44AL5-');
  });
});
