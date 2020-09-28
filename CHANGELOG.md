# Changelog

## [1.0.8] - 2020-9-28

- Update cronjob and Readme

## [1.0.7] - 2020-3-09

- Now v2 no longer uses server.js files, so need to refactor SSR page routes to Next JS dynamic routes eg. `[id].js`
- Update `pages/photo-booth` `handleImageClick`

## [1.0.6] - 2020-3-09

- Update to Next 9.2
- Update React
- Update now.json and now.staging.json with routes to assets
- Update package.json deploy scripts
- Add `now.json` file to cronjob

## [1.0.5] - 2020-3-09

- Migrate to Now 2.0
- Add `now.json` and `now.staging.json`
- Update env vars to have prefix of `NEWSELFWALES_`
- Update `prettier` to stop Code IDE nagging

## [1.0.4] - 2020-3-09

- Update Apollo packages, prepare for switch to Serverless GraphQL
- Update apollo subscription connection
- Update cronjob GraphQL api
- Add healthcheck to cronjob

## [1.0.1] - 2019-2-20

### Added

- Keyboard access to SearchResults ImageModal

## [1.0.0] - 2019-2-20

### Changed

- Re-architected ImageFeedContainer to use subscriptions feed
- Added dxlab-newselfwales-cronjob sub package
- Online website /newselfwales updated with search feature

## [0.2.10] - 2018-12-04

### Changed

- Start changelog!
- Added Healthcheck
- Change Gallery selfie to update WP content field as well as name field
