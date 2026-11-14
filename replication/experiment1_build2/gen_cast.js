// gen_cast.js — writes cast/cast_s1_n20.csv (A9).
import fs from 'node:fs';
import { generateCast } from './engine.js';
import { sha256 } from './sha256.js';

const text = generateCast(1, 20);
fs.mkdirSync('cast', { recursive: true });
fs.writeFileSync('cast/cast_s1_n20.csv', text);
console.log(`wrote cast/cast_s1_n20.csv  sha256 ${sha256(text)}`);
