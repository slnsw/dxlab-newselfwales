# DX Lab #NewSelfWales

DX Lab gallery, photobooth and website experience for State Library of NSW's community, self-portrait exhibition.

Read the exhibition blog post - https://dxlab.sl.nsw.gov.au/blog/the-face-of-nsw

See how we built the whole thing - https://dxlab.sl.nsw.gov.au/blog/making-newselfwales

Visit the website - https://dxlab.sl.nsw.gov.au/newselfwales

This repo contains other projects relating to #NewSelfWales

- `scraper` - `dxlab-newselfwales-scraper`
- `cronjob` - `dxlab-newselfwales-cronjob`

> Please note that this public repo is for reference only. There are other parts of the stack that are still private. The code is workable, but by no means perfect! Feel free to learn what you can from this codebase.

## Tech

- [Node JS](https://nodejs.org/en/) - JavaScript runtime
- [React JS](https://reactjs.org/) - User Interface Library
- [Redux](https://redux.js.org/) - State Management
- [Next JS](https://nextjs.org/) - React framework with server side rendering
- [GraphQL](https://graphql.org/) - Next generation API
- [Packery](https://packery.metafizzy.co/) - JS/CSS masonry library
  <<<<<<< HEAD
- # [Zeit Now](https://zeit.co/now) - Serverless cloud hosting platform
- [Vercel](https://vercel.com) - Serverless cloud hosting platform
  > > > > > > > develop

## Getting Started

```bash
# Ensure Node JS is installed
$ npm install

# Make sure .env file is set up (see below)
$ npm run dev
```

### ENV Variables

For local development, save a .env with the following:

```
PORT=5020
NEWSELFWALES_BASE_URL=http://localhost:5020

NEWSELFWALES_GRAPHQL_URL=http://localhost:5000/graphql
NEWSELFWALES_GRAPHQL_SUBSCRIPTIONS_URL=ws://localhost:5000/subscriptions

# Wordpress Credentials
NEWSELFWALES_WP_API_ENDPOINT=https://local.dxlab.sl.nsw.gov.au/selfie/wp-json
NEWSELFWALES_WP_USERNAME=XXXXXXXXXX
NEWSELFWALES_WP_PASSWORD=XXXXXXXXXX

NEWSELFWALES_FB_APP_ID=XXXXXXXXXX
NEWSELFWALES_GTM_ID=XXXXXXXXXX

# Healthcheck Config
NEWSELFWALES_HC_DEV_URL=https://hc-ping.com/XXXXXXXXXXXXXXXX
NEWSELFWALES_HC_DEV_INTERVAL=300000

NEWSELFWALES_HC_LEFT_URL=https://hc-ping.com/XXXXXXXXXXXXXXXX
NEWSELFWALES_HC_LEFT_INTERVAL=300000

NEWSELFWALES_HC_RIGHT_URL=https://hc-ping.com/XXXXXXXXXXXXXXXX
NEWSELFWALES_HC_RIGHT_INTERVAL=300000
```

All `.env*` files are ignored by Git as they contain sensitive data.

## Web App

The main web app runs three sub apps:

- Website
- Selfie Photobooth
- In-gallery Image Feed

These three sub apps all share common React components.

To deploy, run:
`npm run deploy:[stage]`.
Stage can be `dev`, `staging` or `prod`.

### Website

Promo website route is here: `/newselfwales`. The app is proxied to a Zeit Now URL from https://dxlab.sl.nsw.gov.au/newselfwales.

## Selfie Photobooth

There are two photobooths, each with their own route: `/photo-booth/left` and `/photo-booth/right`.

## In-Gallery Image Feed

This can be accessed from this URL: `/gallery`.

The main component for this sub app is `ImageFeedContainer`. This component subscribes to a GraphQL subscription feed that sends new images every 20 seconds. It uses Redux to handle the subscription and data.

### Image Feed Loop

The ImageFeed loop ticks every 10 seconds. It kicks off after `IMAGE_FEED_FETCH_INITIAL_IMAGES`.

The ImageFeed Redux store consists of three image containers:

- `upcomingImages`
- `currentImages`
- `spareImages`

The following describes the rough logic flow of how images are handled in the Image Feed.

#### A. Initial Fetch

1. ImageFeedContainer: On first mount, `IMAGE_FEED_FETCH_IMAGES` into `currentImages` and `spareImages`.
2. ImageFeed: Receive images and start loop interval.

#### B. ImageFeed Subscription

1. imageFeedReducer: Every 20 seconds, `IMAGE_FEED_GET_SUBSCRIBED_IMAGES` is dispatched, new images are added to `upcomingImages` and `spareImages`.
2. imageFeedReducer: Ensure `upcomingImages` doesn't exceed `MAX_UPCOMING_IMAGES` and `spareImages` doesn't exceed `MAX_SPARE_IMAGES`.

#### C. Get Image Loop

1. ImageFeed: On loop interval, check `emptyGap`, working out if new images need to be added. If `emptyGap` is higher than `loadMoreGap` threshold, send `IMAGE_FEED_MOVE_UPCOMING_TO_CURRENT_IMAGES` with X amount of images. (If not, internally hide image/s and go back to `C1.`).
2. ImageFeedReducer: Check if there are enough `upcomingImages` (TODO), if enough, transfer X amount of images from `upcomingImages` to `currentImages`.
3. ImageFeed: Receives images and animates them in.
4. Back to `C1.`.

#### D. Max Images Reached Loop

1. ImageFeed: On loop interval, if `images` amount is greater than `maxImages`, send `IMAGE_FEED_MAX_IMAGES_REACHED`.
2. ImageFeedReducer: Check if there are enough `upcomingImages`. If so, send `IMAGE_FEED_UPCOMING_IMAGES_READY`. If not, go back to D1 (TODO). (May need to dip into `spareImages`).
3. ImageFeed: On loop interval, check `emptyGap`. If it is greater than `loadMoreGap`, run `hideAllImages` internally and trigger hide images animation.
4. ImageFeed: On animate out end, send `IMAGE_FEED_CLEAR_CURRENT_IMAGES` and then send `IMAGE_FEED_GET_UPCOMING_IMAGES` with `startImages` amount.
5. Go to `C3.`.

#### E. Spare Images Loop

1. ImageFeed: On loop interval, if `emptyGap` is larger than 50% of the viewport, we aren't getting images quickly enough, so we need to recycle spare images. Send `IMAGE_FEED_GET_SPARE_IMAGES` and specify how many. (IN PROGRESS)
2. Reducer transfers X amount of random `spareImages` into `currentImages`.
3. Go to `C1.`.

#### F. Network Error Loop

1. ImageFeed: On loop interval, if there is a network error, dispatch `IMAGE_FEED_COPY_SPARE_IMAGES_TO_CURRENT` or `IMAGE_FEED_COPY_SPARE_IMAGES_TO_UPCOMING`.

## Cronjob

Located at `cronjob/`.

This runs a server that hits GraphQL, receives the NewSelfWales feed, and sends it back as a mutation every 20 seconds. The mutation updates all clients that are subscribed to the subscription query. In our case, the `ImageFeedContainer` component will receive new images every 20 seconds. This means that they don't have to poll the server.

```bash
# Local
# Run the server. Make sure GraphQL is running and .env is set up.
$ cd cronjob
$ npm run build
$ npm start

# Production
# Copy cronjob folder to server
# Ensure Node JS is installed
# Create .env file in cronjob folder
# If pm2 is not installed:
$ npm i -g pm2
# Start cronjob
$ npm run start:pm2
```

## Scraper

Located at `scraper/`.

Service that scrapes Instagram for images tagged with #NewSelfWales.

### Hardware Notes

- Projectors should turn on before PC to ensure mosaic mode is active on startup
- Unplug mouse to ensure pointer is not visible on screen
- Startup loads Chrome in full screen kiosk mode
- The photo booth kiosks are expecting a Logitech c920 HD webcab to be attached via USB. The innards of these cameras were enclosed in a 3D-printed custom selfie cam case, along with a big pink arcade button to trigger them.
- The photo booth code listens for a back-tick keypress from a keyboard to trigger the capturing of a still image from the webcam. This is because the arcade button was connected to a small circuit board ( http://www.u-hid.com/home/uhid_nano.php ) which emulates a keyboard. It was also connected via USB and had been pre-programmed to send a back-tick keypress when the arcade button shorted two particular pins.
