import { mainCharacters } from './mainCharacters';
import { randomCharactersA } from './randomCharactersA';
import { randomCharactersB } from './randomCharactersB';
import { randomCharactersC } from './randomCharactersC';
import { rareCharacters } from './rareCharacters';
import type { GameCharacter } from './types';

const bonusRandomCharacters = rareCharacters.slice(0, 5).map((character) => ({
  ...character,
  tier: 'random' as const,
  rareCondition: undefined,
}));

export const randomCharacters = [
  ...randomCharactersA,
  ...randomCharactersB,
  ...randomCharactersC,
  ...bonusRandomCharacters,
];
export const allCharacters = [...mainCharacters, ...randomCharacters];

export function findCharacter(id: string) {
  return allCharacters.find((character) => character.id === id);
}

export function assertRosterComplete() {
  const ids = new Set(allCharacters.map((character) => character.id));
  const expectedCounts: Record<GameCharacter['tier'], number> = { main: 15, random: 50, rare: 0 };
  const counts = allCharacters.reduce<Record<GameCharacter['tier'], number>>(
    (total, character) => ({ ...total, [character.tier]: total[character.tier] + 1 }),
    { main: 0, random: 0, rare: 0 },
  );

  return ids.size === 65 && allCharacters.length === 65 &&
    counts.main === expectedCounts.main &&
    counts.random === expectedCounts.random &&
    counts.rare === expectedCounts.rare;
}
