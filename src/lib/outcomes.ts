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
    return { diary: true, livesLost: 3, message: 'The room changes before you understand why.', suppliesLost: 0, gameOver: true, jumpscare: true };
  }

  if (visitor.kind === 'human' && choice === 'refuse') {
    return { diary: Math.random() > 0.45, livesLost: 1, message: 'The knocking stops. You cannot know how far they made it.', suppliesLost: 0, gameOver: false, jumpscare: false };
  }

  if (visitor.kind === 'human' && choice === 'allow' && visitor.outcome === 'injure') {
    return { diary: true, livesLost: 1, message: 'They survive the night, but panic turns the room dangerous for a moment.', suppliesLost: 0, gameOver: false, jumpscare: false };
  }

  if (visitor.kind === 'human' && choice === 'allow' && visitor.outcome === 'steal') {
    return { diary: false, livesLost: 0, message: 'They leave before dawn. Some supplies are missing, but the fire is still lit.', suppliesLost: 1, gameOver: false, jumpscare: false };
  }

  if (visitor.kind === 'empty') {
    return { diary: Math.random() > 0.65, livesLost: 0, message: 'The doorway opens to snow and nothing else.', suppliesLost: 0, gameOver: false, jumpscare: false };
  }

  return { diary: Math.random() > 0.55, livesLost: 0, message: 'The choice passes without proof that it was right.', suppliesLost: 0, gameOver: false, jumpscare: false };
}
