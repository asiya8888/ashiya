import { snowStyle } from '../../lib/snow';

export function BedroomScene() {
  return (
    <>
      <p className="room-title">Bedroom</p>
      <div className="bedroom-window">
        {Array.from({ length: 18 }, (_, index) => <span className="snowflake" key={index} style={snowStyle(index + 70)} />)}
      </div>
      <div className="bed">
        <span className="pillow" />
        <span className="blanket" />
        <span className="bed-frame" />
      </div>
      <div className="nightstand">
        <span className="lamp" />
      </div>
      <div className="wall-picture" />
      <div className="closet-door" />
      <span className="doorway doorway-left" aria-hidden="true" />
    </>
  );
}
