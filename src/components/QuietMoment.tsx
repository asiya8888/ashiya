import type { GameSettings } from '../lib/settings';
import type { RoomId } from '../lib/rooms';
import { TypewriterText } from './TypewriterText';

type QuietMomentProps = {
  outcome?: string;
  room?: RoomId;
  settings: GameSettings;
};

const roomText: Record<RoomId, string> = {
  bedroom: 'The bedroom is empty. Blankets sit untouched, and every shadow stays under the furniture.',
  kitchen: 'The kitchen is empty. Cold mugs wait on the table, and the window shows only snow.',
  living: 'The fireplace crackles softly.',
};

export function QuietMoment({ outcome, room = 'living', settings }: QuietMomentProps) {
  return (
    <section className="visitor-card quiet-card">
      <p className="label">Inside the cabin</p>
      <h2>{room === 'living' ? 'Quiet' : room}</h2>
      {outcome && <TypewriterText className="event-text" settings={settings} text={outcome} />}
      <TypewriterText className="quote" settings={settings} text={roomText[room]} />
      <TypewriterText className="quote" settings={settings} text="Wind moves against the walls, then fades." />
    </section>
  );
}
