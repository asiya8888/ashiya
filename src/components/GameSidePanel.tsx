import type { RoomId } from '../lib/rooms';
import type { GameSettings } from '../lib/settings';
import type { Visitor } from '../lib/visitors';
import { DoorPrompt } from './DoorPrompt';
import { GuestPanel } from './GuestPanel';
import { QuietMoment } from './QuietMoment';
import { VisitorCard } from './VisitorCard';
import type { CabinGuest } from '../lib/guests';

type GameSidePanelProps = {
  canAsk: boolean;
  canLook: boolean;
  disabled: boolean;
  entries: string[];
  guestMessage: string;
  guests: CabinGuest[];
  onAllow: () => void;
  onAsk: () => void;
  onCheckGuests: () => void;
  onLook: () => void;
  onPeephole: () => void;
  onRefuse: () => void;
  onTalkGuest: (guestId: string) => void;
  outcome: string;
  room: RoomId;
  settings: GameSettings;
  status: string;
  visitor: Visitor;
};

export function GameSidePanel(props: GameSidePanelProps) {
  if (props.status === 'waiting' && props.room === 'living') return (
    <GuestPanel guests={props.guests} isKnocking={false} message={props.guestMessage || props.outcome} onCheckGuests={props.onCheckGuests} onTalk={props.onTalkGuest} settings={props.settings} />
  );
  if (props.status === 'waiting') return <QuietMoment outcome={props.outcome} room={props.room} settings={props.settings} />;
  if (props.status === 'knocking' && props.room === 'living' && props.guests.length > 0) return (
    <GuestPanel guests={props.guests} isKnocking message="Someone is outside." onCheckGuests={props.onCheckGuests} onTalk={props.onTalkGuest} settings={props.settings} visitorName={props.visitor.name} />
  );
  if (props.status === 'knocking') return <DoorPrompt currentRoom={props.room} onLook={props.onPeephole} />;
  return (
    <VisitorCard
      disabled={props.disabled}
      visitor={props.visitor}
      entries={props.entries}
      outcome={props.outcome}
      canAsk={props.canAsk}
      canLook={props.canLook}
      settings={props.settings}
      onAsk={props.onAsk}
      onLook={props.onLook}
      onAllow={props.onAllow}
      onRefuse={props.onRefuse}
    />
  );
}
