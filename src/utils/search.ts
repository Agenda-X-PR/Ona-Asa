const SEARCH_TOKEN_ALIASES: Record<string, string[]> = {
  ileke: ['bead', 'beads', 'beadwork'],
  bead: ['ileke'],
  beads: ['ileke'],
  beadwork: ['ileke'],
};

export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/** Match every meaningful query token against a searchable fixture field. */
export function matchesSearchQuery(query: string, searchableValues: string[]): boolean {
  const queryTokens = normalizeSearchText(query).split(' ').filter(Boolean);
  if (queryTokens.length === 0) return true;

  const searchableTokens = new Set(
    normalizeSearchText(searchableValues.join(' ')).split(' ').filter(Boolean),
  );

  return queryTokens.every((token) => {
    if (searchableTokens.has(token)) return true;

    const aliases = SEARCH_TOKEN_ALIASES[token] ?? [];
    if (aliases.some((alias) => searchableTokens.has(alias))) return true;

    // Prefix matching supports common inflections such as weave/weaving/weavers.
    return token.length >= 4 && [...searchableTokens].some((word) =>
      word.length >= 4 && (word.startsWith(token) || token.startsWith(word)),
    );
  });
}
