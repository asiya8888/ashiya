type DoorPromptProps = {
  onIgnore: () => void;
  onLook: () => void;
};

export function DoorPrompt({ onIgnore, onLook }: DoorPromptProps) {
  return (
    <section className="door-prompt">
      <p className="label">A knock at the door</p>
      <h2>The room holds its breath.</h2>
      <p>
        The fire keeps moving behind you. Outside, the storm swallows every shape except the
        small black circle in the door.
      </p>
      <div className="choices door-choices">
        <button onClick={onLook}>Look Through Peephole</button>
        <button onClick={onIgnore}>Ignore</button>
      </div>
    </section>
  );
}
