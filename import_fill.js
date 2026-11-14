// Imports a teacher's pasted replies into a validated table set.
// Usage: node import_fill.js <setName> <reply1.txt> [reply2.txt reply3.txt]
//   Writes tables/<setName>/T*.csv (designer tables T1, T11 copied from tables/rules)
//   and tables/<setName>/import_report.md. Exits non-zero if any row is missing or illegal.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { TABLE_BY_ID, TABLES, loadTable, normalise, fileName } from './engine.js';
import { PASTES, packRows } from './gen_prompt_pack.js';

const TEACHER = PASTES.flat();

// Light, transparent normalisation only (case, quotes, apostrophes, spacing, +1 sign).
export function cleanCell(x) {
  let s = x.trim().replace(/^["'`]+|["'`]+$/g, '').replace(/[‘’ʼ]/g, "'").replace(/\s+/g, ' ').toLowerCase();
  if (s === 'dont' || s === 'do not') s = "don't";
  if (s === '1') s = '+1';
  if (s === '−1' || s === '–1') s = '-1';
  return s;
}

export function importReplies(texts) {
  const got = {}; // row_id -> cells
  const notes = [];
  for (const text of texts) {
    for (const raw of text.replace(/\r/g, '').split('\n')) {
      const line = raw.trim().replace(/^\|/, '').replace(/\|$/, '');
      const m = line.match(/^\s*["'`]?(T\d{1,2}-\d{2})["'`]?\s*,(.*)$/i);
      if (!m) continue;
      const id = m[1].toUpperCase();
      const cells = m[2].split(',').map(cleanCell);
      if (got[id]) notes.push(`duplicate ${id} (kept the first)`); else got[id] = cells;
    }
  }
  const maps = {}, problems = [];
  for (const tid of TEACHER) {
    const t = TABLE_BY_ID[tid];
    const map = new Map();
    for (const [id, ...inp] of packRows(tid)) {
      const cells = got[id];
      if (!cells) { problems.push(`${id}: missing`); continue; }
      const ni = t.inputs.length, no = t.outputs.length;
      if (cells.length !== ni + no) { problems.push(`${id}: expected ${ni + no} cells after row_id, got ${cells.length}: ${cells.join(',')}`); continue; }
      const givenInputs = cells.slice(0, ni);
      if (givenInputs.join('|') !== inp.join('|')) notes.push(`${id}: inputs were altered in the reply (${givenInputs.join('|')}); used the pack's inputs`);
      map.set(inp.join('|'), cells.slice(ni));
    }
    maps[tid] = map;
  }
  return { maps, problems, notes, rowsFound: Object.keys(got).length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [name, ...files] = process.argv.slice(2);
  if (!name || !files.length) { console.log('Usage: node import_fill.js <setName> <reply files...>'); process.exit(2); }
  const { maps, problems, notes, rowsFound } = importReplies(files.map(f => readFileSync(f, 'utf8')));
  const dir = `tables/${name}`;
  mkdirSync(dir, { recursive: true });
  for (const tid of ['T1', 'T11']) copyFileSync(`tables/rules/${fileName(TABLE_BY_ID[tid])}`, `${dir}/${fileName(TABLE_BY_ID[tid])}`);
  for (const tid of TEACHER) {
    const t = TABLE_BY_ID[tid];
    const text = normalise(t, maps[tid]);
    writeFileSync(`${dir}/${fileName(t)}`, text);
    const r = loadTable(t, text, true);
    for (const e of r.errors) problems.push(e);
  }
  const report = `# Import report: ${name}\n\nRows found: ${rowsFound} of 240\n\n## Problems (${problems.length})\n${problems.map(p => '- ' + p).join('\n') || '- none'}\n\n## Notes (${notes.length})\n${notes.map(p => '- ' + p).join('\n') || '- none'}\n`;
  writeFileSync(`${dir}/import_report.md`, report);
  console.log(report);
  process.exitCode = problems.length ? 1 : 0;
}
