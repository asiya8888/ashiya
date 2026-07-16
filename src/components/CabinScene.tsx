import { snowStyle } from '../lib/snow';

export function CabinScene() {
  return (
    <section className="cabin" aria-label="Cabin front door">
      <div className="wall-planks" aria-hidden="true" />
      <div className="window-frame">
        <div className="window">
          <div className="moon" />
          {Array.from({ length: 36 }, (_, index) => (
            <span
              className="snowflake"
              key={index}
              style={snowStyle(index)}
            />
          ))}
          <span className="window-frost" />
        </div>
        <span className="window-sill" />
      </div>
      <div className="door-frame">
        <div className="door">
          <span className="door-grain" />
          <div className="door-panel" />
          <div className="door-panel" />
          <span className="peephole" />
          <span className="lock-plate" />
          <span className="knob" />
          <span className="hinge hinge-top" />
          <span className="hinge hinge-bottom" />
        </div>
      </div>
      <div className="cabin-trim" />
      <div className="floor-light" />
      <div className="ash-specks" aria-hidden="true">
        {Array.from({ length: 36 }, (_, index) => (
          <span
            key={index}
            style={{
              animationDelay: `${(index % 9) * 0.4}s`,
              left: `${(index * 37) % 100}%`,
              top: `${(index * 29) % 100}%`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
