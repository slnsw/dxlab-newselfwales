import imageFeedReducer from '../reducers/imageFeedReducer';

describe('Image Feed', () => {
	it('', () => {
		const initialState = {
			isLoading: false,
			currentFetchedImages: [],
			currentImages: initialData,
			upcomingImages: initialData,
			spareImages: [],
			status: 'FIRST_CURRENT_IMAGES',
			maxSpareImages: 15,
			maxUpcomingImages: 15,
		};

		const action = {
			type: 'IMAGE_FEED_GET_SUBSCRIBED_IMAGES',
			payload: {
				data: {
					onSendControl: {
						value: JSON.stringify(data),
					},
				},
			},
		};

		const state = imageFeedReducer(initialState, action);

		expect(state.upcomingImages.length).toBe(15);
		expect(state.upcomingImages[0].id).toBe(initialData[5].id);
		expect(state.spareImages.length).toBe(15);
		expect(state.spareImages[0].id).toBe(initialData[5].id);
	});
});

const data = [
	{
		id: 13107,
		title: 'Jane Penelope Atkinson, 1832 / painted by Richard Read Junior',
		date: '2018-04-18T04:46:52',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1524026812013.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1524026812013-275x300.jpg',
					width: 275,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1524026812013.jpg',
					width: 3210,
					height: 3500,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesPortrait',
	},
	{
		id: 68519,
		title: 'Amanda Mushrooms',
		date: '2018-09-04T13:29:54',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/09/selfie-1536024082538-.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/09/selfie-1536024082538--300x300.jpg',
					width: 300,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/09/selfie-1536024082538-.jpg',
					width: 1080,
					height: 1080,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesInstagramSelfie',
	},
	{
		id: 16344,
		title: 'Miss Barry',
		date: '2018-04-18T08:11:45',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1524039105239.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1524039105239-221x300.jpg',
					width: 221,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1524039105239.jpg',
					width: 774,
					height: 1050,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesPortrait',
	},
	{
		id: 78400,
		title: 'New post selfie 1539408677833',
		date: '2018-10-13T15:31:18',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/10/selfie-1539408677833.png',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/10/selfie-1539408677833-300x300.png',
					width: 300,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/10/selfie-1539408677833.png',
					width: 1080,
					height: 1080,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesGallerySelfie',
	},
	{
		id: 23077,
		title: 'Mr Allen',
		date: '2018-04-30T06:35:19',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1525070120133.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1525070120133-233x300.jpg',
					width: 233,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1525070120133.jpg',
					width: 817,
					height: 1050,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesPortrait',
	},
	{
		id: 29568,
		title: 'Miss Taylor',
		date: '2018-05-03T06:34:09',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/05/selfie1525329250250.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/05/selfie1525329250250-224x300.jpg',
					width: 224,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/05/selfie1525329250250.jpg',
					width: 784,
					height: 1050,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesPortrait',
	},
	{
		id: 78959,
		title: 'New post selfie 1539562415539',
		date: '2018-10-15T10:13:35',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/10/selfie-1539562415539.png',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/10/selfie-1539562415539-300x300.png',
					width: 300,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/10/selfie-1539562415539.png',
					width: 1080,
					height: 1080,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesGallerySelfie',
	},
	{
		id: 67250,
		title:
			'Sydney Town street portraits, March 2014-August 2015 / photographs by Jon Lewis',
		date: '2018-09-03T14:16:03',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/08/selfie-1535681577769-.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/08/selfie-1535681577769--300x200.jpg',
					width: 300,
					height: 200,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/08/selfie-1535681577769-.jpg',
					width: 500,
					height: 333,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesPortrait',
	},
	{
		id: 23183,
		title: 'Miss Cullen',
		date: '2018-04-30T06:51:17',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1525071078169.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1525071078169-229x300.jpg',
					width: 229,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1525071078169.jpg',
					width: 801,
					height: 1050,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesPortrait',
	},
	{
		id: 76290,
		title: 'Simon Leong',
		date: '2018-10-08T09:34:02',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/10/selfie-1538949603528-.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/10/selfie-1538949603528--300x300.jpg',
					width: 300,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/10/selfie-1538949603528-.jpg',
					width: 640,
					height: 640,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesInstagramSelfie',
	},
];

const initialData = [
	{
		id: 69214,
		title: 'abbey',
		date: '2018-09-10T10:01:22',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/09/selfie-1536318716539-.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/09/selfie-1536318716539--300x300.jpg',
					width: 300,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/09/selfie-1536318716539-.jpg',
					width: 1080,
					height: 1080,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesInstagramSelfie',
	},
	{
		id: 75753,
		title: 'New post selfie 1538803825984',
		date: '2018-10-06T15:30:26',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/10/selfie-1538803825984.png',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/10/selfie-1538803825984-300x300.png',
					width: 300,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/10/selfie-1538803825984.png',
					width: 1080,
					height: 1080,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesGallerySelfie',
	},
	{
		id: 22941,
		title: 'Mrs Giles (possibly Sarah Giles, nee Noble)',
		date: '2018-04-30T06:15:49',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1525068950655.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1525068950655-226x300.jpg',
					width: 226,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1525068950655.jpg',
					width: 790,
					height: 1050,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesPortrait',
	},
	{
		id: 9243,
		title:
			'NSW servicemen portraits, 1918-19 &#8211; Lachlan McGilvray Sutherland',
		date: '2018-04-16T16:31:16',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1523896276479-e1536713655774.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1523896276479-e1536713655774-179x300.jpg',
					width: 179,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1523896276479-e1536713655774.jpg',
					width: 548,
					height: 916,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesPortrait',
	},
	{
		id: 16350,
		title: 'Mrs Nichols',
		date: '2018-04-18T08:12:09',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1524039129483.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1524039129483-226x300.jpg',
					width: 226,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/04/selfie1524039129483.jpg',
					width: 791,
					height: 1050,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesPortrait',
	},
	{
		id: 44951,
		title: 'Mr Penney and girl',
		date: '2018-05-09T07:07:08',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/05/selfie1525849628489.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/05/selfie1525849628489-225x300.jpg',
					width: 225,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/05/selfie1525849628489.jpg',
					width: 788,
					height: 1050,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesPortrait',
	},
	{
		id: 66398,
		title: 'Bill Johnstone, March 1952',
		date: '2018-09-03T15:45:41',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/08/selfie-1535621188534-.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/08/selfie-1535621188534--230x300.jpg',
					width: 230,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/08/selfie-1535621188534-.jpg',
					width: 804,
					height: 1050,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesPortrait',
	},
	{
		id: 67340,
		title:
			'Album of portraits collected by John William Richard Clarke, ca.1866-1909',
		date: '2018-09-03T14:15:30',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/08/selfie-1535681641756-.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/08/selfie-1535681641756--197x300.jpg',
					width: 197,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/08/selfie-1535681641756-.jpg',
					width: 691,
					height: 1050,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesPortrait',
	},
	{
		id: 69810,
		title: 'Cathy Xu',
		date: '2018-09-10T09:51:55',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/09/selfie-1536442069360-.jpg',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/09/selfie-1536442069360--300x225.jpg',
					width: 300,
					height: 225,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/09/selfie-1536442069360-.jpg',
					width: 1080,
					height: 809,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesInstagramSelfie',
	},
	{
		id: 83931,
		title: 'New post selfie 1541131531086',
		date: '2018-11-02T15:05:31',
		featuredMedia: {
			sourceUrl:
				'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/11/selfie-1541131531086.png',
			sizes: {
				medium: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/11/selfie-1541131531086-300x300.png',
					width: 300,
					height: 300,
					__typename: 'MediaSize',
				},
				full: {
					sourceUrl:
						'https://newselfwales.dxlab.sl.nsw.gov.au/app/uploads/sites/2/2018/11/selfie-1541131531086.png',
					width: 1080,
					height: 1080,
					__typename: 'MediaSize',
				},
				__typename: 'MediaSizes',
			},
			__typename: 'Media',
		},
		__typename: 'NewSelfWalesGallerySelfie',
	},
];
