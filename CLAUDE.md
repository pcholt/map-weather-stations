# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run convert        # parse stations.txt → output/stations.json → output/stations.kml
npm run txt-to-json    # step 1 only: stations.txt → output/stations.json
npm run json-to-kml    # step 2 only: output/stations.json → output/stations.kml
npm start              # serve the project locally with npx serve (opens on http://localhost:3000)
```

## Architecture

This is a zero-dependency Node.js (ESM) project with three concerns:

**Data pipeline** (`txt-to-json.js` → `json-to-kml.js`): `stations.txt` is a fixed-width BOM file (~19,500 rows). `txt-to-json.js` parses it into `output/stations.json` using hardcoded byte-offset column slices. `json-to-kml.js` reads that JSON and writes `output/stations.kml`. Missing values in the source are represented as `..` and normalised to `null`.

**Map display** (`index.html`): A single-file Leaflet.js app loaded from CDN. It fetches `output/stations.json` at runtime (requires the local server — `file://` won't work due to CORS). Only active stations (`end === null`) are shown. `leaflet.markercluster` handles clustering.

## Key data facts

- Active stations (no `end` year): ~6,317 — these are the only ones shown on the map
- Fixed-width column offsets in `stations.txt` are documented in `txt-to-json.js` as the `COLS` constant
- `..` in the source file means unknown/null for all fields
- The file uses Windows line endings (`\r\n`); `readline` with `crlfDelay: Infinity` handles this
