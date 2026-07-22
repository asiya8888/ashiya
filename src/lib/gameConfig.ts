import type { GameStatus } from './gameTypes';

export const TOTAL_VISITORS = 5;
export const STARTING_LIVES = 3;
export const STARTING_SUPPLIES = 4;
export const FINAL_NIGHT = 5;
export const QUESTIONS_PER_VISITOR = 3;

export const encounterDelay = () => 3000 + Math.random() * 2000;
export const emptyEncounterDelay = () => 5000 + Math.random() * 2500;

export function gameSubtitle(status: GameStatus) {
  if (status === 'won') return 'The sun has cleared the ridge.';
  if (status === 'waiting') return 'Waiting for the next knock.';
  if (status === 'knocking') return 'Someone is outside. The peephole is dark.';
  if (status === 'jumpscare') return 'Something smiles from the dark hallway.';
  return 'Listen closely. Look twice. Dawn is far away.';
}
