// Experiment 7 judging: mean believability of each source's answer, per judge, on the 18 disputed moments.
import { readFileSync, writeFileSync } from 'node:fs';
const key = JSON.parse(readFileSync('reports/exp7_judge_key.json', 'utf8'));
const txt = readFileSync('fills/exp7/judges_gpt6_geminiflashlite.txt', 'utf8');
const judges = {}; let cur = null;
for (const l of txt.split(/\r?\n/)) {
  if (/^ChatGPT/i.test(l)) cur = 'gpt6'; else if (/^Gemini/i.test(l)) cur = 'gemini31fl';
  const m = l.match(/^(J\d+),([A-D]),(\d)/); if (m && cur) (judges[cur] ||= {})[`${m[1]}${m[2]}`] = +m[3];
}
judges.geminiThink = {};
for (const l of readFileSync('fills/exp7/judge_gemini_thinkinghigh.txt', 'utf8').split(/\r?\n/)) { const m = l.match(/^(J\d+),([A-D]),(\d)/); if (m) judges.geminiThink[`${m[1]}${m[2]}`] = +m[3]; }
const SRC = ['table', 'rules', 'opus55', 'gpt6'];
const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
const out = {};
for (const [j, sc] of Object.entries({ ...judges, neutral: 'neutral', all: null })) {
  const score = (jid, opt) => j === 'all' ? mean(Object.values(judges).map(s => s[jid + opt])) : j === 'neutral' ? mean([judges.gemini31fl, judges.geminiThink].map(s => s[jid + opt])) : sc[jid + opt];
  const per = {}; for (const s of SRC) per[s] = [];
  const wins = {}; // head-to-head vs table where different
  for (const k of key) for (const [opt, o] of Object.entries(k.options)) for (const s of o.sources) per[s].push(score(k.jid, opt));
  for (const s of ['rules', 'opus55', 'gpt6']) { let w = 0, t = 0, l = 0, d = [];
    for (const k of key) { const ot = Object.entries(k.options).find(([, o]) => o.sources.includes('table'))[0], os = Object.entries(k.options).find(([, o]) => o.sources.includes(s))[0];
      if (ot === os) continue; const a = score(k.jid, os), b = score(k.jid, ot); d.push(a - b); if (a > b) w++; else if (a < b) l++; else t++; }
    wins[s] = { n: d.length, srcBetter: w, tie: t, tableBetter: l, meanDiff: d.length ? mean(d) : 0 }; }
  const best = {}; for (const s of SRC) best[s] = 0; // share of items where source's answer got the top score
  for (const k of key) { const sc2 = Object.fromEntries(Object.keys(k.options).map(o => [o, score(k.jid, o)])); const mx = Math.max(...Object.values(sc2));
    for (const s of SRC) { const o = Object.entries(k.options).find(([, x]) => x.sources.includes(s))[0]; if (sc2[o] === mx) best[s]++; } }
  out[j] = { meanScore: Object.fromEntries(SRC.map(s => [s, mean(per[s])])), topRated: best, vsTable: wins };
}
// judge agreement
const ks = Object.keys(judges.gpt6); const a = ks.map(k => judges.gpt6[k]), b = ks.map(k => judges.gemini31fl[k]);
const ma = mean(a), mb = mean(b); const r = a.reduce((s, x, i) => s + (x - ma) * (b[i] - mb), 0) / Math.sqrt(a.reduce((s, x) => s + (x - ma) ** 2, 0) * b.reduce((s, x) => s + (x - mb) ** 2, 0));
// preferred option agreement per item
let same = 0; for (const k of key) { const top = j => { const e = Object.keys(k.options).map(o => [o, judges[j][k.jid + o]]); const mx = Math.max(...e.map(x => x[1])); return e.filter(x => x[1] === mx).map(x => x[0]).join(''); }; if (top('gpt6') === top('gemini31fl')) same++; }
const corr = (x, y) => { const a = ks.map(k => judges[x][k]), b = ks.map(k => judges[y][k]); const ma = mean(a), mb = mean(b); return a.reduce((s, v, i) => s + (v - ma) * (b[i] - mb), 0) / Math.sqrt(a.reduce((s, v) => s + (v - ma) ** 2, 0) * b.reduce((s, v) => s + (v - mb) ** 2, 0)); };
out.corr = { gpt_flash: corr('gpt6','gemini31fl'), gpt_think: corr('gpt6','geminiThink'), flash_think: corr('gemini31fl','geminiThink') };
out.judgeAgreement = { pearsonR: r, sameTopChoice: same, items: key.length, ratings: ks.length };
writeFileSync('reports/exp7_judging.json', JSON.stringify({ judges, results: out }, null, 1));
console.log(JSON.stringify(out, null, 1));
// per-item view by type
for (const k of key) console.log(k.jid, k.id, k.type, Object.entries(k.options).map(([o, x]) => `${o}=${x.answer}[${x.sources.join('+')}] g${judges.gpt6[k.jid + o]} m${judges.gemini31fl[k.jid + o]}`).join(' | '));
