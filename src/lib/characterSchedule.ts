import { FINAL_NIGHT, TOTAL_VISITORS } from './gameConfig';
import { mainCharacters } from './characters/mainCharacters';
import { randomCharacters } from './characters/roster';
import type { GameCharacter } from './characters/types';

export type RunContext = { helped: number; refused: number; supplies: number; hadMimicInside: boolean };

export type CharacterSchedule = Record<number, GameCharacter[]>;

const randomFloat = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const hashId = (id: string) => [...id].reduce((total, char) => total + char.charCodeAt(0), 0);

const shuffle = <T,>(items: T[], seed: number) => [...items].sort((a, b) => {
  const left = a as { id?: string };
  const right = b as { id?: string };
  const aKey = randomFloat(seed + hashId(left.id ?? String(items.indexOf(a))) * 13);
  const bKey = randomFloat(seed + hashId(right.id ?? String(items.indexOf(b))) * 17);
  return aKey - bKey;
});

const emptySchedule = (): CharacterSchedule =>
  Array.from({ length: FINAL_NIGHT }, (_, index) => index + 1).reduce<CharacterSchedule>(
    (schedule, night) => ({ ...schedule, [night]: [] }),
    {},
  );

export function createCharacterSchedule(seed = Date.now()) {
  const schedule = emptySchedule();
  const mainPool = shuffle(mainCharacters, seed);
  const randomPool = shuffle(randomCharacters, seed + 401);
  const selected = [...mainPool, ...randomPool.slice(0, 10)];
  const visitorDeck = shuffle(selected, seed + 907);

  for (let night = 1; night <= FINAL_NIGHT; night += 1) {
    const start = (night - 1) * TOTAL_VISITORS;
    schedule[night] = visitorDeck.slice(start, start + TOTAL_VISITORS);
  }

  return schedule;
}

export function scheduledCharacter(
  schedule: CharacterSchedule,
  night: number,
  visitorIndex: number,
  context: RunContext,
) {
  void context;
  return schedule[night]?.[visitorIndex - 1]
    ?? randomCharacters[(night * visitorIndex) % randomCharacters.length];
}
