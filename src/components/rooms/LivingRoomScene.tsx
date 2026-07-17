import { snowStyle } from '../../lib/snow';
import { SceneHotspot } from './SceneHotspot';

type LivingRoomSceneProps = {
  hasKnock: boolean;
  onLookThroughDoor: () => void;
};

export function LivingRoomScene({ hasKnock, onLookThroughDoor }: LivingRoomSceneProps) {
  return (
    <>
      <p className="room-title">Living Room</p>
      <div className="window-frame">
        <div className="window">
          {Array.from({ length: 36 }, (_, index) => <span className="snowflake" key={index} style={snowStyle(index)} />)}
          <span className="window-frost" />
        </div>
        <span className="window-sill" />
      </div>
      <div className="fireplace" aria-hidden="true">
        <span className="mantel" />
        <span className="fire" />
        <span className="ember-bed" />
      </div>
      <div className="living-sofa" aria-hidden="true">
        <span className="sofa-back" />
        <span className="sofa-seat" />
      </div>
      <div className="coat-rack" aria-hidden="true" />
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
      <span className="doorway doorway-left" aria-hidden="true" />
      <span className="doorway doorway-right" aria-hidden="true" />
      <SceneHotspot className="hotspot-front-door" disabled={!hasKnock} onClick={onLookThroughDoor}>
        Peephole
      </SceneHotspot>
      <div className="cabin-trim" />
      <div className="floor-light" />
    </>
  );
}
