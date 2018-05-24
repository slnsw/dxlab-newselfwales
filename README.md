# DX Lab Selfie

DX Lab Gallery and Photobooth experience for State Library of NSW's Selfie campaign.

## ENV Variables

Save a .env with the following:

```
PORT=5020
BASE_URL=http://localhost:5020
WP_API_ENDPOINT=https://local.dxlab.sl.nsw.gov.au/selfie/wp-json
WP_USERNAME=XXXXXXXXXX
WP_PASSWORD=XXXXXXXXXX
FB_APP_ID=XXXXXXXXXX
GOOGLE_ANALYTICS_ID=XXXXXXXXXX
```

Save a `.env.staging` and `.env.production` file for staging and production deploys respectively.

# TODO

* [] Add noindex if accessing from domain other than dxlab.sl.nsw.gov.au
* [] Rename to dxlab-newselfwales
* [] Fix use of absolute `dxlab.sl.nsw.gov.au` URL in fonts.css. To load our app styles, we need to use `dxlab-selfie.now.sh/static/styles.css`. If using relative URL when loading font and app is run from `dxlab.sl.nsw.gov.au/newselfwales`, cross origin errors will occur. Loading `styles.css` outside of `dxlab.sl.nsw.gov.au` is necessary because `nextcss` only outputs to `/static/styles.css`. App is proxied from `dxlab.sl.nsw.gov.au`, so this path is already taken. Need to work out how to get `nextcss` to output `styles.css` to custom dir!
* [] Reconsider use of BASE_URL=dxlab.now.sh, considering that this site gets proxied to dxlab.sl.nsw.gov.au
* [] Set up staging server
