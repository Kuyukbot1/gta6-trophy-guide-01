// Progress store for the Leonida Trophy Atlas.
// Earned trophy ids and the spoiler setting live in localStorage on this
// device only; nothing is sent anywhere. Import/export move the same JSON
// as a file, so progress can be carried to another browser by hand.

const STORAGE_KEY = "gta6-trophy-atlas-v1";

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { earned: [], hideSpoilers: true };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { earned: [], hideSpoilers: true };
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned.filter((id) => typeof id === "string") : [],
      hideSpoilers: parsed.hideSpoilers !== false,
    };
  } catch (_err) {
    return { earned: [], hideSpoilers: true };
  }
}

function writeStore(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_err) {
    // Storage full or blocked: progress just does not persist this time.
  }
}

let state = readStore();

export function earnedIds() {
  return new Set(state.earned);
}

export function isEarned(id) {
  return state.earned.includes(id);
}

export function toggleEarned(id) {
  const at = state.earned.indexOf(id);
  if (at >= 0) state.earned.splice(at, 1);
  else state.earned.push(id);
  writeStore(state);
  return state.earned.includes(id);
}

export function earnedCount() {
  return state.earned.length;
}

export function spoilersHidden() {
  return state.hideSpoilers;
}

export function setSpoilersHidden(hidden) {
  state.hideSpoilers = hidden;
  writeStore(state);
}

export function exportProgress() {
  const blob = new Blob([JSON.stringify({ earned: state.earned, hideSpoilers: state.hideSpoilers }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "gta6-trophy-atlas-progress.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function importProgressFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.earned)) {
          reject(new Error("That file does not look like an Atlas progress export."));
          return;
        }
        state = {
          earned: parsed.earned.filter((id) => typeof id === "string"),
          hideSpoilers: parsed.hideSpoilers !== false,
        };
        writeStore(state);
        resolve(state.earned.length);
      } catch (_err) {
        reject(new Error("That file does not look like an Atlas progress export."));
      }
    };
    reader.readAsText(file);
  });
}

export function resetProgress() {
  state = { earned: [], hideSpoilers: true };
  writeStore(state);
}
