# Australian Weather Stations Map

An interactive map of active Bureau of Meteorology weather stations across Australia, built with Leaflet.js and OpenStreetMap — no API keys required.

![Map showing clustered weather station markers across Australia](https://github.com/user-attachments/assets/placeholder)

## What it does

- Displays **6,317 active weather stations** on an interactive map
- Clusters nearby markers at low zoom levels for readability
- Click any marker for station details: site ID, state, coordinates, elevation, WMO number
- Filter by state using the dropdown

Closed stations (those with a recorded end date) are intentionally excluded.

## Quick start

```bash
npm start
```

Then open **http://localhost:3000** in your browser.

> The map fetches data at runtime so it must be served over HTTP — opening `index.html` directly as a `file://` URL won't work.

## Data pipeline

The `stations.txt` source file (from BOM) is converted in two steps:

```bash
npm run convert
```

This runs:
1. `txt-to-json.js` — parses the fixed-width BOM format into `output/stations.json`
2. `json-to-kml.js` — generates `output/stations.kml` for use in Google Earth or Google Maps (My Maps → Import)

Pre-converted output files are included in the repo so you can run the map without the conversion step.

## Data source

Station data sourced from the [Australian Bureau of Meteorology](http://www.bom.gov.au/) — product IDCJMC0014.

© Commonwealth of Australia, Bureau of Meteorology (ABN 92 637 533 532)
