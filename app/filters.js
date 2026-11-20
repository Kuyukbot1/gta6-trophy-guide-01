// Filtering and the spoiler rule for the Leonida Trophy Atlas.
// A trophy is spoiler-masked when the spoiler setting is on, the trophy is
// a story trophy the player has not earned yet, and it is marked hidden.
// Earned story trophies are never masked: earning one is the reveal.

export function spoilerMasked(trophy, hideSpoilers, earnedSet) {
  return hideSpoilers && trophy.hidden === true && trophy.kind === "story" && !earnedSet.has(trophy.id);
}

export function filterTrophies(trophies, options) {
  const query = (options.query || "").trim().toLowerCase();
  const kind = options.kind || "all";
  const grade = options.grade || "all";
  const earned = options.earned || "all";
  const earnedSet = options.earnedSet || new Set();

  return trophies.filter((trophy) => {
    if (kind !== "all" && trophy.kind !== kind) return false;
    if (grade !== "all" && trophy.grade !== grade) return false;
    if (earned === "earned" && !earnedSet.has(trophy.id)) return false;
    if (earned === "unearned" && earnedSet.has(trophy.id)) return false;
    if (query) {
      const haystack = [trophy.name, trophy.description, trophy.guide, trophy.kind, trophy.grade]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function gradeLabel(grade) {
  switch (grade) {
    case "platinum":
      return "Platinum";
    case "gold":
      return "Gold";
    case "silver":
      return "Silver";
    case "bronze":
      return "Bronze";
    default:
      return grade;
  }
}

export function kindLabel(kind) {
  switch (kind) {
    case "story":
      return "Story";
    case "side":
      return "Side quest";
    case "collectibles":
      return "Collectibles";
    case "activities":
      return "Activities";
    case "crime":
      return "Crime";
    case "money":
      return "Money";
    case "completion":
      return "100% completion";
    case "misc":
      return "Odd & unconfirmed";
    case "platinum":
      return "Platinum";
    default:
      return kind;
  }
}
