import WPAPI from 'wpapi';

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
			const d = new Date();
			const n = 'selfie' + d.getTime();
			let newPost = null;
			let postType;

			switch (data.type) {
				case 'gallery':
					postType = this.wp.gallerySelfies();
					// create custom post type 'gallery selfie'
					newPost = await this.wp.gallerySelfies().create({
						title: 'New post ' + n,
						content: data.content,
						status: 'publish',
						meta: {
							email: data.email,
							name: data.name,
						},
					});
					break;
				case 'instagram':
					postType = this.wp.instagramSelfies();
					// create custom post type 'instagram selfie'
					newPost = await this.wp.instagramSelfies().create({
						title: data.name,
						slug: data.shortcode,
						content: data.description,
						status: 'publish',
						meta: {
							shortcode: data.shortcode,
							username: data.username,
							timestamp: data.timestamp,
							location: data.location,
							location_slug: data.locationSlug,
							location_id: data.locationId,
							user_description: data.userDescription,
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
						status: 'publish',
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
				const newImage = await this.wp
					.media()
					.file(data.blob, n + '.png')
					.create({
						title: n,
						alt_text: n,
						caption: n,
						description: n,
					});

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
			} else {
				console.log('No custom post type!!');
			}
		} catch (e) {
			console.log(e);
		}
	},
};

export default wpUpload;
