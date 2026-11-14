// build_viewer.js — inlines engine.js, sha256.js and all CSVs in tables/ and cast/ into viewer.html.
import fs from 'node:fs';
import path from 'node:path';

const strip = (src) => src
  .replace(/^import[^\n]*\n/gm, '')
  .replace(/^export\s+(?=(function|const|let|class)\b)/gm, '');

function collect(dir, out) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) collect(p, out);
    else if (e.name.endsWith('.csv')) out[p.split(path.sep).join('/')] = fs.readFileSync(p, 'utf8');
  }
}

// ---- viewer UI (serialised with toString; runs in the browser) ----
function viewerMain(FILES) {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sets = [...new Set(Object.keys(FILES).filter((k) => k.startsWith('tables/')).map((k) => k.split('/').slice(1, -1).join('/')))].sort();
  for (const s of sets) { const o = document.createElement('option'); o.textContent = s; if (s === 'rules') o.selected = true; $('tset').appendChild(o); }
  let sim = null, timer = null, selected = 0;

  const tableFiles = (set) => {
    const o = {};
    for (const s of TABLE_SCHEMAS) { const k = `tables/${set}/${s.file}`; if (k in FILES) o[s.file] = FILES[k]; }
    return o;
  };
  function readCfg() {
    const n = parseInt($('n').value, 10);
    return { runSeed: parseInt($('seed').value, 10), castSeed: 1, n, days: parseInt($('days').value, 10),
      tableDir: 'tables/' + $('tset').value, loopOff: $('loopOff').checked, traitsOff: $('traitsOff').checked,
      tablesMode: $('mode').value, logDecisions: n <= 200 };
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } $('bPlay').textContent = 'Play'; }
  function fresh() {
    stop();
    const cfg = readCfg();
    try {
      const cast = cfg.castSeed === 1 && cfg.n <= 20 ? FILES['cast/cast_s1_n20.csv'] ?? null : null;
      sim = new Sim(cfg, tableFiles($('tset').value), cast);
      selected = 0; $('err').textContent = '';
    } catch (e) { sim = null; $('err').textContent = e.message; }
  }
  function download(name, text, type = 'text/plain') {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  $('bRun').onclick = () => { fresh(); if (!sim) return; while (!sim.done) sim.stepTick(); render(); };
  $('bStep').onclick = () => { stop(); if (!sim || sim.done) fresh(); if (!sim) return; sim.stepTick(); render(); };
  $('bPlay').onclick = () => {
    if (timer) { stop(); return; }
    if (!sim || sim.done) fresh();
    if (!sim) return;
    $('bPlay').textContent = 'Pause';
    timer = setInterval(() => { if (!sim || sim.done) { stop(); return; } sim.stepTick(); render(); }, 120);
  };
  $('dLog').onclick = () => sim && download('decision_log.csv', sim.config.logDecisions ? sim.decisionLogText() : 'decision log is off for this run\n');
  $('dEv').onclick = () => sim && download('event_log.csv', sim.eventLogText());
  $('dSum').onclick = () => sim && download('summary.json', JSON.stringify(sim.summary(), null, 2) + '\n', 'application/json');
  for (const id of ['seed', 'n', 'days', 'tset', 'mode', 'loopOff', 'traitsOff']) {
    $(id).onchange = () => { stop(); sim = null; $('clock').textContent = 'Settings changed: press Run or Step.'; };
  }

  function render() {
    if (!sim) return;
    const big = sim.config.n > 200;
    $('clock').textContent = sim.done ? `Complete: ${sim.config.days} days` : `Day ${sim.day}, hour ${sim.hour} (next tick ${sim.day * 16 + sim.hour})`;
    const rooms = $('rooms');
    rooms.innerHTML = '';
    if (!big) {
      sim.hamlets.forEach((h, hi) => {
        const row = document.createElement('div'); row.className = 'hamlet';
        row.innerHTML = `<div class="hl">Hamlet ${hi + 1}</div>`;
        for (const room of ROOMS) {
          const panel = document.createElement('div'); panel.className = 'room';
          panel.innerHTML = `<div class="rt">${room}</div>`;
          for (const p of h) if (p.room === room) {
            const d = document.createElement('button');
            d.className = `dot mood-${p.mood}${p.idx === selected ? ' sel' : ''}`;
            d.textContent = p.id;
            d.title = `${p.id}: mood ${p.mood}, food ${p.food}, energy ${p.energy}`;
            d.onclick = () => { selected = p.idx; render(); };
            panel.appendChild(d);
          }
          row.appendChild(panel);
        }
        rooms.appendChild(row);
      });
    } else {
      rooms.innerHTML = `<p>${sim.config.n} NPCs (dots hidden). ${(sim.elapsedMs / Math.max(1, sim.wakingTicks)).toFixed(2)} ms per tick.</p>`;
    }
    side(); charts(); hashes();
  }

  function side() {
    const el = $('side');
    if (sim.config.n > 200) {
      const m = sim.metrics[sim.metrics.length - 1];
      el.innerHTML = m ? `<h3>Day ${m.day} metrics</h3><pre class="trace">${esc(JSON.stringify(m, null, 1))}</pre>` : '<p>No completed day yet.</p>';
      return;
    }
    const p = sim.npcs[selected];
    if (!p) { el.innerHTML = ''; return; }
    const pos = (b) => { const v = beliefPosition(b); return (v > 0 ? '+' : '') + v; };
    let html = `<h3>${esc(p.id)}</h3>`;
    html += `<p><b>Temperament</b><br>${TRAITS.map((t) => `${t} ${p.temperament[t]}`).join(', ')}</p>`;
    html += `<p><b>Effective</b><br>${EFF_TRAITS.map((t) => `${t} ${p.effective[t]}`).join(', ')}</p>`;
    html += `<p><b>Beliefs</b><br>${PAIRS.map((pair) => { const b = p.beliefs[pair]; return `${pair}: ${esc(POLES[pair][b.pole])} (${b.tier}, ${pos(b)})`; }).join('<br>')}</p>`;
    html += `<p><b>Mood</b> ${p.mood} · <b>food</b> ${p.food} · <b>energy</b> ${p.energy} · <b>room</b> ${p.room} · <b>need</b> ${esc(p.need)}</p>`;
    html += '<table><tr><td><b>toward</b></td><td>liking</td><td>ctr</td><td>grudge</td><td>offence</td><td>owes</td></tr>';
    for (const [j, r] of p.rel) html += `<tr><td>${sim.npcs[j].id}</td><td>${r.liking}</td><td>${r.counter}</td><td>${esc(r.grudge)}</td><td>${r.offence}</td><td>${r.owesApology ? 'yes' : ''}</td></tr>`;
    html += '</table>';
    const lines = [];
    for (let i = sim.log.length - 1; i >= 0 && lines.length < 10; i--) {
      const parts = sim.log[i].trimEnd().split(',');
      if (parts[1] === p.id) lines.push(parts);
    }
    lines.reverse();
    html += '<p><b>Last 10 decisions</b></p><div class="trace">' + lines.map(([tick, , table, key, out, choice]) =>
      esc(`[${tick}] ${key.split('|').join(', ')} → ${table} → ${out.split('|').join(' / ')}${choice !== '-' ? ` (${choice})` : ''}`)).join('\n') + '</div>';
    el.innerHTML = html;
  }

  function charts() {
    const box = $('charts');
    const POSV = { m3: -3, m2: -2, m1: -1, p1: 1, p2: 2, p3: 3 };
    for (const pair of PAIRS) {
      let c = $('chart-' + pair);
      if (!c) {
        const wrap = document.createElement('div');
        wrap.innerHTML = `<div><b>${pair}</b>: belief position by day</div>`;
        c = document.createElement('canvas'); c.id = 'chart-' + pair; c.width = 320; c.height = 170;
        wrap.appendChild(c); box.appendChild(wrap);
      }
      const g = c.getContext('2d'), W = c.width, H = c.height;
      g.clearRect(0, 0, W, H);
      const days = Math.max(1, sim.config.days);
      const X = (d) => 28 + (d * (W - 36)) / days;
      const Y = (v) => 8 + ((3 - v) * (H - 26)) / 6;
      g.font = '10px sans-serif'; g.fillStyle = '#666'; g.strokeStyle = '#e2e2e2'; g.lineWidth = 1;
      for (let v = -3; v <= 3; v++) { g.beginPath(); g.moveTo(X(0), Y(v)); g.lineTo(X(days), Y(v)); g.stroke(); g.fillText((v > 0 ? '+' : '') + v, 4, Y(v) + 3); }
      g.fillText('day 0', X(0), H - 4); g.fillText('day ' + days, X(days) - 34, H - 4);
      if (sim.keepSnapshots && sim.config.n <= 50) {
        const series = [sim.initialSnapshot, ...sim.snapshots.map((s) => s.npcs)];
        g.strokeStyle = 'rgba(90,110,160,0.25)';
        for (let k = 0; k < sim.npcs.length; k++) {
          g.beginPath();
          series.forEach((snap, d) => (d ? g.lineTo(X(d), Y(snap[k][pair])) : g.moveTo(X(d), Y(snap[k][pair]))));
          g.stroke();
        }
      }
      const n = sim.npcs.length;
      const means = [sim.initialSnapshot.reduce((a, x) => a + x[pair], 0) / n,
        ...sim.metrics.map((m) => Object.entries(m.positions[pair]).reduce((a, [k, cnt]) => a + POSV[k] * cnt, 0) / n)];
      g.strokeStyle = '#c0392b'; g.lineWidth = 2.5; g.beginPath();
      means.forEach((v, d) => (d ? g.lineTo(X(d), Y(v)) : g.moveTo(X(d), Y(v))));
      g.stroke();
    }
  }

  function hashes() {
    const lines = [`cast hash    ${sim.castHash}`];
    for (const [k, v] of Object.entries(sim.tableHashes)) lines.push(`${k.padEnd(4)} hash    ${v}`);
    lines.push(`missingRows  ${sim.missingCount}`);
    if (sim.done) lines.push(`state hash   ${sim.stateHash}`, `log hash     ${sim.logHash}`, `ms per tick  ${(sim.elapsedMs / Math.max(1, sim.wakingTicks)).toFixed(3)}`);
    else lines.push('state and log hashes appear when the run is complete');
    $('hashes').textContent = lines.join('\n');
  }
}

const TEMPLATE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Village Core v1.0 viewer</title>
<style>
body{font:13px/1.4 system-ui,sans-serif;margin:12px;color:#222}
#controls{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:8px}
#controls label{display:flex;gap:4px;align-items:center}
input[type=number]{width:70px}
#main{display:grid;grid-template-columns:minmax(0,2fr) minmax(280px,1fr);gap:12px}
.hamlet{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px}
.hl{grid-column:1/-1;font-weight:600}
.room{border:1px solid #ccc;border-radius:6px;padding:6px;min-height:80px}
.rt{font-weight:600;margin-bottom:4px;text-transform:capitalize}
.dot{border:0;border-radius:12px;padding:2px 7px;margin:2px;color:#fff;cursor:pointer;font:11px monospace}
.mood-low{background:#b54848}.mood-calm{background:#777}.mood-good{background:#3f8f48}
.sel{outline:3px solid #f2b600}
#side{border:1px solid #ccc;border-radius:6px;padding:8px;overflow:auto;max-height:640px}
#side table{border-collapse:collapse;font-size:12px}#side td{padding:1px 6px;border-bottom:1px solid #eee}
.trace{font:11px monospace;white-space:pre-wrap}
#charts{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
#hashes{font:11px monospace;white-space:pre-wrap;background:#f6f6f6;padding:8px;border-radius:6px;margin-top:8px}
#err{color:#b00;white-space:pre-wrap}
</style></head><body>
<h2>Village Core v1.0</h2>
<div id="controls">
<label>run seed <input id="seed" type="number" value="1"></label>
<label>n <select id="n"><option>5</option><option selected>20</option><option>1000</option><option>10000</option></select></label>
<label>days <input id="days" type="number" value="30" min="1"></label>
<label>table set <select id="tset"></select></label>
<label>tablesMode <select id="mode"><option>csv</option><option>shuffled</option><option>random</option></select></label>
<label><input id="loopOff" type="checkbox"> loopOff</label>
<label><input id="traitsOff" type="checkbox"> traitsOff</label>
<button id="bRun">Run</button><button id="bStep">Step</button><button id="bPlay">Play</button>
<span>Download: <button id="dLog">decision log</button><button id="dEv">event log</button><button id="dSum">summary</button></span>
</div>
<div id="clock">Press Run or Step.</div><div id="err"></div>
<div id="main"><div><div id="rooms"></div><div id="charts"></div></div><div id="side"></div></div>
<div id="hashes"></div>
<script>
/*__ENGINE__*/
</script>
<script>
const FILES = /*__FILES__*/;
/*__MAIN__*/
</script>
</body></html>
`;

const files = {};
collect('tables', files);
collect('cast', files);
const engineSrc = strip(fs.readFileSync('sha256.js', 'utf8')) + '\n' + strip(fs.readFileSync('engine.js', 'utf8'));
const filesJson = JSON.stringify(files).replace(/</g, '\\u003c');
const html = TEMPLATE
  .replace('/*__ENGINE__*/', () => engineSrc)
  .replace('/*__FILES__*/', () => filesJson)
  .replace('/*__MAIN__*/', () => `(${viewerMain.toString()})(FILES);`);
fs.writeFileSync('viewer.html', html);
console.log(`wrote viewer.html (${Object.keys(files).length} CSV files inlined, ${(html.length / 1024).toFixed(0)} KB)`);
