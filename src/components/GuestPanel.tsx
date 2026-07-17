import type { CabinGuest } from '../lib/guests';
import { guestLine } from '../lib/guests';
import type { GameSettings } from '../lib/settings';
import { TypewriterText } from './TypewriterText';

type GuestPanelProps = {
  guests: CabinGuest[];
  isKnocking: boolean;
  message: string;
  onCheckGuests: () => void;
  onTalk: (guestId: string) => void;
  settings: GameSettings;
  visitorName?: string;
};

export function GuestPanel({ guests, isKnocking, message, onCheckGuests, onTalk, settings, visitorName }: GuestPanelProps) {
  const hasGuests = guests.length > 0;

  return (
    <section className="guest-panel">
      <p className="label">Living room guests</p>
      <h2>{hasGuests ? 'By The Fire' : 'Empty Sofa'}</h2>
      <TypewriterText
        className="quote"
        settings={settings}
        text={hasGuests ? 'Your guests are sitting on the sofa near the fireplace.' : 'No one is staying in the living room right now.'}
      />
      {message && <TypewriterText className="event-text" settings={settings} text={message} />}
      {hasGuests && (
        <>
          <div className="guest-list">
            {guests.map((guest) => (
              <button key={guest.id} onClick={() => onTalk(guest.id)} type="button">
                {guest.name}
              </button>
            ))}
          </div>
          <button className="guest-check" onClick={onCheckGuests} type="button">Check The Living Room</button>
          <TypewriterText className="quote" settings={settings} text={guestLine(guests[0], isKnocking, visitorName)} />
        </>
      )}
    </section>
  );
}
