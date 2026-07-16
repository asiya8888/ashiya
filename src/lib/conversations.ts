import type { QuestionKey } from './questions';
import type { VisitorKind } from './visitors';

export type Personality = 'nervous' | 'rude' | 'frightened' | 'calm' | 'evasive';

export type ConversationProfile = {
  age: string;
  alone: string;
  cold: string;
  event: string;
  origin: string;
  outside: string;
  personality: Personality;
};

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const personalities: Personality[] = ['nervous', 'rude', 'frightened', 'calm', 'evasive'];
const ages = ['twenty-four', 'thirty-one', 'forty-two', 'nineteen', 'fifty-eight'];

const humanProfile = (): ConversationProfile => ({
  age: pick(ages),
  alone: pick([
    "Yes. I haven't seen another person for hours.",
    'No. I was with my sister earlier, but we got separated near the ridge.',
    'I was with two hikers before the wind got too loud to hear them.',
  ]),
  cold: pick([
    "My hands are freezing. I don't think I've felt this cold in years.",
    "Yes. I'm trying to keep talking so I don't panic.",
    'I can barely feel my face anymore.',
  ]),
  event: pick([
    'I lost the trail when the snow covered the markers.',
    'My car slid off the lower road and I walked until I saw your light.',
    'I got separated from my group before sunset.',
  ]),
  origin: pick([
    'From the northern trail near the mountain pass.',
    'There is a small village on the other side of the mountain.',
    'From the lower road, maybe three miles back.',
  ]),
  outside: pick([
    'Mostly snow and wind. I can barely see the trees.',
    'The path is gone. Everything looks flat and white.',
    'There are tracks behind me, but they might be mine.',
  ]),
  personality: pick(personalities),
});

const mimicProfile = (night: number): ConversationProfile => ({
  age: pick(night > 3 ? ['twenty-four', 'thirty-one', 'old enough'] : ['old enough', 'I do not remember exactly']),
  alone: pick(['Why does that matter?', "Would it change your decision if I wasn't?", 'I am alone enough.']),
  cold: pick(['Should I be?', 'I know it is cold. I can say that much.', 'Cold is what people call this, yes?']),
  event: pick([
    'I followed the light until there was nowhere else to go.',
    'The woods became confusing, and then your door was here.',
    'Something happened behind me. I would rather not turn around.',
  ]),
  origin: pick(['Somewhere far away.', 'From the trees past your window.', 'From the road, if that is easier to believe.']),
  outside: pick(['Outside is behind me.', 'The storm is moving. It does not sound empty.', 'You know what is outside. Snow. Trees. Distance.']),
  personality: pick(['calm', 'evasive', 'frightened']),
});

const rudePrefix = (text: string) => `I already answered enough, but fine. ${text}`;
const nervousPrefix = (text: string) => `${text} Sorry, I know I sound scattered.`;
const evasivePrefix = (text: string) => `${text}`;

export function makeConversation(kind: VisitorKind, night: number) {
  return kind === 'skinwalker' ? mimicProfile(night) : humanProfile();
}

export function answerQuestion(
  name: string,
  kind: VisitorKind,
  profile: ConversationProfile,
  key: QuestionKey,
  repeated: boolean,
) {
  if (repeated) return key === 'name' ? `I already told you. It's ${name}.` : 'I already answered that.';

  const answer = key === 'name' ? `I'm ${name}.` : profile[key];
  if (kind === 'skinwalker' && profile.personality === 'evasive') return evasivePrefix(answer);
  if (profile.personality === 'rude' && Math.random() > 0.45) return rudePrefix(answer);
  if (profile.personality === 'nervous' && Math.random() > 0.35) return nervousPrefix(answer);
  return answer;
}
