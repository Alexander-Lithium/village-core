// Builds speedtest.html: self-contained device speed test (Experiment 6: scale and cost).
// Runs the village on the consensus tables at 10 / 100 / 1,000 / 10,000 villagers, decision logging off,
// 3 repeats each, and reports median time per in-game hour and per villager-hour, plus device details.
import { readFileSync, writeFileSync } from 'node:fs';
import { TABLES, fileName } from './engine.js';

const strip = src => src.replace(/^import .*$/gm, '').replace(/^export /gm, '');
const code = strip(readFileSync('sha256.js', 'utf8')) + '\n' + strip(readFileSync('engine.js', 'utf8'));
const tables = Object.fromEntries(TABLES.map(t => [t.id, readFileSync(`tables/consensus_blind8/${fileName(t)}`, 'utf8')]));

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Village Core speed test</title>
<style>
:root{--bg:#f6f4ef;--panel:#fffdf8;--ink:#23211c;--muted:#6f6a5e;--line:#ddd7ca;--accent:#2f5d50}
@media (prefers-color-scheme:dark){:root{--bg:#1b1a17;--panel:#24221e;--ink:#ece8de;--muted:#a39d8f;--line:#3a372f;--accent:#7fb8a4}}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:720px;margin:0 auto;padding:20px}
h1{font-size:20px;margin:0 0 4px}.sub{color:var(--muted);margin:0 0 16px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin-bottom:14px}
label{display:block;font-size:13px;color:var(--muted);margin-bottom:4px}
input{font:inherit;width:100%;box-sizing:border-box;padding:8px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--ink)}
button{font:inherit;padding:10px 16px;border-radius:8px;border:1px solid var(--accent);background:var(--accent);color:var(--panel);cursor:pointer;margin-right:8px}
button.sec{background:transparent;color:var(--ink);border-color:var(--line)}
button:disabled{opacity:.5}
table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums;font-size:14px}
th,td{text-align:right;padding:6px 4px;border-bottom:1px solid var(--line)}th:first-child,td:first-child{text-align:left}
th{color:var(--muted);font-weight:600;font-size:12px}
#status{color:var(--muted);margin-top:10px;min-height:1.5em}
svg text{fill:var(--muted);font-size:11px}svg text.ref{font-size:10px}
pre{white-space:pre-wrap;font:12px ui-monospace,Menlo,monospace;background:var(--bg);padding:10px;border-radius:6px;max-height:240px;overflow:auto}
.note{color:var(--muted);font-size:13px}
</style></head><body><main>
<h1>Village Core speed test</h1>
<p class="sub">Grows the village from 10 villagers upward and times each size. It stops when the simulation can no longer keep up with a game pace of one in-game day per 5 real minutes, when the device runs short of memory, or at 1,000,000. Takes a minute or two; phones may stop earlier.</p>
<div class="card">
 <label for="dev">Device name (e.g. "PC i5-10400", "Pixel 10 Pro XL", "Galaxy A55", "Claude app browser")</label>
 <input id="dev" placeholder="Device name">
 <p class="note">Before running: plug the device in, turn off battery saver, close other tabs, and keep this tab in front until it finishes.</p>
 <button id="go">Run speed test</button><button id="copy" class="sec" disabled>Copy results</button>
 <div id="status"></div>
</div>
<div class="card"><label>Time per in-game hour vs number of villagers</label><svg id="chart" viewBox="0 0 640 340" width="100%"></svg></div>
<div class="card"><table><thead><tr><th>Villagers</th><th>ms per in-game hour</th><th>µs per villager-hour</th><th>Share of time budget*</th><th>Setup</th></tr></thead><tbody id="rows"></tbody></table>
<p class="note">*Share of the real time available per in-game hour (18.75 s, if one in-game day lasts 5 real minutes) used by the simulation. Sizes up to 10,000 are the median of 3 repeats. The test grows the village until one in-game hour takes longer than the game's pace allows (one in-game day = 5 real minutes, so 18.75 s per in-game hour), building it takes over 30 seconds, or it reaches 1,000,000 villagers. Decision logging is off.</p></div>
<div class="card"><label>Results to send back</label><pre id="out">Not run yet.</pre></div>
</main>
<script>
${code}
const TABLE_TEXTS = ${JSON.stringify(tables)};
const SIZES = [10, 30, 100, 300, 1000, 3000, 10000, 30000, 100000, 300000, 1000000];
const LIMIT_MS = 18750;     // game pace: one in-game day (16 hours) = 5 real minutes, so one in-game hour = 18.75 s
const SETUP_LIMIT_MS = 30000; // or once building the village takes longer than 30 s
const MB_PER_VILLAGER = 4.8;  // measured: mostly relationship records (20-villager hamlets)
const MEM_CAP_MB = (navigator.deviceMemory || 4) >= 8 ? 1600 : (navigator.deviceMemory || 4) * 1024 / 5;
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let resultText = '';
function deviceInfo() {
  const n = navigator;
  return [
    'device: ' + ($('dev').value || '(not named)'),
    'date: ' + new Date().toISOString(),
    'userAgent: ' + n.userAgent,
    'logical cores: ' + (n.hardwareConcurrency || '?'),
    'device memory (GB, approx): ' + (n.deviceMemory || '?'),
    'screen: ' + screen.width + 'x' + screen.height + ' @' + (window.devicePixelRatio || 1),
  ].join('\\n');
}
async function timeRun(n, seed) {
  const t0 = performance.now();
  const sim = createSim({ runSeed: seed, n, days: 3, logDecisions: false }, TABLE_TEXTS);
  const setup = performance.now() - t0;
  let ms = 0, ticks = 0;
  // run whole in-game hours until at least 4 hours and 1.5 s of timing, max 48 hours
  while (ticks < 48 && (ticks < 4 || ms < 1500)) {
    const a = performance.now(); sim.stepTick(); ms += performance.now() - a; ticks++;
    if (ticks % 4 === 0) await sleep(0);
  }
  return { msPerTick: ms / ticks, setup, ticks };
}
const fmtN = n => n >= 1e6 ? (n / 1e6) + 'M' : n >= 1e3 ? (n / 1e3) + 'k' : String(n);
function drawChart(pts) {
  const W = 640, H = 340, L = 56, R = 16, T = 16, B = 44;
  const xs = SIZES, x0 = Math.log10(xs[0]), x1 = Math.log10(xs[xs.length - 1]);
  const ys = pts.map(p => p.ms).concat([0.01, LIMIT_MS * 2]);
  const y0 = Math.floor(Math.log10(Math.min(...ys))), y1 = Math.ceil(Math.log10(Math.max(...ys)));
  const X = v => L + (Math.log10(v) - x0) / (x1 - x0) * (W - L - R);
  const Y = v => T + (y1 - Math.log10(v)) / (y1 - y0) * (H - T - B);
  let g = '';
  for (let e = y0; e <= y1; e++) { const v = Math.pow(10, e); g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="var(--line)"/><text x="' + (L - 6) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + (v >= 1 ? v.toLocaleString() : v) + '</text>'; }
  for (const v of xs) g += '<text x="' + X(v) + '" y="' + (H - B + 16) + '" text-anchor="middle">' + fmtN(v) + '</text>';
  const ref = (v, label) => '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="var(--muted)" stroke-dasharray="4 4"/><text x="' + (W - R - 4) + '" y="' + (Y(v) - 5) + '" text-anchor="end" class="ref">' + label + '</text>';
  g += ref(LIMIT_MS, 'budget: 1 in-game day = 5 real minutes') + ref(16.7, 'one 60 fps frame');
  if (pts.length) {
    g += '<polyline fill="none" stroke="var(--accent)" stroke-width="2.5" points="' + pts.map(p => X(p.n) + ',' + Y(p.ms)).join(' ') + '"/>';
    g += pts.map(p => '<circle cx="' + X(p.n) + '" cy="' + Y(p.ms) + '" r="4" fill="var(--accent)"><title>' + p.n.toLocaleString() + ' villagers: ' + p.ms.toFixed(3) + ' ms</title></circle>').join('');
  }
  g += '<text x="' + ((L + W - R) / 2) + '" y="' + (H - 6) + '" text-anchor="middle">villagers (log scale)</text>';
  g += '<text transform="translate(14,' + ((T + H - B) / 2) + ') rotate(-90)" text-anchor="middle">ms per in-game hour (log)</text>';
  $('chart').innerHTML = g;
}
drawChart([]);
$('go').onclick = async () => {
  $('go').disabled = true; $('copy').disabled = true; $('rows').innerHTML = '';
  const lines = [deviceInfo(), '', 'villagers,ms_per_hour_tick,us_per_villager_hour,setup_ms,ticks_timed,est_memory_mb,repeats_ms'];
  const pts = []; let stopNote = 'Reached the largest size tested (1,000,000).';
  for (const n of SIZES) {
    if (n * MB_PER_VILLAGER / 1000 > MEM_CAP_MB) { stopNote = 'Stopped before ' + n.toLocaleString() + ' villagers: estimated memory (' + Math.round(n * MB_PER_VILLAGER / 1000).toLocaleString() + ' MB) is above the safe limit for this device (' + Math.round(MEM_CAP_MB) + ' MB).'; break; }
    const nRep = n <= 10000 ? 3 : 1, reps = [];
    let setup = 0, ticks = 0;
    for (let r = 0; r < nRep; r++) {
      $('status').textContent = 'Running ' + n.toLocaleString() + ' villagers' + (nRep > 1 ? ', repeat ' + (r + 1) + ' of ' + nRep : '') + '…';
      await sleep(30);
      let res;
      try { res = await timeRun(n, 101 + r); } catch (e) { stopNote = 'Stopped at ' + n.toLocaleString() + ': ' + e.message; break; }
      reps.push(res.msPerTick); setup = res.setup; ticks = res.ticks;
    }
    if (!reps.length) break;
    const med = [...reps].sort((a, b) => a - b)[Math.floor(reps.length / 2)];
    pts.push({ n, ms: med }); drawChart(pts);
    const tr = document.createElement('tr');
    tr.innerHTML = '<td>' + n.toLocaleString() + '</td><td>' + med.toFixed(3) + '</td><td>' + (1000 * med / n).toFixed(2) + '</td><td>' + (100 * med / LIMIT_MS < 0.1 ? '&lt;0.1' : (100 * med / LIMIT_MS).toFixed(1)) + '%</td><td>' + (setup / 1000).toFixed(1) + ' s</td>';
    $('rows').appendChild(tr);
    lines.push([n, med.toFixed(4), (1000 * med / n).toFixed(3), setup.toFixed(0), ticks, Math.round(n * MB_PER_VILLAGER / 1000), reps.map(x => x.toFixed(4)).join('|')].join(','));
    resultText = lines.join('\\n') + '\\n(partial: test still running)'; $('out').textContent = resultText; $('copy').disabled = false;
    if (med > LIMIT_MS) { stopNote = 'Stopped after ' + n.toLocaleString() + ' villagers: one in-game hour took longer than the 18.75 s budget.'; break; }
    if (setup > SETUP_LIMIT_MS) { stopNote = 'Stopped after ' + n.toLocaleString() + ' villagers: building the village took longer than 30 seconds.'; break; }
  }
  lines.push('', 'note: ' + stopNote);
  resultText = lines.join('\\n');
  $('out').textContent = resultText;
  $('status').textContent = stopNote + ' Press "Copy results" and paste them back in the chat.';
  $('go').disabled = false; $('copy').disabled = false;
};
$('copy').onclick = async () => {
  try { await navigator.clipboard.writeText(resultText); $('status').textContent = 'Copied.'; }
  catch (e) { $('status').textContent = 'Copy was blocked: select the results box and copy manually.'; }
};
</script></body></html>`;
writeFileSync('speedtest.html', html);
console.log('Wrote speedtest.html (' + Math.round(html.length / 1024) + ' KB)');
