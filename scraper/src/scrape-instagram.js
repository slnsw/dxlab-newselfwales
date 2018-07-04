import axios from 'axios';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import fs from 'fs';
import path from 'path';
import WPAPI from 'wpapi';
import wpUpload from '@slnsw/dxlab-selfie-uploader';

import { parsePage, parseUser } from './utils/parse';



// Change this to true if you want to save a new HTML file from Instagram
const saveFile = false;

let logtxt = ''; // log stuff here
let wp;
try {
  wpUpload.init({
    endpoint: process.env.WP_API_ENDPOINT,
    username: process.env.WP_USERNAME,
    password: process.env.WP_PASSWORD,
  });

  wp = new WPAPI({
    endpoint: process.env.WP_API_ENDPOINT,
    username: process.env.WP_USERNAME,
    password: process.env.WP_PASSWORD,
  });

  wp.instagramSelfies = wp.registerRoute(
    'wp/v2',
    '/instagram-selfies/(?P<id>\\d+)',
  );
} catch (e) {
  console.log('WP API upload failed!');
  console.log(e);
  logtxt += 'WP API upload failed!\n' + e + '\n';
}

/*
export const getCompletePostsByHashtag = async (hashtag, limit) => {
  const posts = await getPostsByHashtag(hashtag, limit);

  let completePosts = [];
console.log(posts.length);
  for (const i in posts) {
    console.log(i);
    const result = await getPost(posts[i].shortcode);
    const biography = await getIgUser(result.username);

    completePosts.push({
      ...posts[i],
      ...result,
      ...biography,
    });
  }

  return completePosts;
};
*/
// Get list of Instagram selfies
export const getPostsByHashtag = async (hashtag) => {
  try {
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
  const selfies = selfiesRaw.map(({ node }) => {
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
  } catch (e) {
    console.log('getPostsByHashtag ' + hashtag + ' failed!');
  //  console.log(e);
    console.log('================');
    logtxt += 'getPostsByHashtag ' + hashtag + ' failed!\n================\n';
    return false;
  }
};

export const getPost = async (shortcode) => {
  try {
    const result = await axios.get(`https://www.instagram.com/p/${shortcode}`);
    const post = JSON.parse(parseUser(result.data));
    const username =
      post.entry_data.PostPage[0].graphql.shortcode_media.owner.username;
    const fullName =
      post.entry_data.PostPage[0].graphql.shortcode_media.owner.full_name;
    const location = post.entry_data.PostPage[0].graphql.shortcode_media.location;

    const multi = post.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children;
    if (multi) {
      const m = multi.edges;
      for (var u of m) {
        console.log(u.node.display_url);
      }
    }

    return {
      name: fullName,
      username,
      locationName: location && location.name,
      locationSlug: location && location.slug,
      locationId: location && location.id,
    };
  } catch (e) {
    console.log('getPost ' + shortcode + ' failed!');
  //  console.log(e);
    console.log('================');
    logtxt += 'getPost ' + shortcode + ' failed!\n================\n';
    return false;
  }
};

export const getIgUser = async (username) => {
  try {
    const result = await axios.get(`https://www.instagram.com/${username}`);
    const post = JSON.parse(parseUser(result.data));
    const biography =
      post.entry_data.ProfilePage[0].graphql.user.biography;
    return {
      biography: biography,
    };    
  } catch(e) {
    console.log('getIgUser ' + username + ' failed!');
  //  console.log(e);
    console.log('================');
    logtxt += 'getIgUser ' + username + ' failed!\n================\n';
    return false;
  }
};

export const getImage = async (url) => {
  try {
    const image = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    const imgBuf = new Buffer(image.data, 'binary');
    return imgBuf;
  } catch(e) {
    console.log('getImage ' + url + ' failed!');
  //  console.log(e);
    console.log('================');
    logtxt += 'getImage ' + url + ' failed!\n================\n';
    return false;
  }
};

export const checkWP = async (shortcode, username) => {

  let llogtxt = '';
  let skip = false;
  // check if this post has already been added (as either draft, approved or trash)
  // Have to specifically look in trash:
  const resput = await wp.instagramSelfies().auth().param( 'status', 'trash' ).param( 'meta_key', 'shortcode' ).param( 'meta_value', shortcode );
  if (resput && resput.length) {
    console.log('Instagram post ' + shortcode + ' already exists in trash, ' + resput.length + ' time(s)!');
    llogtxt += 'Instagram post ' + shortcode + ' already exists in trash, ' + resput.length + ' time(s)!\n';
    skip = true;
  } 
  // then everywhere else:
  const respu = await wp.instagramSelfies().auth().param( 'status', 'any' ).param( 'meta_key', 'shortcode' ).param( 'meta_value', shortcode );
  if (!skip && respu && respu.length) {
    console.log('Instagram post ' + shortcode + ' already exists (as draft or approved), ' + respu.length + ' time(s)!');
    llogtxt += 'Instagram post ' + shortcode + ' already exists (as draft or approved), ' + respu.length + ' time(s)!\n';
    skip = true;
  }
  // now check if we already have a Gram from this user (draft or approved):
  const resp = await wp.instagramSelfies().auth().param( 'status', 'any' ).param( 'meta_key', 'username' ).param( 'meta_value', username );
  if (!skip && resp && resp.length) {
    console.log(resp.length + ' grams already exist from user: ' + username);
    llogtxt += resp.length + ' grams already exist from user: ' + username + '\n';
    for (const dt of resp) {
      console.log('Wordpress ID: ' + dt.id);
      llogtxt += 'Wordpress ID: ' + dt.id + '\n';
    }
    console.log('================');
    llogtxt += '================\n';
    skip = true;
  }
  const o = {logtxt: llogtxt, skip: skip};
  return o;
}

export default async (hashtag, limit) => {
  
  let dt = new Date().toLocaleString("en-AU", {timeZone: "Australia/Sydney"});
  console.log("\n================\nStarting at " + dt);
  logtxt += "\n================\nStarting at " + dt + '\n';
  
  if (hashtag && (limit > 0)) {
    let count = 0;
    chalkAnimation.rainbow('Accessing Instagram for ' + limit + ' grams ' + ' with #' + hashtag);
      
    const d = await getPostsByHashtag(hashtag);
    if (d) {
      console.log(d.length + ' found');
      logtxt += d.length + ' found\n================\n';
      for (var data of d) {
        if (count < limit) {
          if (data && data.shortcode) {
            const result = await getPost(data.shortcode);
            if (result) { 
              // A post can contain multiple images!
              // Might make getPost return list of images if so.
              // Would have to loop through them all here, or somewhere...



              const biography = await getIgUser(result.username);
              if (biography) {
                const completePost = {
                  ...data,
                  ...result,
                  ...biography,
                };
                const imgBuf = await getImage(data.url);
                if (imgBuf) {

                  console.log(completePost.shortcode);
                  console.log(completePost.username);
                  console.log(completePost.url);
                  logtxt += completePost.shortcode + '\n';
                  logtxt += completePost.username + '\n';
                  logtxt += completePost.url + '\n';
/*
                  try {
                    wpUpload.init({
                      endpoint: process.env.WP_API_ENDPOINT,
                      username: process.env.WP_USERNAME,
                      password: process.env.WP_PASSWORD,
                    });

                    const wp = new WPAPI({
                      endpoint: process.env.WP_API_ENDPOINT,
                      username: process.env.WP_USERNAME,
                      password: process.env.WP_PASSWORD,
                    });

                    wp.instagramSelfies = wp.registerRoute(
                      'wp/v2',
                      '/instagram-selfies/(?P<id>\\d+)',
                    );
*/
                    
                    

                    try {

                      // probably only want ONE selfie per user, so check WP for other images from this user.
                      
                      const chk = await checkWP(completePost.shortcode, result.username);
                      console.log(chk);
                      logtxt += chk.logtxt;
                      let skip = true; // chk.skip;
/*
                      let skip = false;
                      // check if this post has already been added (as either draft, approved or trash)
                      // Have to specifically look in trash:
                      const resput = await wp.instagramSelfies().auth().param( 'status', 'trash' ).param( 'meta_key', 'shortcode' ).param( 'meta_value', completePost.shortcode );
                      if (resput && resput.length) {
                        console.log('Instagram post ' + completePost.shortcode + ' already exists in trash, ' + resput.length + ' time(s)!');
                        logtxt += 'Instagram post ' + completePost.shortcode + ' already exists in trash, ' + resput.length + ' time(s)!\n';
                        skip = true;
                      } 
                      // then everywhere else:
                      const respu = await wp.instagramSelfies().auth().param( 'status', 'any' ).param( 'meta_key', 'shortcode' ).param( 'meta_value', completePost.shortcode );
                      if (!skip && respu && respu.length) {
                        console.log('Instagram post ' + completePost.shortcode + ' already exists (as draft or approved), ' + respu.length + ' time(s)!');
                        logtxt += 'Instagram post ' + completePost.shortcode + ' already exists (as draft or approved), ' + respu.length + ' time(s)!\n';
                        skip = true;
                      }
                      // now check if we already have a Gram from this user (draft or approved):
                      const resp = await wp.instagramSelfies().auth().param( 'status', 'any' ).param( 'meta_key', 'username' ).param( 'meta_value', result.username );
                      if (!skip && resp && resp.length) {
                        console.log(resp.length + ' grams already exist from user: ' + result.username);
                        logtxt += resp.length + ' grams already exist from user: ' + result.username + '\n';
                        for (const dt of resp) {
                          console.log('Wordpress ID: ' + dt.id);
                          logtxt += 'Wordpress ID: ' + dt.id + '\n';
                        }
                        console.log('================');
                        logtxt += '================\n';
                        skip = true;
                      }
*/

                      if (!skip) {
                        console.log('Upload to WP API');
                        logtxt += 'Upload to WP API\n';
                    //    console.log(completePost);
                        logtxt += await wpUpload.upload(
                          {
                            type: 'instagram',
                            title: ( completePost.name ? completePost.name : 
                              (completePost.username ? completePost.username : 
                              (completePost.shortcode ? completePost.shortcode : completePost.timestamp) ) ),
                            slug: completePost.shortcode,
                            content: completePost.desc,
                            status: 'draft', // 'publish', // use draft maybe, until they are moderated???? XXX XXXX
                            meta: {
                              shortcode: completePost.shortcode,
                              username: completePost.username,
                              timestamp: completePost.timestamp,
                              location: ( completePost.location ? completePost.location : '' ),
                              locationSlug: ( completePost.locationSlug ? completePost.locationSlug : '' ),
                              locationId: ( completePost.locationId ? completePost.locationId : '' ),
                              userDescription: ( completePost.biography ? completePost.biography : '' ),
                            },
                            blob: imgBuf,
                          },
                          () => {
                            count += 1;
                            console.log(count + ' done.');
                            console.log('---------------');
                            logtxt += count + ' done.\n---------------\n';
                          },
                        );

                      }
                    } catch (error) {
                      console.error(error);
                    }
 /*
                  } catch (e) {
                    console.log('WP API upload failed!');
                    console.log(e);
                    logtxt += 'WP API upload failed!\n' + e + '\n';
                  }
*/                  
                }
              }
            }
          }
        }
      }
      // loop complete
      console.log('');
      console.log('-=-=-=-=-=-=-=-=-=-=-=-=-');
      console.log('COMPLETE!!');
      console.log(limit + ' requested');
      console.log(d.length + ' found');
      console.log(count + ' uploaded');
      let dte = new Date().toLocaleString("en-AU", {timeZone: "Australia/Sydney"});
      console.log("Started at " + dt);
      console.log("Completed at " + dte);
      console.log('-=-=-=-=-=-=-=-=-=-=-=-=-');
      console.log('');
      logtxt += '\n-=-=-=-=-=-=-=-=-=-=-=-=-\nCOMPLETE!!\n' + limit + ' requested\n';
      logtxt += d.length + ' found\n' + count + ' uploaded\nStarted at ' + dt;
      logtxt += '\nCompleted at ' + dte + '\n-=-=-=-=-=-=-=-=-=-=-=-=-\n';

    } else {
      console.log('No data from instagram!');
      logtxt += 'No data from instagram!\n';
      
//      return { log: log, err: err };
    }
  } else {
    console.log('No hashtag provided or count less than zero.');
    logtxt += 'No hashtag provided or count less than zero.\n';
  }


  function twoDigit(n) { return (n < 10 ? '0' : '') + n; }

  const now = new Date();
  const yyyymmdd = '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate());

  fs.appendFile('log/' + yyyymmdd + '.txt', logtxt, function (err) {
    if (err) return console.log(err);
  });

};
