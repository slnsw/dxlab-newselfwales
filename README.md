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
