# Putarr
The bridge between [put.io][put.io] and the *arr apps!

## Config
### Environment Variables

- `PUTARR_TOKEN` or `PUTARR_TOKEN_SECRET`
  - required
  - OAuth token from put.io, or path to secret containing the token
- `PUTARR_PORT`
  - default `8787`
  - port the application will bind to
- `PUTARR_DATA_DIRECTORY`
  - default `/config`
  - directory where the application will save its data to
- `PUTARR_DOWNLOADS_DIRECTORY`
  - default `/downloads`
  - directory where completed downloads will be saved to
- `PUTARR_WATCH_DIRECTORIES`
  - optional
  - comma-separated list of directories to watch for content files

[put.io]: https://put.io
