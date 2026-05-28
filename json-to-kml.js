import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { stations } = JSON.parse(
  readFileSync(join(__dirname, 'output', 'stations.json'), 'utf8')
);

function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function descriptionHtml(s) {
  const rows = [
    ['Site ID', s.site],
    ['District', s.dist],
    ['State', s.state],
    ['Start year', s.start ?? '—'],
    ['End year', s.end ?? 'Active'],
    ['Latitude', s.lat],
    ['Longitude', s.lon],
    ['Height (m)', s.height ?? '—'],
    ['Bar height (m)', s.barHeight ?? '—'],
    ['Source', s.source || '—'],
    ['WMO', s.wmo ?? '—'],
  ];
  const trs = rows.map(([k, v]) =>
    `<tr><td><b>${k}</b></td><td>${esc(String(v))}</td></tr>`
  ).join('');
  return `<table>${trs}</table>`;
}

// Green pin for active stations, grey for closed
const ICON_ACTIVE = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
const ICON_CLOSED = 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png';

const styles = `
  <Style id="active">
    <IconStyle><Icon><href>${ICON_ACTIVE}</href></Icon></IconStyle>
  </Style>
  <Style id="closed">
    <IconStyle><Icon><href>${ICON_CLOSED}</href></Icon></IconStyle>
  </Style>`;

const placemarks = stations
  .filter((s) => s.lat != null && s.lon != null && s.state == 'VIC')
  .map((s) => {
    const styleUrl = s.end == null ? '#active' : '#closed';
    const alt = s.height ?? 0;
    return `
    <Placemark>
      <name>${esc(s.name)}</name>
      <styleUrl>${styleUrl}</styleUrl>
      <Point><coordinates>${s.lon},${s.lat},${alt}</coordinates></Point>
    </Placemark>`;
  })
  .join('');

const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
  <name>Australian Weather Stations</name>
  <description>Bureau of Meteorology weather stations</description>${styles}
  <Folder>
    <name>Australian Weather Stations</name>${placemarks}
  </Folder>
</Document>
</kml>`;

writeFileSync(join(__dirname, 'output', 'stations.kml'), kml);
console.log(`Wrote ${stations.filter((s) => s.lat != null).length} placemarks to output/stations.kml`);
