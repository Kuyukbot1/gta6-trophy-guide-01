# Leonida Trophy Atlas — GTA VI PS5 Trophy Guide & Tracker

[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Kuyukbot1/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Kuyukbot1/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all 55 Grand Theft Auto VI PlayStation 5 trophies, built for the [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01) bounty on make.fun.

## What it does

- **Checklist of all 55 trophies** — official names, descriptions and grades (1 platinum, 2 gold, 6 silver, 46 bronze), with a tick box per trophy and a progress bar. Progress is saved on the device (localStorage) and can be exported or imported as JSON.
- **A guide for every trophy, in the Atlas's own words**, with its sources named beside it. Five trophies have no confirmed method yet — their guides say so plainly instead of guessing.
- **The one missable trophy flagged** — Positive Mental Attitude (meditate at every spot; the Chapter 1 meditation at Jason's house may not come back). Everything else is safe in free roam after the story.
- **Platinum roadmap** — three stages, about 200 hours, one playthrough, no online trophies, plus what 100% completion actually needs.
- **Filters** — by kind (story, side quests, collectibles, activities, crime, money, 100% completion, odd & unconfirmed, platinum), by grade, by earned/not earned, and by search.
- **Spoiler setting** — on by default, it hides story trophies until you earn them. Earned story trophies are never masked.
- **Fully offline** — static files under `app/`, no network request at run time.

## Sources

Guides were written from live research on 20 November 2026: PowerPyx's GTA 6 Trophy Guide & Roadmap and 100% Completion Checklist, Exophase's Grand Theft Auto VI trophy list, and gtaspotter's trophy table. The Sources page inside the app lists them all with what each was used for.

## Try it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `buildDossier`.

## Layout

- `app/index.html` — the page shell: masthead, progress, tabs, toolbar, detail panel
- `app/style.css` — the sun-bleached paper theme
- `app/app.js` — boot and hash routing
- `app/store.js` — progress in localStorage, export/import, reset
- `app/filters.js` — kind/grade/search/earned filtering and the spoiler rule
- `app/views.js` — checklist, guide panel, roadmap, missables and sources pages
- `app/data/trophies.json` — all 55 trophies with grade, kind, missable flag, roadmap stage, guide and sources
- `app/data/roadmap.json` — the three-stage roadmap and the 100% checklist
- `screenshots/` — four real renders of the working app
- `main.ts` — hand-in program; `serve.ts` — local preview server

## License

MIT — see `LICENSE`.
