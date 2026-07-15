import type { Visitor } from '../lib/visitors';
import { InteractionLog } from './InteractionLog';
import { VisitorFace } from './VisitorFace';

type VisitorCardProps = {
  visitor: Visitor;
  entries: string[];
  outcome?: string;
  disabled: boolean;
  canAsk: boolean;
  canLook: boolean;
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
  onAsk,
  onLook,
  onAllow,
  onRefuse,
}: VisitorCardProps) {
  return (
    <section className="visitor-card" key={visitor.id}>
      {visitor.face ? <VisitorFace face={visitor.face} /> : <div className="empty-porch">No one is there.</div>}
      <div className="visitor-copy">
        <p className="label">{visitor.groupSize > 1 ? 'Multiple visitors' : 'Someone is at the door'}</p>
        <h2>{visitor.name}</h2>
        {visitor.eventText && <p className="event-text">{visitor.eventText}</p>}
        <p className="quote">"{visitor.dialogue[0]}"</p>
      </div>
      <InteractionLog entries={entries} outcome={outcome} />
      <div className="choices">
        <button disabled={disabled || !canAsk} onClick={onAsk}>
          Ask Questions
        </button>
        <button disabled={disabled || !canLook} onClick={onLook}>
          Look Closer
        </button>
        <button disabled={disabled} onClick={onAllow}>
          Let Them In
        </button>
        <button disabled={disabled} onClick={onRefuse}>
          Refuse Entry
        </button>
      </div>
    </section>
  );
}
