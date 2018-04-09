# DX Lab Selfie Scraper

Scrape data from Instagram and SLNSW (via GraphQL).

## Usage

```
# To scrape SLNSW data via GraphQL, use this command:
npm run scrape-slnsw -- [primoId]
# eg.
npm run scrape-slnsw -- SLNSW_ALMA21124805750002626
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
# Add .env file first
$ npm run build # First time only
$ npm run dev # Starts Webpack watch and node-dev
```

### Environment Variables

Create a `.env` file with:

```
PORT=6010
# Other vars
```

When running `npm run dev`, `npm run test` or `npm run test:watch`, `.env` file is loaded as part of command using `-r dotenv/config`.

Staging/production environment variables are located in `serverless.env.yml`.
