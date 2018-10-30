# DX Lab #NewSelfWales

DX Lab Gallery and Photobooth experience for State Library of NSW's Selfie campaign.

This repo contains other projects relating to #NewSelfWales

* `scraper` - `dxlab-newselfwales-scraper`
* `cronjob` - `dxlab-newselfwales-cronjob`

## ENV Variables

Save a .env with the following:

```
PORT=5020
BASE_URL=http://localhost:5020

GRAPHQL_URL=http://localhost:5000/graphql
GRAPHQL_HOST=http://localhost:5000
GRAPHQL_SUBSCRIPTIONS_URL=ws://localhost:5000/subscriptions

WP_API_ENDPOINT=https://local.dxlab.sl.nsw.gov.au/selfie/wp-json
WP_USERNAME=XXXXXXXXXX
WP_PASSWORD=XXXXXXXXXX

FB_APP_ID=XXXXXXXXXX
GOOGLE_ANALYTICS_ID=XXXXXXXXXX

HC_DEV_URL=https://hc-ping.com/XXXXXXXXXXXXXXXX
HC_DEV_INTERVAL=300000

HC_LEFT_URL=https://hc-ping.com/XXXXXXXXXXXXXXXX
HC_LEFT_INTERVAL=300000

HC_RIGHT_URL=https://hc-ping.com/XXXXXXXXXXXXXXXX
HC_RIGHT_INTERVAL=300000
```

Save a `.env.staging` and `.env.production` file for staging and production deploys respectively.

## Gallery Experience

`/gallery`

### ImageFeed Loop

The ImageFeed loop ticks every 10 seconds. It kicks off after the first `FETCH_IMAGES`.

#### A. Initial Fetch

1. ImageFeedContainer: On first mount, `FIRST_FETCH_IMAGES` into `currentImages` and `spareImages`.
2. ImageFeed: Receive images and start loop interval.

#### B. Fetch Loop

1. ImageFeed: On loop interval, check `emptyGap`, working out if new images need to be fetched. If `emptyGap` is higher than `loadMoreGap` threshold, send `FETCH_IMAGES` and specify how many. (If not, send `HIDE_IMAGE` and got back to `B1.`).
2. ImageFeedReducer: When ready, store images in `currentFetchedImages` and `spareImages`, then update status to `FETCHED_IMAGES_READY` for ImageFeed.
3. ImageFeed: On loop interval, check `isLayingOut`. If `true`, skip. If `false`, send `MOVE_FETCHED_TO_CURRENT_IMAGES`.
4. Reducer transfers X amount of images from `currentFetchedImages` to `currentImages`.
5. ImageFeed: Receives images and animates them in.
6. Back to `B1.`.

#### C. Max Images Reached Loop

1. ImageFeed: On loop interval, if `images` amount is greater than `maxImages`, send `MAX_IMAGES_REACHED`.
2. ImageFeedContainer: This should trigger `FETCH_UPCOMING_IMAGES` using `startImages` amount into `upcomingImages`.
3. ImageFeedContainer: When ready, send `UPCOMING_IMAGES_READY` to ImageFeed.
4. ImageFeed: On loop interval, check `emptyGap`. If it is greater than `loadMoreGap`, run `hideAllImages` internally and trigger hide images animation.
5. ImageFeed: On animate out end, send `CLEAR_CURRENT_IMAGES` and then `GET_UPCOMING_IMAGES`.
6. Go to `B4.`.

#### D. Spare Images Loop

1. ImageFeed: On loop interval, if `emptyGap` is larger than 50% of the viewport, we aren't getting images quickly enough, so we need to recycle spare images. Send `GET_SPARE_IMAGES` and specify how many. (IN PROGRESS)
2. Reducer transfers X amount of random `spareImages` into `currentImages`.
3. Go to `B1.`.

#### E. Network Error Loop

1. ImageFeed: On loop interval, if there is a network error, dispatch `COPY_SPARE_IMAGES_TO_CURRENT` or `COPY_SPARE_IMAGES_TO_UPCOMING`.

### Hardware Notes

* Projectors should turn on before PC to ensure mosaic mode is active on startup
* Unplug mouse to ensure pointer is not visible on screen
* Startup loads Chrome in full screen kiosk mode

# TODO

* [] Add noindex if accessing from domain other than dxlab.sl.nsw.gov.au
* [] Fix use of absolute `dxlab.sl.nsw.gov.au` URL in fonts.css. To load our app styles, we need to use `dxlab-selfie.now.sh/static/styles.css`. If using relative URL when loading font and app is run from `dxlab.sl.nsw.gov.au/newselfwales`, cross origin errors will occur. Loading `styles.css` outside of `dxlab.sl.nsw.gov.au` is necessary because `nextcss` only outputs to `/static/styles.css`. App is proxied from `dxlab.sl.nsw.gov.au`, so this path is already taken. Need to work out how to get `nextcss` to output `styles.css` to custom dir!
* [] Reconsider use of BASE_URL=dxlab.now.sh, considering that this site gets proxied to dxlab.sl.nsw.gov.au
