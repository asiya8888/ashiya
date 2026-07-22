import type { GameCharacter } from './characters/types';
import type { QuestionKey } from './questions';
import type { VisitorKind } from './visitors';
import type { VisitorMemory } from './visitorMemory';

export type Personality = 'nervous' | 'rude' | 'frightened' | 'calm' | 'evasive';
export type ConversationProfile = Record<QuestionKey, string> & { personality: Personality };

const hashId = (id: string) => [...id].reduce((sum, letter) => sum + letter.charCodeAt(0), 0);
const pickStable = <T,>(items: T[], hash: number, offset = 0) => items[(hash + offset) % items.length];

const voice = (character: GameCharacter, plain: string) => {
  const traits = character.personality.toLowerCase();
  if (character.id === 'twin-sisters') return `Mira: ${plain} Vera: That is our shared answer.`;
  if (traits.includes('blunt') || traits.includes('laconic')) return plain.split(/[.!?]/)[0] + '.';
  if (traits.includes('formal') || traits.includes('disciplined')) return `For the record: ${plain}`;
  if (traits.includes('nervous') || traits.includes('frightened')) return `${plain} Sorry—just keep your voice down.`;
  if (traits.includes('warm') || traits.includes('grandmother')) return `${plain} There now, dear; one truth at a time.`;
  if (traits.includes('lyrical') || traits.includes('mysterious') || traits.includes('oblique')) return `${plain} The mountain may phrase it differently.`;
  if (traits.includes('clinical')) return `${plain} That is the useful answer, not necessarily the comforting one.`;
  return plain;
};

export function makeCharacterConversation(
  character: GameCharacter,
  night: number,
  memories: VisitorMemory[] = [],
): ConversationProfile {
  const hash = hashId(character.id);
  const age = character.age?.toString() ?? pickStable(['nineteen', 'twenty-seven', 'thirty-four', 'forty-one', 'forty-eight', 'fifty-six', 'sixty-three'], hash);
  const origin = pickStable(['the lower village', 'the northern ridge', 'the reservoir road', 'the old lodge', 'the eastern pass'], hash, 2);
  const previous = memories[0];
  const witness = previous
    ? `I saw what happened with ${previous.name}. You ${previous.choice === 'allow' ? 'opened the door' : 'left them outside'}.`
    : 'I have not met another living traveler since dusk.';
  const mimicSeen = character.kind === 'skinwalker'
    ? pickStable(['People use that word when a face makes them afraid.', 'I have seen convincing copies. Certainty did not help their victims.', 'Perhaps. A mirror sees a copy every day.'], hash)
    : pickStable(['Once. It knew my voice, not my memories.', 'I saw something human until it smiled at the wrong moment.', 'Only signs: doubled tracks and answers rehearsed too well.'], hash);
  const hiding = character.kind === 'skinwalker'
    ? pickStable(['Only what you have already decided to fear.', 'Yes, but a confession would not make it safer.', 'My history. You would mistake it for evidence.'], hash, 1)
    : pickStable(['Fear, mostly. I would rather it did not vote for me.', 'One detail: I lied about how close the footsteps were.', `Only this: ${character.inspections[0].toLowerCase()}`], hash, 1);

  return {
    name: voice(character, `Call me ${character.name}.`),
    age: voice(character, character.id === 'lost-boy' ? 'Fifteen. I know I look younger tonight.' : `${age}. This storm has added years.`),
    origin: voice(character, character.id === 'wanderer' ? 'From the direction that disappears when named.' : `I came from ${origin}.`),
    event: voice(character, character.backstory),
    outside: voice(character, night === 1 ? 'Snow, wind, and tracks crossing mine.' : `The storm is worse than night ${night - 1}, and voices are moving between the trees.`),
    alone: voice(character, character.knows?.length ? `${witness} I am looking for someone I know.` : witness),
    feeling: voice(character, character.kind === 'skinwalker' ? pickStable(['Patient.', 'Concerned for the people inside.', 'Cold in the way you expect me to be.'], hash) : pickStable(['Exhausted, but thinking clearly.', 'Afraid enough to be honest.', 'Numb, angry, and still standing.'], hash)),
    mimics: voice(character, mimicSeen),
    hiding: voice(character, hiding),
    stay: voice(character, character.kind === 'skinwalker' ? pickStable(['Until the house feels quiet.', 'Only until dawn. You may count every minute.', 'One night, if one night is still a real measure.'], hash) : `At most ${character.stayNights[1]} nights. I will leave sooner if the pass clears.`),
    personality: character.kind === 'skinwalker' ? 'evasive' : character.personality.includes('nervous') ? 'nervous' : 'calm',
  };
}

export function answerQuestion(
  name: string,
  kind: VisitorKind,
  profile: ConversationProfile,
  key: QuestionKey,
  repeated: boolean,
) {
  void name;
  void kind;
  if (repeated) return 'I answered that already. Ask what you truly want to know.';
  return profile[key];
}
