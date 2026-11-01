const SEARCH_TOKEN_ALIASES: Record<string, string[]> = {
  ileke: ['bead', 'beads', 'beadwork'],
  bead: ['ileke'],
  beads: ['ileke'],
  beadwork: ['ileke'],
};

export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function tokenize(value: string): string[] {
  return normalizeSearchText(value).split(' ').filter(Boolean);
}

/** True when `word` is the token itself or an inflection of it (weave, weaving, weavers). */
function isInflectionOf(token: string, word: string): boolean {
  if (token.length < 4 || word.length < 4) return false;
  const [shorter, longer] = token.length <= word.length ? [token, word] : [word, token];
  const stem = shorter.length > 4 && shorter.endsWith('e') ? shorter.slice(0, -1) : shorter;
  return longer.startsWith(stem);
}

/** Match every meaningful query token against a searchable fixture field. */
export function matchesSearchQuery(query: string, searchableValues: string[]): boolean {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return true;

  const searchableTokens = new Set(tokenize(searchableValues.join(' ')));

  return queryTokens.every((token) => {
    if (searchableTokens.has(token)) return true;

    const aliases = SEARCH_TOKEN_ALIASES[token] ?? [];
    if (aliases.some((alias) => searchableTokens.has(alias))) return true;

    return [...searchableTokens].some((word) => isInflectionOf(token, word));
  });
}

/**
 * Count how many of a fixture's keywords appear as whole words (or inflections)
 * in the query. Whole-word matching stops "aso" firing on "reason" and "cast"
 * firing on "broadcast", which plain substring checks did.
 */
export function countKeywordHits(query: string, keywords: string[]): number {
  const queryTokens = tokenize(query);
  let hits = 0;
  for (const keyword of keywords) {
    const keywordTokens = tokenize(keyword);
    if (keywordTokens.length === 0) continue;
    const found = keywordTokens.every((kt) =>
      queryTokens.some((qt) => qt === kt || isInflectionOf(kt, qt)),
    );
    if (found) hits += 1;
  }
  return hits;
}

/** Pick the fixture whose keywords best match the query, or null when none match. */
export function bestKeywordMatch<K extends string>(query: string, table: Record<K, string[]>): K | null {
  let best: K | null = null;
  let bestHits = 0;
  for (const key of Object.keys(table) as K[]) {
    const hits = countKeywordHits(query, table[key]);
    if (hits > bestHits) {
      best = key;
      bestHits = hits;
    }
  }
  return best;
}
