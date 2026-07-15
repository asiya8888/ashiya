import { makeDialogueProfile } from './dialogueProfiles';

export type VisitorKind = 'human' | 'skinwalker' | 'empty';
export type MoralOutcome = 'peaceful' | 'steal' | 'injure';

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

const specialEvents = [
  'Scratching crawls slowly down the other side of the door.',
  'Someone is crying outside, too quietly to sound close.',
  'Heavy footsteps circle the cabin and stop at the window.',
  'Something drags itself across the roof.',
  'The lights flicker once. Something inside the room shifts.',
  'A strong wind hits the cabin hard enough to rattle the latch.',
  'A whisper comes from behind you, but the visitor keeps staring.',
];

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
  const hard = ['They blink a little too late.', 'Their smile does not reach their eyes.', 'No breath fogs the glass.'];
  const obvious = ['Their fingers look too long.', 'Their face seems slightly uneven.', 'A shadow sits under their skin.'];
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
  const eventText = empty ? pick(emptyEvents) : Math.random() > 0.72 ? pick(specialEvents) : undefined;
  const groupSize = Math.random() > 0.78 ? Math.floor(Math.random() * 3) + 2 : 1;
  const name = groupSize > 1 ? pick(groupNames) : pick(kind === 'skinwalker' ? walkerNames : humanNames);
  const outcome: MoralOutcome = kind === 'human' && Math.random() > 0.78 ? pick(['steal', 'injure']) : 'peaceful';

  if (kind === 'empty') {
    return { id, kind, name: 'The Door', dialogue: ['The porch is empty.'], answers: [], inspections: [], groupSize, eventText, outcome: 'peaceful' };
  }

  const profile = makeDialogueProfile(kind, night);

  return {
    id,
    kind,
    name,
    groupSize,
    eventText,
    outcome,
    dialogue: profile.dialogue,
    answers: profile.answers,
    inspections: makeInspections(kind, night > 2),
    face: makeFace(kind, night),
  };
};
