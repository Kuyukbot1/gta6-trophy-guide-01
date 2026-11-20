// Leonida Platinum — start-up: loads the trophy list and roadmap, wires
// the checklist, filters, spoiler setting, tabs, hash routing and saving.
import { readProgress, writeProgress, readPrefs, writePrefs, downloadProgress, parseProgressFile } from './store.js';
import { KIND_NAMES, KIND_SEQUENCE, filterTrophies } from './filters.js';
import { paintChecklist, paintDetail, paintRoadmap, paintMissables, paintSources } from './views.js';

const ui = {
  tab: 'checklist',
  kind: 'all',
  grade: 'all',
  query: '',
  earnedOnly: false,
  spoiler: false,
};

let guide = null;
let plan = null;
let done = readProgress();
let openId = 28;

const listEl = document.getElementById('trophyList');
const metaEl = document.getElementById('listMeta');
const detailEl = document.getElementById('detailCol');
const toolbarEl = document.getElementById('toolbar');

function findTrophy(id) {
  return guide.trophies.find((trophy) => trophy.id === id) ?? null;
}

function paintProgress() {
  const total = guide.trophies.length;
  const pct = Math.round((done.size / total) * 100);
  document.getElementById('earnedCount').textContent = String(done.size);
  document.getElementById('progressFill').style.width = `${pct}%`;
  document.getElementById('progressNote').textContent = `${pct}% to the platinum — ${total - done.size} to go`;
  const counts = {};
  for (const trophy of guide.trophies) counts[trophy.grade] = (counts[trophy.grade] ?? 0) + (done.has(trophy.id) ? 1 : 0);
  document.getElementById('gradeCounts').innerHTML =
    `Platinum <b>${counts.platinum ?? 0}/1</b> · Gold <b>${counts.gold ?? 0}/2</b> · Silver <b>${counts.silver ?? 0}/6</b> · Bronze <b>${counts.bronze ?? 0}/46</b>`;
}

function showTab() {
  const onChecklist = ui.tab === 'checklist';
  listEl.hidden = !onChecklist;
  metaEl.hidden = !onChecklist;
  toolbarEl.style.display = onChecklist ? '' : 'none';
  document.querySelector('.layout').classList.toggle('no-detail', !onChecklist);
  document.getElementById('roadmapPage').hidden = ui.tab !== 'roadmap';
  document.getElementById('missablesPage').hidden = ui.tab !== 'missables';
  document.getElementById('sourcesPage').hidden = ui.tab !== 'sources';
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.tab === ui.tab);
  });
}

function paint() {
  paintProgress();
  showTab();
  if (ui.tab !== 'checklist') return;
  const filtered = filterTrophies(guide.trophies, ui, done);
  paintChecklist(listEl, metaEl, filtered, ui, done, openId,
    (id) => { openId = id; location.hash = `#/trophy/${id}`; paint(); },
    (id, checked) => { flipEarned(id, checked); });
  paintDetail(detailEl, findTrophy(openId), guide.sources, done, ui.spoiler,
    (id, checked) => { flipEarned(id, checked); });
}

function flipEarned(id, checked) {
  if (checked) done.add(id);
  else done.delete(id);
  writeProgress(done);
  paint();
}

function paintPage() {
  if (ui.tab === 'roadmap') paintRoadmap(document.getElementById('roadmapPage'), plan);
  if (ui.tab === 'missables') paintMissables(document.getElementById('missablesPage'), guide.trophies);
  if (ui.tab === 'sources') paintSources(document.getElementById('sourcesPage'), guide.sources);
}

function goTab(tab) {
  ui.tab = tab;
  paintPage();
  location.hash = `#/${tab}`;
  paint();
}

function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  if (hash.startsWith('trophy/')) {
    const id = Number(hash.slice('trophy/'.length));
    if (Number.isInteger(id) && findTrophy(id)) openId = id;
    ui.tab = 'checklist';
  } else if (['checklist', 'roadmap', 'missables', 'sources'].includes(hash)) {
    ui.tab = hash;
  }
  paintPage();
}

function wireToolbar() {
  const chips = document.getElementById('kindChips');
  for (const kind of KIND_SEQUENCE) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (kind === 'all' ? ' active' : '');
    chip.dataset.kind = kind;
    chip.textContent = KIND_NAMES[kind];
    chip.addEventListener('click', () => {
      ui.kind = kind;
      chips.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === chip));
      paint();
    });
    chips.append(chip);
  }

  document.getElementById('search').addEventListener('input', (event) => {
    ui.query = event.target.value;
    paint();
  });
  document.getElementById('gradeFilter').addEventListener('change', (event) => {
    ui.grade = event.target.value;
    paint();
  });
  document.getElementById('earnedOnly').addEventListener('change', (event) => {
    ui.earnedOnly = event.target.checked;
    paint();
  });
  const spoilerToggle = document.getElementById('spoilerToggle');
  spoilerToggle.checked = ui.spoiler;
  spoilerToggle.addEventListener('change', (event) => {
    ui.spoiler = event.target.checked;
    writePrefs({ spoiler: ui.spoiler });
    paint();
  });
  document.getElementById('exportBtn').addEventListener('click', () => downloadProgress(done));
  document.getElementById('importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      done = await parseProgressFile(file);
      writeProgress(done);
      paint();
    } catch {
      alert('That file is not a trophy progress export from this guide.');
    }
    event.target.value = '';
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Clear all earned trophies?')) {
      done = new Set();
      writeProgress(done);
      paint();
    }
  });
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => goTab(tab.dataset.tab));
  });
  window.addEventListener('hashchange', () => { route(); paint(); });
}

async function start() {
  const [trophyDoc, roadmapDoc] = await Promise.all([
    (await fetch('data/trophies.json')).json(),
    (await fetch('data/roadmap.json')).json(),
  ]);
  guide = trophyDoc;
  plan = roadmapDoc;

  const prefs = readPrefs();
  ui.spoiler = prefs.spoiler;

  wireToolbar();
  route();
  paint();
}

start();
