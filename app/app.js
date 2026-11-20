// Boot and hash routing for the Leonida Trophy Atlas.
// Loads the trophy and roadmap data, renders the current view from the
// hash, and wires the toolbar (search, filters, spoiler setting, export,
// import, reset). The app is fully offline: the only fetches are the two
// JSON files it ships with.

import {
  earnedCount,
  earnedIds,
  exportProgress,
  importProgressFile,
  isEarned,
  resetProgress,
  setSpoilersHidden,
  spoilersHidden,
  toggleEarned,
} from "./store.js";
import {
  renderChecklist,
  renderDetail,
  renderMissables,
  renderRoadmap,
  renderSources,
  updateProgress,
} from "./views.js";

const view = document.getElementById("view");
const detail = document.getElementById("detail");
const detailBody = document.getElementById("detail-body");
const detailClose = document.getElementById("detail-close");

const searchInput = document.getElementById("search");
const kindFilter = document.getElementById("kind-filter");
const gradeFilter = document.getElementById("grade-filter");
const earnedFilter = document.getElementById("earned-filter");
const spoilerToggle = document.getElementById("spoiler-toggle");
const exportBtn = document.getElementById("export-btn");
const importFile = document.getElementById("import-file");
const resetBtn = document.getElementById("reset-btn");

let trophies = [];
let roadmap = null;
let openTrophyId = null;

function filters() {
  return {
    query: searchInput.value,
    kind: kindFilter.value,
    grade: gradeFilter.value,
    earned: earnedFilter.value,
    earnedSet: earnedIds(),
    hideSpoilers: spoilersHidden(),
    onToggle: handleToggle,
    onOpen: openTrophy,
  };
}

function refreshProgress() {
  updateProgress(earnedCount(), trophies.length);
}

function render() {
  const hash = window.location.hash || "#/checklist";
  const parts = hash.replace(/^#\//, "").split("/");
  const page = parts[0] || "checklist";
  const arg = parts[1] || null;

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.tab === page || (page === "trophy" && tab.dataset.tab === "checklist"));
  });

  if (page === "roadmap" && roadmap) {
    renderRoadmap(view, roadmap, trophies);
  } else if (page === "missables") {
    renderMissables(view, trophies, earnedIds(), spoilersHidden());
  } else if (page === "sources") {
    renderSources(view);
  } else {
    renderChecklist(view, trophies, filters());
  }

  if (page === "trophy" && arg) {
    openTrophy(arg, true);
  } else {
    closeDetail();
  }
  refreshProgress();
}

function openTrophy(id, fromHash) {
  const trophy = trophies.find((item) => item.id === id);
  if (!trophy) return;
  openTrophyId = id;
  renderDetail(detailBody, trophy, isEarned(id), handleToggle, spoilersHidden());
  detail.hidden = false;
  if (!fromHash) {
    history.replaceState(null, "", "#/trophy/" + id);
  }
}

function closeDetail() {
  openTrophyId = null;
  detail.hidden = true;
  detailBody.innerHTML = "";
}

function handleToggle(id) {
  toggleEarned(id);
  refreshProgress();
  if (openTrophyId === id) {
    const trophy = trophies.find((item) => item.id === id);
    if (trophy) renderDetail(detailBody, trophy, isEarned(id), handleToggle, spoilersHidden());
  }
  render();
}

function wireToolbar() {
  searchInput.addEventListener("input", () => render());
  kindFilter.addEventListener("change", () => render());
  gradeFilter.addEventListener("change", () => render());
  earnedFilter.addEventListener("change", () => render());
  spoilerToggle.checked = spoilersHidden();
  spoilerToggle.addEventListener("change", () => {
    setSpoilersHidden(spoilerToggle.checked);
    render();
  });
  exportBtn.addEventListener("click", () => exportProgress());
  importFile.addEventListener("change", async () => {
    const file = importFile.files && importFile.files[0];
    if (!file) return;
    try {
      const count = await importProgressFile(file);
      spoilerToggle.checked = spoilersHidden();
      render();
      alert("Imported progress: " + count + " trophies earned.");
    } catch (err) {
      alert(err.message || "That file could not be imported.");
    }
    importFile.value = "";
  });
  resetBtn.addEventListener("click", () => {
    if (window.confirm("Clear all earned trophies and reset the spoiler setting?")) {
      resetProgress();
      spoilerToggle.checked = spoilersHidden();
      render();
    }
  });
  detailClose.addEventListener("click", () => {
    closeDetail();
    history.replaceState(null, "", "#/checklist");
    render();
  });
}

async function boot() {
  wireToolbar();
  try {
    const [trophyRes, roadmapRes] = await Promise.all([
      fetch("./data/trophies.json"),
      fetch("./data/roadmap.json"),
    ]);
    if (!trophyRes.ok || !roadmapRes.ok) throw new Error("Data files did not load.");
    const trophyData = await trophyRes.json();
    const roadmapData = await roadmapRes.json();
    trophies = Array.isArray(trophyData) ? trophyData : trophyData.trophies || [];
    roadmap = roadmapData;
  } catch (_err) {
    view.innerHTML = "<p class='empty'>The trophy data could not be loaded. Reload the page — this app works offline once its files are served.</p>";
    return;
  }
  window.addEventListener("hashchange", render);
  render();
}

boot();
