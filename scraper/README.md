# DX Lab Selfie Scraper

Scrape data from Instagram and SLNSW (via GraphQL).

## Usage

```
# To scrape SLNSW data via GraphQL, use this command:
npm run scrape-record -- [primoId]

# eg.
npm run scrape-record -- ADLIB110002321
```

## Tests

Highly suggest running this test driven development style.

```
$ npm run test:watch
# Or
$ npm run test
```

## Getting Started

```
$ npm install
# Add .env file
```

### Environment Variables

Save a .env with the following:

```
WP_API_ENDPOINT=https://local.dxlab.sl.nsw.gov.au/selfie/wp-json
WP_USERNAME=XXXXXXXXXX
WP_PASSWORD=XXXXXXXXXX
GRAPHQL_URL=https://dxlab-staging-graphql-proxy.now.sh/graphql
```

When running `npm run dev`, `npm run test` or `npm run test:watch`, `.env` file is loaded as part of command using `-r dotenv/config`.

Staging/production environment variables are located in `serverless.env.yml`.
