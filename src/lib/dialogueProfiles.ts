import type { VisitorKind } from './visitors';

export type DialogueProfile = {
  dialogue: string[];
};

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const usedDialogues = new Set<string>();

const humanStarts = [
  "I'm sorry for knocking this late",
  "I know you don't know me",
  "I didn't think anyone lived this far up the mountain",
  "Please listen before you decide anything",
  "I wouldn't be here if I had anywhere else to go",
];

const humanSituations = [
  'I lost the trail when the snow came down and I have been walking in circles for hours',
  'my friends and I got separated near the ridge and I stopped hearing them after the wind picked up',
  'my car slid off the lower road and the windows broke before I could get it started again',
  'I followed what looked like a lantern through the trees, but it vanished when I reached your porch',
  'I tried to wait under the pines, but my hands are too numb to hold my pack anymore',
];

const humanDetails = [
  'I can stay by the door if that makes you feel safer',
  'I do not need food, just a place out of the wind',
  'you can keep the light on me the whole time',
  'I swear I will leave as soon as the sun comes up',
  'I am scared too, but I am still a person asking for help',
];

const mimicStarts = [
  "It's strange how warm it must be inside your cabin",
  "You look tired, and I don't want to frighten you",
  "I understand why you hesitate",
  "I have been standing in the snow long enough to learn your silence",
  "You don't have to open the door quickly",
];

const mimicSituations = [
  'I followed your window because it was the only shape in the dark that looked alive',
  'I was with others earlier, but they stopped answering and I kept walking without them',
  'the mountain keeps changing behind me, so I would rather not look back',
  'I have practiced what to say, but it is harder when you stare at me like that',
  'I only need to be inside until the night is finished with us',
];

const mimicDetails = [
  'I can be quiet if quiet makes me easier to trust',
  'I do not understand why my face bothers you',
  'it would be cruel to leave someone outside after they found you',
  'your fire sounds close enough to remember',
  'if I were dangerous, I would not ask so gently',
];

const sentence = (start: string, situation: string, detail: string) => `${start}; ${situation}, and ${detail}.`;

const uniqueSentence = (starts: string[], situations: string[], details: string[]) => {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const line = sentence(pick(starts), pick(situations), pick(details));
    if (!usedDialogues.has(line)) {
      usedDialogues.add(line);
      return line;
    }
  }

  const fallback = sentence(pick(starts), pick(situations), pick(details));
  usedDialogues.add(fallback);
  return fallback;
};

export function makeDialogueProfile(kind: VisitorKind, night: number): DialogueProfile {
  if (kind === 'human') {
    return {
      dialogue: [uniqueSentence(humanStarts, humanSituations, humanDetails)],
    };
  }

  const convincing = night > 2 && Math.random() > 0.35;
  const starts = convincing ? humanStarts : mimicStarts;
  const situations = convincing ? humanSituations : mimicSituations;
  const details = convincing ? humanDetails : mimicDetails;

  return {
    dialogue: [uniqueSentence(starts, situations, details)],
  };
}
