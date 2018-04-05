import WPAPI from 'wpapi';

const wpUpload = {
	init: () => {
		this.wp = new WPAPI({
			endpoint: 'https://local.dxlab.sl.nsw.gov.au/selfie/wp-json',
			username: 'upload',
			password: 'djYU05v5gy0T',
		});
		this.wp.gallerySelfies = this.wp.registerRoute(
			'wp/v2',
			'/gallery-selfies/(?P<id>\\d+)',
		);
	},
	upload: async (data, callback) => {
		try {
			const d = new Date();
			const n = 'selfie' + d.getTime();
			// now create custom post type 'gallery selfie'

			const newPost = await this.wp.gallerySelfies().create({
				title: 'New post ' + n,
				content: data.content,
				status: 'publish',
				meta: {
					email: data.email,
					name: data.name,
				},
			});

			const newImage = await this.wp
				.media()
				.file(data.blob, n + '.png')
				.create({
					title: n,
					alt_text: n,
					caption: n,
					description: n,
				});

			const updatePost = await this.wp
				.gallerySelfies()
				.id(newPost.id)
				.update({
					featured_media: newImage.id,
				});
			if (typeof callback === 'function') {
				callback();
			}
			console.log(
				'Upload complete, new ID: ' +
					newPost.id +
					' new ImageID: ' +
					newImage.id,
			);
		} catch (e) {
			console.log(e);
		}
	},
};

export default wpUpload;
