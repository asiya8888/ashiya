import type { Visitor } from '../lib/visitors';
import { InteractionLog } from './InteractionLog';
import type { GameSettings } from '../lib/settings';
import { TypewriterText } from './TypewriterText';
import { VisitorFace } from './VisitorFace';
import type { CharacterQuestion } from '../lib/questions';

type VisitorCardProps = {
  visitor: Visitor;
  entries: string[];
  outcome?: string;
  disabled: boolean;
  canAsk: boolean;
  questions: CharacterQuestion[];
  settings: GameSettings;
  onAsk: (questionId: string) => void;
  onAllow: () => void;
  onRefuse: () => void;
};

export function VisitorCard({
  visitor,
  entries,
  outcome,
  disabled,
  canAsk,
  questions,
  settings,
  onAsk,
  onAllow,
  onRefuse,
}: VisitorCardProps) {
  return (
    <section className="visitor-card visitor-stage" key={visitor.id}>
      <div className="visitor-portrait-wrap">
        {visitor.face ? <VisitorFace face={visitor.face} portrait={visitor.portrait} /> : <div className="empty-porch">No one is there.</div>}
        <p className="visual-clue">{visitor.inspections[1] ?? visitor.inspections[0]}</p>
      </div>
      <div className="visitor-dialogue-box">
        <p className="visitor-role">A voice beyond the door</p>
        <TypewriterText className="quote" settings={settings} text={visitor.dialogue[0]} />
        <InteractionLog entries={entries} outcome={outcome} settings={settings} />
        {questions.length > 0 && <div className="question-list">
          {questions.map((question) => (
            <button disabled={disabled || !canAsk} key={question.id} onClick={() => onAsk(question.id)} type="button">{question.text}</button>
          ))}
        </div>}
        <div className="decision-row">
          <button className="allow-button" disabled={disabled} onClick={onAllow}>Let them in</button>
          <button className="refuse-button" disabled={disabled} onClick={onRefuse}>Refuse</button>
        </div>
      </div>
    </section>
  );
}
