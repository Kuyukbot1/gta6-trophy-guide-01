// Filtering: kind chips, grade, search text, earned-only, and the spoiler
// rule. A story trophy stays hidden while spoiler mode is on and it is
// not yet earned.
export const KIND_NAMES = {
  all: 'All',
  story: 'Story',
  missable: 'Missable',
  collectible: 'Collectibles',
  activity: 'Activities',
  side: 'Side missions',
  robbery: 'Robberies',
  combat: 'Combat',
  money: 'Money & property',
};

export const KIND_SEQUENCE = ['all', 'story', 'missable', 'collectible', 'activity', 'side', 'robbery', 'combat', 'money'];

export function spoilerHides(trophy, done, spoilerOn) {
  return spoilerOn && trophy.kind === 'story' && !done.has(trophy.id);
}

function matchesQuery(trophy, query) {
  if (!query) return true;
  const haystack = `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.kind}`.toLowerCase();
  return haystack.includes(query);
}

export function filterTrophies(trophies, ui, done) {
  const query = ui.query.trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (ui.kind === 'missable') {
      if (!trophy.missable) return false;
    } else if (ui.kind !== 'all' && trophy.kind !== ui.kind) {
      return false;
    }
    if (ui.grade !== 'all' && trophy.grade !== ui.grade) return false;
    if (ui.earnedOnly && !done.has(trophy.id)) return false;
    return matchesQuery(trophy, query);
  });
}
