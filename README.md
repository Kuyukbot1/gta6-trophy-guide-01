[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Kuyukbot1/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Kuyukbot1/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Platinum — GTA VI Trophy Guide & Tracker

An offline guide and tracker for all 55 Grand Theft Auto VI PlayStation 5
trophies: the official list with saved progress, filters and a spoiler
setting, a roadmap to the platinum, the missable trophies flagged, and a
guide to each trophy in our own words that cites its sources.

## What it does

- **Checklist** — every trophy with its official name, description and grade;
  tick one off and it stays ticked (localStorage), with export and import.
- **Filters** — by kind (story, missable, collectibles, activities, side
  missions, robberies, combat, money), by grade, by earned, plus search.
- **Spoiler-free mode** — hides the names and descriptions of story
  trophies until they are earned.
- **Roadmap to the platinum** — three stages (story 60–80h, 100% checklist
  ~100h, clean-up ~10h), built from the official descriptions and
  PowerPyx's guide; about 200 hours at 4/10 difficulty, one playthrough,
  zero online trophies.
- **Missables** — the one potentially missable trophy (Positive Mental
  Attitude, Chapter 1 meditation) plus the chapter-save strategy.
- **Cited guides** — every trophy's guide names its sources (PowerPyx's
  trophy guide and Exophase's official list). Where a method is still being
  confirmed, the guide says so instead of guessing.

## Run it

```sh
node serve.ts   # then open http://localhost:8080
```

No build step, no network: every file the app loads lives under `app/`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
to the output directory and writes `dossier.json` with the vendored
make.fun library.

## Sources

- Exophase — Grand Theft Auto VI Trophies (PS5), official names,
  descriptions and grades, checked live 2026-11-20.
- PowerPyx — GTA 6 Trophy Guide & Roadmap, methods, counts, roadmap and
  missable warnings.
- PSNProfiles — Grand Theft Auto VI Trophies, cross-check of the list and
  PSN progress counts.

An independent fan guide. Not affiliated with Rockstar Games, Sony or
PlayStation. No Rockstar artwork or logos are used.

## License

MIT — see [LICENSE](LICENSE).
