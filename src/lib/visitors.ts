import { makeDialogueProfile } from './dialogueProfiles';

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
  answers: string[];
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

const makeInspections = (kind: VisitorKind, subtle: boolean) => {
  if (kind === 'human') {
    return [
      'Their shoulders shake from the cold.',
      'Snow is melting on their sleeves.',
      'You can see their breath cloud the air.',
      'Their voice trembles like they are trying not to cry.',
      'Their hands look stiff and red from the cold.',
    ];
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
  return subtle ? hard : hard.concat(obvious);
};

const makeFace = (kind: VisitorKind, night: number): FaceFeature => {
  const subtle = kind === 'skinwalker' && night > 1;
  return {
    eyes: kind === 'human' || subtle ? pick(['normal', 'wide']) : pick(['wide', 'black', 'three']),
    mouth: kind === 'human' || subtle ? pick(['normal', 'flat', 'tense']) : pick(['tense', 'too-wide']),
    nose: kind === 'skinwalker' && !subtle && Math.random() > 0.55 ? 'missing' : 'normal',
    hair: pick(['short', 'hood', 'messy', 'long']),
    skin: kind === 'skinwalker' ? pick(['pale', 'frozen']) : pick(['pale', 'warm', 'frozen']),
    clothes: pick(['parka', 'scarf', 'coat']),
    age: pick(['young', 'adult', 'older']),
    brows: kind === 'skinwalker' ? pick(['low', 'worried', 'soft']) : pick(['soft', 'worried']),
    expression: kind === 'skinwalker' ? pick(['calm', 'strained', 'afraid']) : pick(['afraid', 'tired', 'strained']),
    lighting: pick(['left', 'right', 'low']),
    scar: Math.random() > 0.72,
    shadow: kind === 'skinwalker' ? Math.random() > 0.25 : Math.random() > 0.82,
    breath: kind === 'human' || (subtle && Math.random() > 0.55),
  };
};

export const makeVisitor = (id: number, night: number): Visitor => {
  const empty = Math.random() > 0.92;
  const kind: VisitorKind = empty ? 'empty' : Math.random() < 0.38 + night * 0.06 ? 'skinwalker' : 'human';
  const eventText = empty ? pick(emptyEvents) : undefined;
  const eventSound = Math.random() > 0.68 ? pick(specialEvents) : undefined;
  const groupSize = Math.random() > 0.78 ? Math.floor(Math.random() * 3) + 2 : 1;
  const name = groupSize > 1 ? pick(groupNames) : pick(kind === 'skinwalker' ? walkerNames : humanNames);
  const outcome: MoralOutcome = kind === 'human' && Math.random() > 0.78 ? pick(['steal', 'injure']) : 'peaceful';

  if (kind === 'empty') {
    return {
      id,
      kind,
      name: 'The Door',
      dialogue: ['The porch is empty.'],
      answers: [],
      inspections: [],
      groupSize,
      eventText,
      eventSound,
      outcome: 'peaceful',
    };
  }

  const profile = makeDialogueProfile(kind, night);

  return {
    id,
    kind,
    name,
    groupSize,
    eventText,
    eventSound,
    outcome,
    dialogue: profile.dialogue,
    answers: profile.answers,
    inspections: makeInspections(kind, night > 2),
    face: makeFace(kind, night),
  };
};
