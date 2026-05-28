import { createReadStream, mkdirSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Fixed-width column definitions: [start, end] (end is exclusive)
const COLS = {
  site:      [0,   7],
  dist:      [8,   13],
  name:      [14,  54],
  start:     [55,  62],
  end:       [63,  70],
  lat:       [71,  79],
  lon:       [80,  89],
  source:    [90,  104],
  state:     [105, 108],
  height:    [109, 119],
  barHeight: [120, 128],
  wmo:       [129, 135],
};

function col(line, [start, end]) {
  return line.slice(start, end).trim();
}

function num(val) {
  if (val === '..' || val === '') return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

function year(val) {
  if (val === '..' || val === '') return null;
  const n = parseInt(val, 10);
  return isNaN(n) ? null : n;
}

// Data lines start with a space then 6 digits
const DATA_LINE = /^ \d{6}/;

const stations = [];

const rl = createInterface({
  input: createReadStream(join(__dirname, 'stations.txt')),
  crlfDelay: Infinity,
});

rl.on('line', (raw) => {
  if (!DATA_LINE.test(raw)) return;

  stations.push({
    site:      col(raw, COLS.site),
    dist:      col(raw, COLS.dist),
    name:      col(raw, COLS.name),
    start:     year(col(raw, COLS.start)),
    end:       year(col(raw, COLS.end)),
    lat:       num(col(raw, COLS.lat)),
    lon:       num(col(raw, COLS.lon)),
    source:    col(raw, COLS.source),
    state:     col(raw, COLS.state),
    height:    num(col(raw, COLS.height)),
    barHeight: num(col(raw, COLS.barHeight)),
    wmo:       col(raw, COLS.wmo) === '..' ? null : col(raw, COLS.wmo) || null,
  });
});

rl.on('close', () => {
  mkdirSync(join(__dirname, 'output'), { recursive: true });
  const out = { count: stations.length, stations };
  writeFileSync(join(__dirname, 'output', 'stations.json'), JSON.stringify(out, null, 2));
  console.log(`Wrote ${stations.length} stations to output/stations.json`);
});
