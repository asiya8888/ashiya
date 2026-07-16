import type { ConversationProfile } from './conversations';
import { makeConversation } from './conversations';
import { makeDialogueProfile } from './dialogueProfiles';
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
};

const humanNames = ['Mara Cole', 'Evan Pike', 'Nina Vale', 'Oscar Reed', 'Clara Stone'];
const walkerNames = ['Jonas Hale', 'Vera Snow', 'Peter Wren', 'Lena Grey', 'Milo Cross'];
const groupNames = ['Two Hikers', 'Parent and Child', 'Elderly Travelers', 'Four Figures'];
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const emptyEvents = [
  'Nobody is outside, but the knock is still echoing.',
  'Only a line of footprints waits on the porch.',
];

const specialEvents: EventSound[] = ['scratch', 'footsteps', 'roof', 'wind', 'flicker', 'cry', 'inside'];
const uncertainClues = [
  'Their hood hides most of their face from the peephole.',
  "It's difficult to make out their expression in the darkness.",
  'Their gloves cover most of their hands.',
  "You cannot tell whether they're shivering or just shifting their weight.",
  'Snow keeps blowing across the glass whenever you try to focus.',
];

const makeInspections = (kind: VisitorKind, subtle: boolean) => {
  const fog = Math.random() > 0.35 ? [pick(uncertainClues)] : [];
  if (kind === 'human') {
    return fog.concat([
      'Their shoulders shake from the cold.',
      'Snow is melting on their sleeves.',
      Math.random() > 0.22 ? 'You can see their breath cloud the air.' : "Their breath is faint enough that you question it.",
      'Their voice trembles like they are trying not to cry.',
      Math.random() > 0.5 ? 'Their hands look stiff and red from the cold.' : 'Their stare lingers because fear has made them slow to answer.',
    ]);
  }
  const hard = [
    'Something about their eyes unsettles you.',
    'Their smile seems to linger for a moment too long.',
    "You can't quite tell whether their breath reaches the glass.",
  ];
  const obvious = [
    'Their fingers rest against the frame at an uncomfortable angle.',
    'Their face looks almost familiar, but not quite balanced.',
    'A shadow crosses their skin even when the firelight does not move.',
  ];
  return fog.concat(subtle ? hard : hard.concat(Math.random() > 0.5 ? obvious : []));
};

const makeFace = (kind: VisitorKind, night: number): FaceFeature => {
  const subtle = kind === 'skinwalker' && (night > 1 || Math.random() > 0.35);
  const humanLooksWrong = kind === 'human' && Math.random() > 0.68;
  const mimicLooksNormal = kind === 'skinwalker' && Math.random() < 0.45 + night * 0.08;
  return {
    eyes: mimicLooksNormal || kind === 'human' ? pick(['normal', 'wide']) : pick(['normal', 'wide', 'black']),
    mouth: mimicLooksNormal || kind === 'human' ? pick(['normal', 'flat', 'tense']) : pick(['flat', 'tense', 'too-wide']),
    nose: kind === 'skinwalker' && !subtle && Math.random() > 0.86 ? 'missing' : 'normal',
    hair: pick(['short', 'hood', 'messy', 'long']),
    skin: mimicLooksNormal ? pick(['warm', 'pale']) : pick(['pale', 'warm', 'frozen']),
    clothes: pick(['parka', 'scarf', 'coat']),
    age: pick(['young', 'adult', 'older']),
    brows: kind === 'skinwalker' ? pick(['soft', 'worried', 'low']) : pick(['soft', 'worried', 'low']),
    expression: kind === 'skinwalker' ? pick(['calm', 'strained', 'afraid', 'tired']) : pick(['afraid', 'tired', 'strained', 'calm']),
    lighting: pick(['left', 'right', 'low']),
    scar: Math.random() > 0.72 || humanLooksWrong,
    shadow: kind === 'skinwalker' ? Math.random() > 0.58 : humanLooksWrong,
    breath: kind === 'human' ? Math.random() > 0.12 : mimicLooksNormal && Math.random() > 0.36,
  };
};

export const makeVisitor = (id: number, night: number, memories: VisitorMemory[] = []): Visitor => {
  const empty = Math.random() < 0.05;
  const memory = !empty && memories.length > 0 && Math.random() > 0.72 ? pick(memories) : undefined;
  const kind: VisitorKind = empty ? 'empty' : Math.random() < 0.38 + night * 0.06 ? 'skinwalker' : 'human';
  const eventText = empty ? pick(emptyEvents) : undefined;
  const eventSound = Math.random() > 0.68 ? pick(specialEvents) : undefined;
  const groupSize = Math.random() > 0.78 ? Math.floor(Math.random() * 3) + 2 : 1;
  const name = memory?.name ?? (groupSize > 1 ? pick(groupNames) : pick(kind === 'skinwalker' ? walkerNames : humanNames));
  const outcome: MoralOutcome = kind === 'human' && Math.random() > 0.78 ? pick(['steal', 'injure']) : 'peaceful';

  if (kind === 'empty') {
    return {
      id,
      kind,
      name: 'The Door',
      dialogue: ['The porch is empty.'],
      inspections: [],
      groupSize,
      eventText,
      eventSound,
      outcome: 'peaceful',
    };
  }

  const profile = makeDialogueProfile(kind, night);
  const remembered = memoryLine(memory);

  return {
    id,
    kind,
    name,
    groupSize,
    eventText,
    eventSound,
    outcome,
    conversation: makeConversation(kind, night),
    dialogue: [remembered ? `${remembered} ${profile.dialogue[0]}` : profile.dialogue[0]],
    inspections: makeInspections(kind, night > 2),
    face: makeFace(kind, night),
  };
};
