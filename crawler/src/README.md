## Purpose

Crawler tries to exhaustively fetch all data from the backend.
It will try to search backwards from starting block until the beginning of the chain and querying data for blocks,
transactions and addresses on the way.

## Running

- Ensure your backend is running in dev mode
- run `node src/index [--backend=http://localhost:4000] [--workers=10] [--start-block=27000000]`
