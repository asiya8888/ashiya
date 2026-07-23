import { snowStyle } from '../../lib/snow';
import { SceneHotspot } from './SceneHotspot';
import type { CabinGuest } from '../../lib/guests';

type LivingRoomSceneProps = {
  guests: CabinGuest[];
  hasKnock: boolean;
  onLookThroughDoor: () => void;
};

export function LivingRoomScene({ guests, hasKnock, onLookThroughDoor }: LivingRoomSceneProps) {
  void guests;

  return (
    <>
      <p className="room-title">Living Room</p>
      <div className="living-ambience" aria-hidden="true" />
      <div className="living-beams" aria-hidden="true" />
      <div className="window-frame">
        <div className="window">
          <span className="winter-moon" />
          <span className="pine pine-left" />
          <span className="pine pine-right" />
          <span className="snow-bank" />
          {Array.from({ length: 48 }, (_, index) => <span className="snowflake" key={index} style={snowStyle(index)} />)}
          <span className="window-frost" />
        </div>
        <span className="window-sill" />
      </div>
      <div className="fireplace" aria-hidden="true">
        <span className="mantel" />
        <span className="hearth-opening">
          <span className="fire-log fire-log-left" />
          <span className="fire-log fire-log-right" />
          <span className="fire fire-left" />
          <span className="fire fire-center" />
          <span className="fire fire-right" />
          <span className="ember-bed" />
        </span>
        <span className="hearth-stone hearth-stone-left" />
        <span className="hearth-stone hearth-stone-right" />
        <span className="hearth-base" />
      </div>
      <div className="living-sofa" aria-hidden="true">
        <span className="sofa-back" />
        <span className="sofa-seat" />
        <span className="sofa-arm sofa-arm-left" />
        <span className="sofa-arm sofa-arm-right" />
        <span className="sofa-cushion sofa-cushion-left" />
        <span className="sofa-cushion sofa-cushion-right" />
        <span className="sofa-throw" />
      </div>
      <div className="living-rug" aria-hidden="true" />
      <div className="wood-basket" aria-hidden="true">
        <span /><span /><span />
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
