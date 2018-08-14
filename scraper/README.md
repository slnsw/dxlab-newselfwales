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

## Deploying

```
npm run deploy-staging
```
or
```
npm run deploy-production
```

Probably worth running `now ls` to see what is already running.

*IMPORTANT:* Once deployed run these scaling commands - otherwise it runs twice and could fuxk our sh!t up.

`now scale [now.sh URL] bru 0 0` to turn the Brussells insance off, and:
`now scale [now.sh URL] sfo 1 1` to turn the San Fran one on always.
