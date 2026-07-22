import type { Visitor } from './visitors';

export type ChoiceResult = {
  diary: boolean;
  livesLost: number;
  message: string;
  suppliesLost: number;
  gameOver: boolean;
  jumpscare: boolean;
};

export function resolveChoice(visitor: Visitor, choice: 'allow' | 'refuse'): ChoiceResult {
  if (visitor.kind === 'skinwalker' && choice === 'allow') {
    return { diary: false, livesLost: 0, message: 'The latch lifts. For one second, the figure outside wears your face.', suppliesLost: 0, gameOver: true, jumpscare: true };
  }

  if (visitor.kind === 'human' && choice === 'refuse') {
    return { diary: false, livesLost: 1, message: 'Their steps fade into the storm. A scream follows before they reach the trees.', suppliesLost: 0, gameOver: false, jumpscare: false };
  }

  if (visitor.kind === 'empty') {
    return { diary: Math.random() > 0.65, livesLost: 0, message: 'The doorway opens to snow and nothing else.', suppliesLost: 0, gameOver: false, jumpscare: false };
  }

  if (visitor.kind === 'skinwalker') {
    return { diary: false, livesLost: 0, message: 'It waits without breathing. At dawn, the footprints still end at your door.', suppliesLost: 0, gameOver: false, jumpscare: false };
  }

  return { diary: false, livesLost: 0, message: 'They cross the threshold. By the fire, color slowly returns to their hands.', suppliesLost: 0, gameOver: false, jumpscare: false };
}
