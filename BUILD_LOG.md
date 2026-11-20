# Build log — gta6-trophy-guide-01 "Leonida Platinum"

Rebuilt 2026-11-20 in a recorded session (strict-transcripts, recording
01a1f975-13ac-753d-8101-f912b13aa5d5). The first build (local commit
aecbe8d) was complete and correct, but its recording could not be sealed
because session logs were rewritten while it ran — so every file in this
repo was re-authored in this session, except `vendor/makefun-frontend.ts`
(kit's copy, unchanged) and `LICENSE` (MIT, kit's copy).

## Research (checked live 2026-11-20, by the first build)

- Exophase trophy list (https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/):
  all 55 descriptions read live, in order, matching the kit's frozen list
  exactly on every description.
- PowerPyx GTA 6 Trophy Guide & Roadmap (https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/):
  full guide read — roadmap (4/10, ~200h, 1 playthrough, 0 online, 1
  potentially missable), 100% checklist details (200/277 vehicles, 100/255
  animals, 70/80 challenges), and a per-trophy method for all 55.
- PSNProfiles list (https://psnprofiles.com/trophies/43531-grand-theft-auto-vi):
  blocked by the site (HTTP 403) at research time; cited as the kit's
  cross-check source for the list and PSN counts, per competition.yaml.

## What was rebuilt (same design, re-authored in this session)

- `app/index.html` — shell: masthead + progress card, tabs, toolbar, list + detail pane.
- `app/style.css` — original dark "Vice City night" theme, no images or web fonts.
- `app/app.js` — boot, hash routing (#/checklist, #/roadmap, #/missables,
  #/sources, #/trophy/<id>), toolbar wiring.
- `app/store.js` — localStorage progress, export/import, spoiler setting.
- `app/filters.js` — kind/grade/search/earned filters + spoiler rule.
- `app/views.js` — checklist, detail pane, roadmap, missables, sources pages.
- `app/data/trophies.json` — all 55 official trophies (name, description,
  grade as PlayStation publishes them) + kind, missable flag, PSN target,
  own-words guide and sources per trophy.
- `app/data/roadmap.json` — 3-stage roadmap + platinum facts.
- `main.ts` — Node 22 stdlib; copies app/ + screenshots/ to /output and
  writes dossier.json via vendor/makefun-frontend.ts.
- `serve.ts` — tiny static server for local testing.
- `screenshots/` — 4 real Playwright Chromium renders at 1280x800, JPEG q82,
  progress seeded to 13/55 earned, retaken in this session.

## Verification

- trophies.json parses; 55 trophies; grades 1 platinum / 2 gold / 6 silver /
  46 bronze; every name matches the kit's frozen official list; every guide
  non-blank and citing PowerPyx + Exophase.
- `main.ts` runs twice, byte-identical output; dossier.json builds clean.
- App served offline (serve.ts), opened in Chromium with network checks:
  no console errors, no failed requests, progress saves and reloads,
  export/import round-trips, spoiler toggle masks story trophies.

## Final verification (this rebuild session, 2026-11-20)

- trophies.json parses; 55 trophies; grades 1 platinum / 2 gold / 6 silver /
  46 bronze; every name matches the kit's frozen official list (checked
  against the starter's list: 0 missing, 0 extra); every guide non-blank
  and citing PowerPyx + Exophase; exactly 1 missable.
- `main.ts` runs twice, byte-identical output; dossier.json builds clean
  (738,838 B, keys cover/images/schema/text).
- Playwright Chromium (CDP) functional tests: 55 checklist rows, 13/55
  seeded progress; toggle 13 -> 14 and persists across a real reload;
  spoiler mode masks 12 story rows; roadmap 3 stages + 8 facts; missables
  1 card; 0 console errors, 0 failed requests.
- 4 screenshots 1280x800 JPEG q82, retaken in this session and visually
  verified (130,844 / 135,685 / 145,887 / 103,402 B — all under 256 KiB):
  checklist with the Positive Mental Attitude guide open, roadmap,
  missables, spoiler mode masking story trophies.
