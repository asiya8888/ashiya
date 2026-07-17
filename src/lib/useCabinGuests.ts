import { useState } from 'react';
import { guestLine, stayLength, type CabinGuest } from './guests';
import type { Visitor } from './visitors';

export function useCabinGuests() {
  const [guests, setGuests] = useState<CabinGuest[]>([]);
  const [guestMessage, setGuestMessage] = useState('');
  const [delayedEnding, setDelayedEnding] = useState(false);

  const resetGuests = () => {
    setGuests([]);
    setGuestMessage('');
    setDelayedEnding(false);
  };

  const addAllowedGuest = (visitor: Visitor, night: number, score: number) => {
    if (visitor.kind === 'empty' || !visitor.character) return;
    const character = visitor.character;
    const stay = stayLength(character);
    setGuests((current) => [
      ...current,
      {
        arrivedAt: score,
        arrivedNight: night,
        behaviors: character.behaviors,
        dialogue: character.dialogue,
        id: `${night}-${visitor.id}-${visitor.name}`,
        kind: visitor.kind,
        leaveAfterNight: Math.min(7, night + stay - 1),
        name: visitor.name,
        personality: character.personality,
        talks: 0,
      },
    ]);
  };

  const talkGuest = (guestId: string) => {
    setGuests((current) => current.map((guest) => {
      if (guest.id !== guestId) return guest;
      const nextGuest = { ...guest, talks: guest.talks + 1 };
      setGuestMessage(`${guest.name}: ${guestLine(nextGuest, false)}`);
      return nextGuest;
    }));
  };

  const advanceNight = (night: number) => {
    setGuests((current) => {
      const staying = current.filter((guest) => guest.leaveAfterNight >= night);
      const departed = current.filter((guest) => guest.leaveAfterNight < night);
      if (departed.length > 0) {
        setGuestMessage(`${departed.map((guest) => guest.name).join(', ')} left before dawn.`);
      }
      return staying;
    });
  };

  const checkGuests = (score: number) => {
    if (guests.length === 0) {
      setGuestMessage('The living room is empty. The sofa faces the fire, waiting for whoever survives the next knock.');
      return;
    }
    const delayedMimic = guests.some((guest) => guest.kind === 'skinwalker' && score > guest.arrivedAt);
    if (delayedMimic && guests.some((guest) => guest.kind === 'human')) {
      setGuestMessage('The chairs are overturned. The room is silent. No one answers when you say their names.');
      setDelayedEnding(true);
      return;
    }
    setGuestMessage(`${guests.map((guest) => guest.name).join(', ')} ${guests.length === 1 ? 'is' : 'are'} sitting on the living room sofa, listening to the storm and the door.`);
  };

  return { addAllowedGuest, advanceNight, checkGuests, delayedEnding, guestMessage, guests, resetGuests, talkGuest };
}
