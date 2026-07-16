import type { GameStatus } from './gameTypes';

export const TOTAL_VISITORS = 10;
export const STARTING_LIVES = 3;
export const FINAL_NIGHT = 5;

export const encounterDelay = () => 3200 + Math.random() * 2800;

export function gameSubtitle(status: GameStatus) {
  if (status === 'won') return 'The sun has cleared the ridge.';
  if (status === 'waiting') return 'The room settles. The fire is the only thing answering.';
  if (status === 'knocking') return 'Someone is outside. The peephole is dark.';
  if (status === 'jumpscare') return 'Something smiles from the dark hallway.';
  return 'Listen closely. Look twice. Dawn is far away.';
}
