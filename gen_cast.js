// Writes cast/cast_s<castSeed>_n<n>.csv (spec A9). Default: castSeed 1, n 20.
import { writeFileSync, mkdirSync } from 'node:fs';
import { generateCast, castCsv } from './engine.js';

const castSeed = parseInt(process.argv[2] || '1', 10);
const n = parseInt(process.argv[3] || '20', 10);
mkdirSync('cast', { recursive: true });
const path = `cast/cast_s${castSeed}_n${n}.csv`;
writeFileSync(path, castCsv(generateCast(castSeed, n)));
console.log(`Wrote ${path}`);
