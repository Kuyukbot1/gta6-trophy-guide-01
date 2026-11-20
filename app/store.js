// Save data: which trophies are earned lives in localStorage, and can be
// downloaded to a file and loaded back. Nothing ever leaves the browser.
export const PROGRESS_KEY = 'leonida-platinum-progress-v1';
export const SETTINGS_KEY = 'leonida-platinum-settings-v1';

export function readProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return new Set();
    return new Set(ids.filter((id) => Number.isInteger(id) && id >= 1 && id <= 55));
  } catch {
    return new Set();
  }
}

export function writeProgress(done) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...done].sort((a, b) => a - b)));
}

export function readPrefs() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { spoiler: false };
    const parsed = JSON.parse(raw);
    return { spoiler: parsed.spoiler === true };
  } catch {
    return { spoiler: false };
  }
}

export function writePrefs(prefs) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(prefs));
}

export function downloadProgress(done) {
  const blob = new Blob(
    [JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...done].sort((a, b) => a - b) }, null, 2)],
    { type: 'application/json' },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function parseProgressFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const ids = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(ids)) throw new Error('not a progress file');
  const valid = ids.filter((id) => Number.isInteger(id) && id >= 1 && id <= 55);
  if (valid.length === 0 && ids.length > 0) throw new Error('no valid trophy ids');
  return new Set(valid);
}
