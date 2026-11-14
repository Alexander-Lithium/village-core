// Builds viewer.html: one self-contained page with engine, hash, tables and cast inlined (spec A14).
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { TABLES, fileName } from './engine.js';

const strip = src => src.replace(/^import .*$/gm, '').replace(/^export /gm, '');
const code = strip(readFileSync('sha256.js', 'utf8')) + '\n' + strip(readFileSync('engine.js', 'utf8'));

const tableSets = {};
for (const d of readdirSync('tables')) {
  if (!statSync(`tables/${d}`).isDirectory()) continue;
  try { tableSets[d] = Object.fromEntries(TABLES.map(t => [t.id, readFileSync(`tables/${d}/${fileName(t)}`, 'utf8')])); } catch { /* incomplete set */ }
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Village Core v1.0 viewer</title>
<style>
:root{--bg:#f6f4ef;--panel:#fffdf8;--ink:#23211c;--muted:#6f6a5e;--line:#ddd7ca;--accent:#2f5d50;
--good:#3f8f5a;--calm:#8a8577;--low:#b4553e;--trust:#2f5d9e;--worth:#a0632c;--effort:#5b7d2f;}
@media (prefers-color-scheme:dark){:root{--bg:#1b1a17;--panel:#24221e;--ink:#ece8de;--muted:#a39d8f;--line:#3a372f;--accent:#7fb8a4;
--good:#6cc08a;--calm:#a39d8f;--low:#e07a62;--trust:#7fa6e6;--worth:#e0a06a;--effort:#9fc46a;}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
header{padding:14px 20px;border-bottom:1px solid var(--line);display:flex;gap:16px;align-items:baseline;flex-wrap:wrap}
header h1{font-size:17px;margin:0;font-weight:650}
header span{color:var(--muted);font-size:13px}
main{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px;padding:16px 20px;max-width:1400px}
@media (max-width:900px){main{grid-template-columns:1fr}}
.card{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px 14px}
.card h2{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:0 0 8px;font-weight:600}
.controls{display:flex;flex-wrap:wrap;gap:10px 14px;align-items:end}
.controls label{display:flex;flex-direction:column;font-size:12px;color:var(--muted);gap:3px}
.controls label.chk{flex-direction:row;align-items:center;gap:6px;color:var(--ink);font-size:13px}
input[type=number],select{font:inherit;padding:5px 7px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--ink);width:88px}
select{width:auto}
button{font:inherit;padding:6px 12px;border-radius:6px;border:1px solid var(--line);background:var(--bg);color:var(--ink);cursor:pointer}
button.primary{background:var(--accent);border-color:var(--accent);color:var(--panel)}
button:disabled{opacity:.5;cursor:default}
.status{font-variant-numeric:tabular-nums;color:var(--muted);font-size:13px;margin-left:auto}
.rooms{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:4px}
.room{border:1px dashed var(--line);border-radius:8px;min-height:120px;padding:8px}
.room h3{margin:0 0 6px;font-size:13px;font-weight:600}
.dots{display:flex;flex-wrap:wrap;gap:5px}
.dot{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;
cursor:pointer;border:2px solid transparent;color:#fff;user-select:none}
.dot.sel{border-color:var(--ink)}
.dot.good{background:var(--good)}.dot.calm{background:var(--calm)}.dot.low{background:var(--low)}
.legend{display:flex;gap:12px;font-size:12px;color:var(--muted);margin-top:8px;flex-wrap:wrap}
.legend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:4px;vertical-align:-1px}
svg text{fill:var(--muted);font-size:11px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
@media (max-width:700px){.grid2{grid-template-columns:1fr}}
table.kv{border-collapse:collapse;width:100%;font-size:13px}
table.kv td{padding:2px 0;vertical-align:top}
table.kv td:first-child{color:var(--muted);width:42%}
.trace{font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--bg);border-radius:6px;padding:6px 8px;
max-height:260px;overflow:auto;white-space:pre-wrap;word-break:break-word}
.hash{font:11px ui-monospace,Menlo,monospace;word-break:break-all;color:var(--muted)}
.side{display:flex;flex-direction:column;gap:16px}
.note{color:var(--muted);font-size:12px}
.bars div{display:flex;align-items:center;gap:6px;font-size:12px;margin:2px 0}
.bars b{display:inline-block;height:9px;background:var(--accent);border-radius:2px}
</style>
</head>
<body>
<header><h1>Village Core v1.0</h1><span>Deterministic compiled-table village · same seed, same run</span></header>
<main>
<section>
 <div class="card">
  <div class="controls">
   <label>Run seed<input id="seed" type="number" value="1" min="1"></label>
   <label>Villagers<select id="n"><option>5</option><option selected>20</option><option>100</option><option>1000</option><option>10000</option></select></label>
   <label>Days<input id="days" type="number" value="30" min="1" max="365"></label>
   <label>Tables<select id="tset"></select></label>
   <label>Table mode<select id="mode"><option value="csv">as loaded</option><option value="shuffled">shuffled (null)</option><option value="random">random (null)</option></select></label>
   <label class="chk"><input id="loopOff" type="checkbox">Loop off</label>
   <label class="chk"><input id="traitsOff" type="checkbox">Traits off</label>
  </div>
  <div class="controls" style="margin-top:10px">
   <button id="reset">New run</button>
   <button id="step">Step 1 hour</button>
   <button id="play">Play</button>
   <button id="runall" class="primary">Run to end</button>
   <span class="status" id="status"></span>
  </div>
 </div>
 <div class="card" style="margin-top:16px" id="roomsCard">
  <h2>Hamlet 1 · where everyone is this hour</h2>
  <div class="rooms" id="rooms"></div>
  <div class="legend"><span><i style="background:var(--good)"></i>good mood</span><span><i style="background:var(--calm)"></i>calm</span><span><i style="background:var(--low)"></i>low mood</span><span>Click a villager to inspect.</span></div>
 </div>
 <div class="grid2">
  <div class="card"><h2>Mean belief position by day</h2><svg id="chartB" viewBox="0 0 420 210" width="100%"></svg>
   <div class="note">−3 = core negative pole … +3 = core positive pole. Trust: people mean well / are against me. Worth: respected / overlooked. Effort: hard work pays off / nothing I do matters.</div></div>
  <div class="card"><h2>Relationships by day</h2><svg id="chartR" viewBox="0 0 420 210" width="100%"></svg>
   <div class="note">Friendships = mutual like/close. Feuds = mutual dislike. Isolates = nobody warm either way.</div></div>
 </div>
 <div class="grid2">
  <div class="card"><h2>Events so far</h2><div class="bars" id="events"></div></div>
  <div class="card"><h2>Run fingerprints</h2><div id="hashes" class="note">Run to the end to see the state hash.</div>
   <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"><button id="dlSum">Copy summary JSON</button><button id="dlDec">Copy decision log</button><button id="dlEv">Copy event log</button></div><div class="note" id="copyMsg" style="margin-top:6px"></div></div>
 </div>
</section>
<aside class="side">
 <div class="card"><h2>Villager</h2><div id="npc" class="note">Select a villager.</div></div>
 <div class="card"><h2>Recent decisions (traces)</h2><div id="trace" class="trace">—</div></div>
</aside>
</main>
<script>
${code}
const TABLE_SETS = ${JSON.stringify(tableSets)};
const $ = id => document.getElementById(id);
let sim = null, sel = null, timer = null, events = {};
for (const k of Object.keys(TABLE_SETS)) { const o = document.createElement('option'); o.textContent = k; $('tset').appendChild(o); }

function cfg() {
  const n = +$('n').value;
  return { runSeed: Math.max(1, +$('seed').value | 0), n, days: Math.max(1, +$('days').value | 0),
    tablesMode: $('mode').value, loopOff: $('loopOff').checked, traitsOff: $('traitsOff').checked,
    tableDir: 'tables/' + $('tset').value, logDecisions: n <= 100 };
}
function reset() {
  stop();
  try { sim = createSim(cfg(), TABLE_SETS[$('tset').value]); }
  catch (e) { $('status').textContent = 'Error: ' + e.message; return; }
  sel = null; events = {};
  render();
}
function step() { if (!sim) reset(); if (sim.day >= sim.cfg.days) return; const d = sim.day; sim.stepTick(); render(sim.day !== d); }
function stop() { if (timer) { clearInterval(timer); timer = null; } $('play').textContent = 'Play'; }
function play() { if (timer) { stop(); return; } $('play').textContent = 'Pause'; timer = setInterval(() => { if (sim.day >= sim.cfg.days) { stop(); render(true); return; } step(); }, 120); }
function runAll() { stop(); if (!sim) reset(); const t0 = performance.now(); while (sim.day < sim.cfg.days) sim.stepTick(); sim.elapsedMs = performance.now() - t0; render(true, true); }

function render(dayChanged = true, done = false) {
  const big = sim.cfg.n > 100;
  $('roomsCard').style.display = big ? 'none' : '';
  const finished = sim.day >= sim.cfg.days;
  $('status').textContent = finished ? 'Finished · ' + sim.cfg.days + ' days' : 'Day ' + (sim.day + 1) + ' · hour ' + sim.hour + ' of 16';
  $('step').disabled = $('play').disabled = finished;
  if (!big) renderRooms();
  if (dayChanged) { renderCharts(); renderEvents(); }
  renderNpc();
  renderHashes(finished);
}
function renderRooms() {
  const hm = sim.hamlets[0];
  $('rooms').innerHTML = '';
  for (const r of ['home', 'field', 'square']) {
    const box = document.createElement('div'); box.className = 'room';
    const occ = hm.filter(n => n.room === r);
    box.innerHTML = '<h3>' + r[0].toUpperCase() + r.slice(1) + ' <span class="note">(' + occ.length + ')</span></h3>';
    const dots = document.createElement('div'); dots.className = 'dots';
    for (const n of occ) {
      const d = document.createElement('div'); d.className = 'dot ' + n.mood + (sel === n.id ? ' sel' : '');
      d.textContent = n.id.slice(-2); d.title = n.id; d.onclick = () => { sel = n.id; render(false); };
      dots.appendChild(d);
    }
    box.appendChild(dots); $('rooms').appendChild(box);
  }
}
function line(svg, pts, color, x0, x1, y0, y1, W, H, pad) {
  if (!pts.length) return '';
  const sx = i => pad + (pts.length < 2 ? 0 : i * (W - 2 * pad) / (pts.length - 1));
  const sy = v => H - pad - (v - y0) * (H - 2 * pad) / (y1 - y0);
  return '<polyline fill="none" stroke="' + color + '" stroke-width="2" points="' + pts.map((v, i) => sx(i).toFixed(1) + ',' + sy(v).toFixed(1)).join(' ') + '"/>';
}
function axes(W, H, pad, y0, y1, ticks, days) {
  let s = '';
  for (const t of ticks) { const y = H - pad - (t - y0) * (H - 2 * pad) / (y1 - y0);
    s += '<line x1="' + pad + '" x2="' + (W - pad) + '" y1="' + y + '" y2="' + y + '" stroke="var(--line)"/><text x="4" y="' + (y + 4) + '">' + t + '</text>'; }
  s += '<text x="' + (W - pad) + '" y="' + (H - 4) + '" text-anchor="end">day ' + days + '</text>';
  return s;
}
function renderCharts() {
  const W = 420, H = 210, pad = 28, snaps = sim.snapshots;
  const col = { trust: 'var(--trust)', worth: 'var(--worth)', effort: 'var(--effort)' };
  let s = axes(W, H, pad, -3, 3, [-3, -2, -1, 0, 1, 2, 3], snaps.length);
  for (const p of ['trust', 'worth', 'effort']) {
    const pts = snaps.map(sn => sn.npcs.reduce((a, n) => a + n.pos[p], 0) / sn.npcs.length);
    s += line(null, pts, col[p], 0, 0, -3, 3, W, H, pad);
  }
  s += '<text x="36" y="16" style="fill:var(--trust)">trust</text><text x="80" y="16" style="fill:var(--worth)">worth</text><text x="124" y="16" style="fill:var(--effort)">effort</text>';
  $('chartB').innerHTML = s;
  const dm = sim.dailyMetrics, maxV = Math.max(4, ...dm.map(m => Math.max(m.friendships, m.feuds, m.isolates)));
  const top = Math.ceil(maxV / 4) * 4;
  let r = axes(W, H, pad, 0, top, [0, top / 4, top / 2, 3 * top / 4, top], dm.length);
  r += line(null, dm.map(m => m.friendships), 'var(--good)', 0, 0, 0, top, W, H, pad);
  r += line(null, dm.map(m => m.feuds), 'var(--low)', 0, 0, 0, top, W, H, pad);
  r += line(null, dm.map(m => m.isolates), 'var(--calm)', 0, 0, 0, top, W, H, pad);
  r += '<text x="36" y="16" style="fill:var(--good)">friendships</text><text x="112" y="16" style="fill:var(--low)">feuds</text><text x="152" y="16" style="fill:var(--calm)">isolates</text>';
  $('chartR').innerHTML = r;
}
function renderEvents() {
  const tot = {};
  for (const m of sim.dailyMetrics) for (const [k, v] of Object.entries(m.events)) tot[k] = (tot[k] || 0) + v;
  const max = Math.max(1, ...Object.values(tot));
  $('events').innerHTML = Object.keys(tot).length ? Object.entries(tot).sort((a, b) => b[1] - a[1]).map(([k, v]) =>
    '<div><span style="width:110px">' + k + '</span><b style="width:' + Math.round(140 * v / max) + 'px"></b>' + v + '</div>').join('') : '<span class="note">Counts appear after each day.</span>';
}
function renderNpc() {
  if (!sel || !sim.byId[sel]) { $('npc').innerHTML = '<span class="note">Select a villager (5–100 villager runs).</span>'; $('trace').textContent = '—'; return; }
  const n = sim.byId[sel];
  const bel = p => V.poles[p][n.beliefs[p].pole] + ' <span class="note">(' + V.tiers[n.beliefs[p].tier] + ')</span>';
  const lk = {}; for (const r of Object.values(n.rel)) lk[r.liking] = (lk[r.liking] || 0) + 1;
  const grudges = Object.entries(n.rel).filter(([, r]) => r.grudge !== 'none').map(([o, r]) => o + ': ' + r.grudge).join(', ') || 'none';
  $('npc').innerHTML = '<table class="kv">' +
    '<tr><td>Villager</td><td><b>' + n.id + '</b> · ' + n.room + ' · ' + n.mood + '</td></tr>' +
    '<tr><td>Temperament</td><td>' + V.traits.map(t => t + ' ' + n.temperament[t]).join(', ') + '</td></tr>' +
    '<tr><td>Effective now</td><td>' + V.effTraits.map(t => t + ' ' + n.eff[t]).join(', ') + '</td></tr>' +
    '<tr><td>Trust</td><td>' + bel('trust') + '</td></tr><tr><td>Worth</td><td>' + bel('worth') + '</td></tr><tr><td>Effort</td><td>' + bel('effort') + '</td></tr>' +
    '<tr><td>Food / energy</td><td>' + n.food + ' / ' + n.energy + '</td></tr>' +
    '<tr><td>Liking toward others</td><td>' + V.likings.map(l => l + ' ' + (lk[l] || 0)).join(', ') + '</td></tr>' +
    '<tr><td>Grudges</td><td>' + grudges + '</td></tr></table>';
  if (!sim.logLines) { $('trace').textContent = 'Decision logging is off for runs over 100 villagers.'; return; }
  const NAMES = Object.fromEntries(TABLES.map(t => [t.id, t.name]));
  const mine = [];
  for (let i = sim.logLines.length - 1; i > 0 && mine.length < 12; i--) {
    const f = sim.logLines[i].split(',');
    if (f[1] === sel) mine.push(f);
  }
  $('trace').textContent = mine.map(f => '[' + f[0] + '] ' + NAMES[f[2]] + ': ' + f[3].split('|').join(' + ') + '  →  ' + f[4].split('|').join(' / ') + (f[5] !== '-' ? '  (' + f[5] + ')' : '')).join('\\n') || '—';
}
function renderHashes(finished) {
  if (!finished) { $('hashes').innerHTML = '<span class="note">Run to the end to see the state hash.</span>'; return; }
  const s = sim.summary();
  const t = s.timing.msPerTick != null ? s.timing.msPerTick.toFixed(3) + ' ms per hour-tick (' + sim.cfg.n + ' villagers, this device)' : '';
  $('hashes').innerHTML = '<div>State hash</div><div class="hash">' + s.stateHash + '</div><div style="margin-top:4px">Log hash</div><div class="hash">' + s.logHash + '</div>' +
    '<div style="margin-top:4px">Cast hash</div><div class="hash">' + s.castHash + '</div><div style="margin-top:6px">' + t + '</div>' +
    (s.missingRows ? '<div style="color:var(--low)">Missing rows used: ' + s.missingRows + '</div>' : '');
}
async function copyText(label, text) { try { await navigator.clipboard.writeText(text); $('copyMsg').textContent = label + ' copied (' + Math.round(text.length / 1024) + ' KB).'; } catch (e) { $('copyMsg').textContent = 'Copy was blocked by this browser.'; } }
$('reset').onclick = reset; $('step').onclick = step; $('play').onclick = play; $('runall').onclick = runAll;
$('dlSum').onclick = () => sim && copyText('Summary', JSON.stringify(sim.summary(), null, 1));
$('dlDec').onclick = () => sim && copyText('Decision log', sim.decisionLogText());
$('dlEv').onclick = () => sim && copyText('Event log', sim.eventLogText());
for (const id of ['seed', 'n', 'days', 'tset', 'mode', 'loopOff', 'traitsOff']) $(id).onchange = reset;
reset();
</script>
</body>
</html>
`;
writeFileSync('viewer.html', html);
console.log('Wrote viewer.html (' + Math.round(html.length / 1024) + ' KB), table sets: ' + Object.keys(tableSets).join(', '));
