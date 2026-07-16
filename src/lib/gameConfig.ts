import type { GameStatus } from './gameTypes';

export const TOTAL_VISITORS = 10;
export const STARTING_LIVES = 3;
export const STARTING_SUPPLIES = 4;
export const FINAL_NIGHT = 5;

export const encounterDelay = () => 10000 + Math.random() * 10000;

export function gameSubtitle(status: GameStatus) {
  if (status === 'won') return 'The sun has cleared the ridge.';
  if (status === 'waiting') return 'The room settles. For a while, nothing asks to be let in.';
  if (status === 'knocking') return 'Someone is outside. The peephole is dark.';
  if (status === 'jumpscare') return 'Something smiles from the dark hallway.';
  return 'Listen closely. Look twice. Dawn is far away.';
}
