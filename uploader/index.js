const WPAPI = require('wpapi');

const wpUpload = {
	init: function({ endpoint, username, password }) {
		this.wp = new WPAPI({
			endpoint,
			username,
			password,
		});
		this.wp.gallerySelfies = this.wp.registerRoute(
			'wp/v2',
			'/gallery-selfies/(?P<id>\\d+)',
		);
		this.wp.instagramSelfies = this.wp.registerRoute(
			'wp/v2',
			'/instagram-selfies/(?P<id>\\d+)',
		);
		this.wp.portraits = this.wp.registerRoute(
			'wp/v2',
			'/portraits/(?P<id>\\d+)',
		);
	},
	upload: async function(data, callback) {
		try {
			let logtxt = '';
			const nl = '\n';
			const d = new Date();
			const n = 'selfie' + d.getTime();
			let newPost = null;
			let postType;
			console.log(`Post type: ${data.type}`);
			logtxt += `Post type: ${data.type}`;
			logtxt += nl;
			switch (data.type) {
				case 'gallery':
					postType = this.wp.gallerySelfies();
					// create custom post type 'gallery selfie'
					newPost = await this.wp.gallerySelfies().create({
						title: 'New post ' + n,
						content: data.content,
						status: data.status,
						meta: {
							email: data.email,
							name: data.name,
						},
					});
					break;
				case 'instagram':
				//	console.log(JSON.stringify(data));
					postType = this.wp.instagramSelfies();
					// create custom post type 'instagram selfie'
					newPost = await this.wp.instagramSelfies().create({
						title: data.title,
						slug: data.meta.shortcode,
						content: data.content,
						status: data.status,
						meta: {
							shortcode: data.meta.shortcode,
							username: data.meta.username,
							timestamp: data.meta.timestamp.toString(),
							location: data.meta.location,
							location_slug: data.meta.locationSlug,
							location_id: data.meta.locationId,
							user_description: data.meta.userDescription,
						},
					});
					break;
				case 'portrait':
					postType = this.wp.portraits();
					// create custom post type 'portrait'
					newPost = await this.wp.portraits().create({
						title: data.title,
						slug: data.primoRef,
						content: data.description, // imploded list of subjects and topics
						status: data.status,
						meta: {
							date_text: data.dateText,
							name: data.name,
							archive_notes: data.archiveNotes,
							primo_ref: data.primoRef,
							dig_id: data.digId,
						},
					});
					break;
				default:
					break;
			}

			if (newPost) {

				// next upload the image
				let newImage;
				if (data.type == 'portrait') {
					// console.log(data.blob);
					newImage = await this.wp
						.media()
						.file(data.blob, n + '.png')
						.create({
							title: n,
							alt_text: n,
							caption: n,
							description: n,
						});					

				} else {
					// console.log(data.blob);
					newImage = await this.wp
						.media()
						.file(data.blob, n + '.jpg') // data.filename)
						.create({
							title: n,
							alt_text: n,
							caption: n,
							description: n,
						});					

				}


				// now update the CPT to have the image as it's Featured Media
				const updatePost = await postType.id(newPost.id).update({
					featured_media: newImage.id,
				});

				// lastly run the callback
				if (typeof callback === 'function') {
					callback();
				}

				// log results
				console.log(
					'Upload complete, new ID: ' +
						newPost.id +
						' new ImageID: ' +
						newImage.id,
				);
				logtxt += 'Upload complete, new ID: ' +
						newPost.id +
						' new ImageID: ' +
						newImage.id +nl;
			} else {
				console.log('No custom post type!!');
			}
			return logtxt;
		} catch (e) {
			console.log(e);
		}
	},
};

module.exports = wpUpload;
