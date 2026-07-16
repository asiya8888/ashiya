type DoorPromptProps = {
  onIgnore: () => void;
  onLook: () => void;
};

export function DoorPrompt({ onIgnore, onLook }: DoorPromptProps) {
  return (
    <section className="door-prompt">
      <p className="label">A knock at the door</p>
      <h2>Someone is outside.</h2>
      <p>You hear knocking at the door.</p>
      <div className="choices door-choices">
        <button onClick={onLook}>Look Through Peephole</button>
        <button onClick={onIgnore}>Ignore</button>
      </div>
    </section>
  );
}
