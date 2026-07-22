import type { MoralOutcome, VisitorKind } from '../visitors';

export type CharacterTier = 'main' | 'random' | 'rare';

export type GameCharacter = {
  id: string;
  tier: CharacterTier;
  name: string;
  age?: number;
  gender?: 'female' | 'male';
  kind: VisitorKind;
  personality: string;
  appearance: string;
  backstory: string;
  dialogue: string[];
  inspections: string[];
  behaviors: string[];
  portrait?: string;
  stayNights: [number, number];
  outcome?: MoralOutcome;
  knows?: string[];
  rareCondition?: 'late' | 'lowSupplies' | 'manyRefusals' | 'afterMimicInside' | 'storm';
};
