// Views for the Leonida Trophy Atlas: checklist, trophy guide panel,
// platinum roadmap, missables page and sources page. All rendering is plain
// DOM built from the trophy and roadmap data; nothing here fetches the
// network, and every string that comes from data is escaped before it is
// placed in HTML.

import { filterTrophies, gradeLabel, kindLabel, spoilerMasked } from "./filters.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function updateProgress(earned, total) {
  const fill = document.getElementById("progress-fill");
  const count = document.getElementById("earned-count");
  const pct = document.getElementById("earned-pct");
  const state = document.getElementById("platinum-state");
  if (!fill || !count || !pct || !state) return;
  const percent = total > 0 ? Math.round((earned / total) * 100) : 0;
  fill.style.width = percent + "%";
  count.textContent = String(earned);
  pct.textContent = percent + "%";
  state.textContent = earned >= total && total > 0 ? "Platinum earned — Leonida Legend!" : "Platinum not yet earned";
}

function trophyRow(trophy, earnedSet, hideSpoilers, onToggle, onOpen) {
  const li = document.createElement("li");
  li.className = "trophy" + (earnedSet.has(trophy.id) ? " earned" : "");
  const masked = spoilerMasked(trophy, hideSpoilers, earnedSet);
  if (masked) li.classList.add("spoiler-hidden");
  const earned = earnedSet.has(trophy.id);

  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "trophy-check";
  check.checked = earned;
  check.setAttribute("aria-label", "Mark " + trophy.name + " as earned");
  check.addEventListener("change", () => onToggle(trophy.id));
  li.appendChild(check);

  const body = document.createElement("div");
  const name = document.createElement("p");
  name.className = "trophy-name";
  const link = document.createElement("a");
  link.href = "#/trophy/" + trophy.id;
  link.textContent = masked ? "Hidden story trophy" : trophy.name;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    onOpen(trophy.id);
  });
  name.appendChild(link);
  body.appendChild(name);

  const desc = document.createElement("p");
  desc.className = "trophy-desc";
  desc.textContent = masked ? "Earn it in the story to reveal what it is." : trophy.description;
  body.appendChild(desc);

  const tags = document.createElement("div");
  tags.className = "trophy-tags";
  const gradeTag = document.createElement("span");
  gradeTag.className = "tag grade-" + trophy.grade;
  gradeTag.textContent = gradeLabel(trophy.grade);
  tags.appendChild(gradeTag);
  const kindTag = document.createElement("span");
  kindTag.className = "tag";
  kindTag.textContent = kindLabel(trophy.kind);
  tags.appendChild(kindTag);
  if (trophy.missable) {
    const miss = document.createElement("span");
    miss.className = "tag missable";
    miss.textContent = "Missable";
    tags.appendChild(miss);
  }
  if (trophy.hidden) {
    const hid = document.createElement("span");
    hid.className = "tag spoiler";
    hid.textContent = "Hidden on PSN";
    tags.appendChild(hid);
  }
  body.appendChild(tags);
  li.appendChild(body);

  const guideBtn = document.createElement("button");
  guideBtn.type = "button";
  guideBtn.className = "trophy-guide-btn";
  guideBtn.textContent = "Guide";
  guideBtn.addEventListener("click", () => onOpen(trophy.id));
  li.appendChild(guideBtn);
  return li;
}

export function renderChecklist(view, trophies, options) {
  view.innerHTML = "";
  const head = document.createElement("div");
  head.className = "view-head";
  head.innerHTML =
    "<h2>Checklist — all 55 trophies</h2>" +
    "<p>Tick a trophy off when it pops. Use the filters above to narrow the list, and open any trophy for its guide and sources. Story trophies stay hidden while the spoiler setting is on.</p>";
  view.appendChild(head);

  const shown = filterTrophies(trophies, options);
  const countLine = document.createElement("p");
  countLine.className = "count-line";
  countLine.innerHTML =
    "Showing <strong>" +
    shown.length +
    "</strong> of " +
    trophies.length +
    " trophies · <strong>" +
    options.earnedSet.size +
    "</strong> earned";
  view.appendChild(countLine);

  if (shown.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No trophies match those filters. Clear the search or widen the filters.";
    view.appendChild(empty);
    return;
  }

  const list = document.createElement("ul");
  list.className = "trophy-list";
  for (const trophy of shown) {
    list.appendChild(trophyRow(trophy, options.earnedSet, options.hideSpoilers, options.onToggle, options.onOpen));
  }
  view.appendChild(list);
}

export function renderDetail(body, trophy, earned, onToggle, hideSpoilers) {
  const masked = hideSpoilers && trophy.hidden === true && trophy.kind === "story" && !earned;
  body.innerHTML = "";
  if (masked) {
    const title = document.createElement("h2");
    title.textContent = "Hidden story trophy";
    body.appendChild(title);
    const desc = document.createElement("p");
    desc.className = "trophy-desc";
    desc.textContent = "This trophy's name, description and guide are hidden while the spoiler setting is on. Earn it in the story to reveal it, or turn the spoiler setting off.";
    body.appendChild(desc);
    const earnRow = document.createElement("div");
    earnRow.className = "earn-row";
    const earnBtn = document.createElement("button");
    earnBtn.type = "button";
    earnBtn.textContent = "Mark as earned";
    earnBtn.addEventListener("click", () => onToggle(trophy.id));
    earnRow.appendChild(earnBtn);
    const hint = document.createElement("span");
    hint.textContent = "Tick it off when it pops on your console.";
    earnRow.appendChild(hint);
    body.appendChild(earnRow);
    return;
  }
  const tags = document.createElement("div");
  tags.className = "trophy-tags";
  const gradeTag = document.createElement("span");
  gradeTag.className = "tag grade-" + trophy.grade;
  gradeTag.textContent = gradeLabel(trophy.grade);
  tags.appendChild(gradeTag);
  const kindTag = document.createElement("span");
  kindTag.className = "tag";
  kindTag.textContent = kindLabel(trophy.kind);
  tags.appendChild(kindTag);
  if (trophy.missable) {
    const miss = document.createElement("span");
    miss.className = "tag missable";
    miss.textContent = "Missable";
    tags.appendChild(miss);
  }
  body.appendChild(tags);

  const title = document.createElement("h2");
  title.textContent = trophy.name;
  body.appendChild(title);

  const desc = document.createElement("p");
  desc.className = "trophy-desc";
  desc.textContent = trophy.description;
  body.appendChild(desc);

  if (trophy.missable) {
    const callout = document.createElement("p");
    callout.className = "guide-text";
    const warn = document.createElement("span");
    warn.className = "missable-callout";
    warn.textContent = "Missable — do the Chapter 1 meditation at Jason's house right after the mission Down to Earth. It may not come back.";
    callout.appendChild(warn);
    body.appendChild(callout);
  }

  const guideHead = document.createElement("h3");
  guideHead.textContent = "Guide";
  body.appendChild(guideHead);
  const guide = document.createElement("p");
  guide.className = "guide-text";
  guide.textContent = trophy.guide;
  body.appendChild(guide);

  const sourcesHead = document.createElement("h3");
  sourcesHead.textContent = "Sources";
  body.appendChild(sourcesHead);
  const sources = document.createElement("ul");
  sources.className = "source-list";
  for (const source of trophy.sources || []) {
    const item = document.createElement("li");
    item.textContent = source;
    sources.appendChild(item);
  }
  body.appendChild(sources);

  const earnRow = document.createElement("div");
  earnRow.className = "earn-row";
  const earnBtn = document.createElement("button");
  earnBtn.type = "button";
  earnBtn.className = earned ? "earned-now" : "";
  earnBtn.textContent = earned ? "Earned — undo" : "Mark as earned";
  earnBtn.addEventListener("click", () => onToggle(trophy.id));
  earnRow.appendChild(earnBtn);
  const hint = document.createElement("span");
  hint.textContent = earned ? "This one is done. Untick it if that was a mistake." : "Tick it off when it pops on your console.";
  earnRow.appendChild(hint);
  body.appendChild(earnRow);
  void masked;
}

export function renderRoadmap(view, roadmap, trophies) {
  view.innerHTML = "";
  const head = document.createElement("div");
  head.className = "view-head";
  head.innerHTML =
    "<h2>Roadmap to the platinum</h2>" +
    "<p>One playthrough, about 200 hours, no online trophies. The guide community's route, in three stages — the facts below come from PowerPyx's roadmap and 100% checklist.</p>";
  view.appendChild(head);

  const facts = document.createElement("div");
  facts.className = "facts";
  const factItems = [
    [roadmap.facts.difficulty, "Difficulty"],
    [roadmap.facts.hours, "Hours to platinum"],
    [String(roadmap.facts.playthroughs), "Playthroughs"],
    [String(roadmap.facts.online), "Online trophies"],
    [String(roadmap.facts.missable), "Missable trophy"],
    ["15 + 1", "Manual + autosave slots"],
  ];
  for (const [value, label] of factItems) {
    const fact = document.createElement("div");
    fact.className = "fact";
    fact.innerHTML = "<b>" + escapeHtml(value) + "</b><span>" + escapeHtml(label) + "</span>";
    facts.appendChild(fact);
  }
  view.appendChild(facts);

  for (const stage of roadmap.stages) {
    const card = document.createElement("section");
    card.className = "stage";
    const title = document.createElement("h3");
    title.textContent = "Stage " + stage.n + " — " + stage.title;
    card.appendChild(title);
    const hours = document.createElement("p");
    hours.className = "stage-hours";
    hours.textContent = stage.hours;
    card.appendChild(hours);
    const body = document.createElement("p");
    body.textContent = stage.body;
    card.appendChild(body);
    const list = document.createElement("ul");
    for (const focus of stage.focus) {
      const item = document.createElement("li");
      item.textContent = focus;
      list.appendChild(item);
    }
    card.appendChild(list);
    view.appendChild(card);
  }

  const notes = document.createElement("section");
  notes.className = "check100";
  notes.innerHTML = "<h3>What 100% completion actually needs</h3>";
  const list = document.createElement("ul");
  for (const item of roadmap.checklist100) {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  }
  notes.appendChild(list);
  const replay = document.createElement("p");
  replay.textContent = roadmap.facts.replay + " " + roadmap.facts.cheats + " " + roadmap.facts.freeroam;
  notes.appendChild(replay);
  view.appendChild(notes);
  void trophies;
}

export function renderMissables(view, trophies, earnedSet, hideSpoilers) {
  view.innerHTML = "";
  const head = document.createElement("div");
  head.className = "view-head";
  head.innerHTML =
    "<h2>Missables</h2>" +
    "<p>Only one trophy in the whole set can be missed. Everything else is available in free roam after the story.</p>";
  view.appendChild(head);

  const missable = trophies.filter((trophy) => trophy.missable);
  for (const trophy of missable) {
    const card = document.createElement("article");
    card.className = "missable-card";
    const title = document.createElement("h3");
    title.textContent = trophy.name + " — " + gradeLabel(trophy.grade);
    card.appendChild(title);
    const desc = document.createElement("p");
    desc.textContent = trophy.description;
    card.appendChild(desc);
    const guide = document.createElement("p");
    guide.textContent = trophy.guide;
    card.appendChild(guide);
    const state = document.createElement("p");
    state.innerHTML = earnedSet.has(trophy.id)
      ? "<strong>Done.</strong> You already have this one — nothing to worry about."
      : "<strong>Not yet earned.</strong> Do it in Chapter 1, right after Down to Earth.";
    card.appendChild(state);
    view.appendChild(card);
  }

  const safe = document.createElement("div");
  safe.className = "safe-note";
  safe.innerHTML =
    "<h3>Everything else is safe</h3>" +
    "<p>All 54 other trophies can be earned after the story in free roam, and there is no mission replay to worry about. The 100% checklist opens after the story and counts progress made during it. Keep cheats off — they disable trophies and saving.</p>";
  view.appendChild(safe);
  void hideSpoilers;
}

export function renderSources(view) {
  view.innerHTML = "";
  const head = document.createElement("div");
  head.className = "view-head";
  head.innerHTML =
    "<h2>Sources</h2>" +
    "<p>Where every fact in this atlas comes from. The guides are written in the Atlas's own words; the official names and descriptions are the game's, as published by these sources.</p>";
  view.appendChild(head);

  const pages = [
    {
      title: "PowerPyx — GTA 6 Trophy Guide & Roadmap",
      body: "The main source for the roadmap and the per-trophy methods: difficulty 4/10, about 200 hours, one playthrough, no mission replay, the Chapter 1 meditation warning, and the stage-by-stage plan.",
      items: ["All 55 trophy names, descriptions and grades", "Roadmap stages and 100% completion notes", "The five trophies with no confirmed method yet"],
    },
    {
      title: "PowerPyx — GTA 6 100% Completion Checklist & Guide",
      body: "The checklist behind the A Long Road trophy: what the 100% list actually requires, and what it lets slide.",
      items: ["70 of 80 challenges is enough", "Robberies, underwater discoveries, shooting ranges, drone races and Bret's quests need everything", "200 vehicles, 100 animals, 15 of 18 meditations, 300 stunts"],
    },
    {
      title: "Exophase — Grand Theft Auto VI Trophies",
      body: "The live trophy list used to cross-check all 55 names, descriptions and grades in order.",
      items: ["55 trophies in the official order", "1 platinum, 2 gold, 6 silver, 46 bronze", "28 hidden trophies on PlayStation"],
    },
    {
      title: "PowerPyx — GTA 6 trophy guide series (per-topic guides)",
      body: "The deeper guides linked from the main roadmap, used for the counts inside individual trophies.",
      items: ["All 100 WAiNK It locations", "All 18 collectible card set locations", "All 12 shooting ranges and 42 gold medals", "All 14 drone race locations", "All 40 unique race locations", "All 80 challenges", "All 18 meditation spots and 10 locations", "All 9 gangs and 39 illegal gang operations", "All 557 vehicles"],
    },
    {
      title: "gtaspotter — GTA 6 Trophies and Achievements",
      body: "A third cross-check for the full list and grades, and for which trophies spoil the story.",
      items: ["Full 55-trophy table with grades", "26 trophies flagged as story spoilers"],
    },
  ];

  for (const page of pages) {
    const card = document.createElement("section");
    card.className = "source-page";
    const title = document.createElement("h3");
    title.textContent = page.title;
    card.appendChild(title);
    const body = document.createElement("p");
    body.textContent = page.body;
    card.appendChild(body);
    const list = document.createElement("ul");
    for (const item of page.items) {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    }
    card.appendChild(list);
    view.appendChild(card);
  }

  const note = document.createElement("p");
  note.className = "count-line";
  note.textContent = "All sources were read on 20 November 2026. If a guide's method changes as the community confirms it, this atlas will be updated — the five unconfirmed trophies are marked as such in their guides.";
  view.appendChild(note);
}
