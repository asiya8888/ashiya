import type { Visitor } from '../lib/visitors';
import { InteractionLog } from './InteractionLog';
import type { GameSettings } from '../lib/settings';
import { TypewriterText } from './TypewriterText';
import { VisitorFace } from './VisitorFace';

type VisitorCardProps = {
  visitor: Visitor;
  entries: string[];
  outcome?: string;
  disabled: boolean;
  canAsk: boolean;
  canLook: boolean;
  settings: GameSettings;
  onAsk: () => void;
  onLook: () => void;
  onAllow: () => void;
  onRefuse: () => void;
};

export function VisitorCard({
  visitor,
  entries,
  outcome,
  disabled,
  canAsk,
  canLook,
  settings,
  onAsk,
  onLook,
  onAllow,
  onRefuse,
}: VisitorCardProps) {
  return (
    <section className="visitor-card" key={visitor.id}>
      {visitor.face ? <VisitorFace face={visitor.face} portrait={visitor.portrait} /> : <div className="empty-porch">No one is there.</div>}
      <div className="visitor-copy">
        <p className="label">{visitor.groupSize > 1 ? 'Multiple visitors' : 'Someone is at the door'}</p>
        <h2>{visitor.name}</h2>
        {visitor.eventText && <p className="event-text">{visitor.eventText}</p>}
        <TypewriterText className="quote" settings={settings} text={`"${visitor.dialogue[0]}"`} />
      </div>
      <InteractionLog entries={entries} outcome={outcome} settings={settings} />
      <div className="choices">
        <button data-click-sound="ask" disabled={disabled || !canAsk} onClick={onAsk}>
          Ask Questions
        </button>
        <button data-click-sound="inspect" disabled={disabled || !canLook} onClick={onLook}>
          Look Closer
        </button>
        <button data-click-sound="allow" disabled={disabled} onClick={onAllow}>
          Open The Door
        </button>
        <button disabled={disabled} onClick={onRefuse}>
          Keep The Door Closed
        </button>
      </div>
    </section>
  );
}
