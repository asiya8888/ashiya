import { snowStyle } from '../lib/snow';

export function CabinScene() {
  return (
    <section className="cabin" aria-label="Cabin front door">
      <div className="window">
        <div className="moon" />
        {Array.from({ length: 36 }, (_, index) => (
          <span
            className="snowflake"
            key={index}
            style={snowStyle(index)}
          />
        ))}
      </div>
      <div className="door">
        <div className="door-panel" />
        <div className="door-panel" />
        <span className="knob" />
      </div>
      <div className="floor-light" />
    </section>
  );
}
