import type { GameCharacter } from './characters/types';
import type { ConversationProfile } from './conversations';
import { makeCharacterConversation } from './conversations';
import { memoryLine, type VisitorMemory } from './visitorMemory';

export type VisitorKind = 'human' | 'skinwalker' | 'empty';
export type MoralOutcome = 'peaceful' | 'steal' | 'injure';
export type EventSound = 'scratch' | 'footsteps' | 'roof' | 'wind' | 'flicker' | 'cry' | 'inside';

export type FaceFeature = {
  eyes: 'normal' | 'wide' | 'black' | 'three';
  mouth: 'normal' | 'flat' | 'tense' | 'too-wide';
  nose: 'normal' | 'missing';
  hair: 'short' | 'hood' | 'messy' | 'long';
  skin: 'pale' | 'warm' | 'frozen';
  clothes: 'parka' | 'scarf' | 'coat';
  age: 'young' | 'adult' | 'older';
  brows: 'soft' | 'worried' | 'low';
  expression: 'afraid' | 'tired' | 'calm' | 'strained';
  lighting: 'left' | 'right' | 'low';
  scar: boolean;
  shadow: boolean;
  breath: boolean;
};

export type Visitor = {
  id: number;
  name: string;
  kind: VisitorKind;
  dialogue: string[];
  conversation?: ConversationProfile;
  inspections: string[];
  face?: FaceFeature;
  groupSize: number;
  eventText?: string;
  eventSound?: EventSound;
  outcome: MoralOutcome;
  character?: GameCharacter;
  portrait?: string;
};

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const specialEvents: EventSound[] = ['scratch', 'footsteps', 'roof', 'wind', 'flicker', 'cry', 'inside'];

const hashId = (id: string) => [...id].reduce((total, char) => total + char.charCodeAt(0), 0);
const stablePick = <T,>(items: T[], hash: number, offset: number) => items[(hash + offset) % items.length];

const makeFace = (character: GameCharacter, night: number): FaceFeature => {
  const hash = hashId(character.id);
  const mimicLooksNormal = character.kind === 'skinwalker' && (hash + night) % 3 === 0;
  return {
    eyes: mimicLooksNormal || character.kind === 'human' ? stablePick(['normal', 'wide'], hash, 1) : stablePick(['normal', 'wide', 'black', 'three'], hash, 2),
    mouth: mimicLooksNormal || character.kind === 'human' ? stablePick(['normal', 'flat', 'tense'], hash, 3) : stablePick(['flat', 'tense', 'too-wide'], hash, 4),
    nose: character.kind === 'skinwalker' && !mimicLooksNormal && hash % 7 === 0 ? 'missing' : 'normal',
    hair: stablePick(['short', 'hood', 'messy', 'long'], hash, 5),
    skin: mimicLooksNormal ? stablePick(['warm', 'pale'], hash, 6) : stablePick(['pale', 'warm', 'frozen'], hash, 7),
    clothes: stablePick(['parka', 'scarf', 'coat'], hash, 8),
    age: stablePick(['young', 'adult', 'older'], hash, 9),
    brows: stablePick(['soft', 'worried', 'low'], hash, 10),
    expression: stablePick(['afraid', 'tired', 'calm', 'strained'], hash, 11),
    lighting: stablePick(['left', 'right', 'low'], hash, 12),
    scar: hash % 5 === 0,
    shadow: character.kind === 'skinwalker' && !mimicLooksNormal,
    breath: character.kind === 'human' || mimicLooksNormal,
  };
};

export const makeVisitor = (id: number, night: number, character: GameCharacter, memories: VisitorMemory[] = []): Visitor => {
  const memory = memories.length > 0 && Math.random() > 0.82 ? pick(memories) : undefined;
  const eventSound = Math.random() > 0.68 ? pick(specialEvents) : undefined;
  const remembered = memoryLine(memory);
  const dialogue = remembered ? `${remembered} ${character.dialogue[0]}` : character.dialogue[0];

  return {
    id,
    kind: character.kind,
    name: character.name,
    groupSize: character.id === 'twin-sisters' ? 2 : 1,
    eventSound,
    outcome: character.outcome ?? 'peaceful',
    conversation: makeCharacterConversation(character, night, memories),
    dialogue: [dialogue, ...character.dialogue.slice(1)],
    inspections: [character.appearance, ...character.inspections, ...character.behaviors],
    face: makeFace(character, night),
    character,
    portrait: character.portrait,
  };
};
