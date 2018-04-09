import axios from 'axios';
import fs from 'fs';
import path from 'path';

import { parsePage, parseUser } from './utils/parse';

// Change this to true if you want to save a new HTML file from Instagram
const saveFile = false;

export const getCompletePostsByHashtag = async (hashtag, limit) => {
  const posts = await getPostsByHashtag(hashtag, limit);

  let completePosts = [];

  for (const i in posts) {
    const result = await getPost(posts[i].shortcode);

    completePosts.push({
      ...posts[i],
      ...result,
    });
  }

  return completePosts;
};

// Get list of Instagram selfies
export const getPostsByHashtag = async (hashtag, limit) => {
  const result = await axios.get(
    `https://www.instagram.com/explore/tags/${hashtag}/`,
    {
      responseType: saveFile && 'stream',
    },
  );

  if (saveFile) {
    result.data.pipe(
      fs.createWriteStream(
        path.resolve(__dirname, '../data', 'instagram.html'),
      ),
    );
  }

  const data = JSON.parse(parsePage(result.data));

  const selfiesRaw =
    data.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media.edges;

  // Remap raw selfies into nice objects
  const selfies = selfiesRaw.slice(0, limit).map(({ node }) => {
    if (!node.is_video) {
      const filename = node.display_url
        .substring(node.display_url.lastIndexOf('/') + 1)
        .split('?')[0];

      return {
        id: node.id,
        url: node.display_url,
        shortcode: node.shortcode,
        width: node.dimensions.width,
        height: node.dimensions.height,
        desc:
          node.edge_media_to_caption &&
          node.edge_media_to_caption.edges.length > 0 &&
          node.edge_media_to_caption.edges['0'].node.text,
        timestamp: node.taken_at_timestamp,
        likedByTotal: node.edge_liked_by.count,
        filename: filename,
        hashtag,
      };
    }
  });

  return selfies;
};

export const getPost = async (shortcode) => {
  const result = await axios.get(`https://www.instagram.com/p/${shortcode}`);

  const post = JSON.parse(parseUser(result.data));

  const username =
    post.entry_data.PostPage[0].graphql.shortcode_media.owner.username;

  const fullName =
    post.entry_data.PostPage[0].graphql.shortcode_media.owner.full_name;

  const location = post.entry_data.PostPage[0].graphql.shortcode_media.location;

  return {
    name: fullName,
    username,
    locationName: location && location.name,
    locationSlug: location && location.slug,
    locationId: location && location.id,
  };
};
