// Leonida Trophy Atlas — hand-in program.
//
// Copies the app and its screenshots into the output directory and writes
// the dossier the competition's library computes from them. Run it as:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output. The program
// is deterministic: the same input files always produce the same dossier.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function freshOutputDirectory(path) {
  if (existsSync(path)) rmSync(path, { recursive: true, force: true });
  mkdirSync(path, { recursive: true });
}

function handIn() {
  freshOutputDirectory(outputDir);

  const appSource = join(repoRoot, "app");
  const shotsSource = join(repoRoot, "screenshots");
  cpSync(appSource, join(outputDir, "app"), { recursive: true });
  cpSync(shotsSource, join(outputDir, "screenshots"), { recursive: true });

  const dossier = buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  });
  writeFileSync(join(outputDir, "dossier.json"), dossier, "utf8");
  console.log("Handed in: " + outputDir + "/dossier.json (" + dossier.length + " bytes)");
}

handIn();
