import { snowStyle } from '../../lib/snow';
import { SceneHotspot } from './SceneHotspot';

type LivingRoomSceneProps = {
  guestNames: string[];
  hasKnock: boolean;
  onLookThroughDoor: () => void;
};

const initials = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2);

export function LivingRoomScene({ guestNames, hasKnock, onLookThroughDoor }: LivingRoomSceneProps) {
  const visibleGuests = guestNames.slice(0, 3);

  return (
    <>
      <p className="room-title">Living Room</p>
      {guestNames.length > 0 && <p className="room-guest-count">Guests: {guestNames.length}</p>}
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
      <div className="seated-guests" aria-hidden="true">
        {visibleGuests.map((name) => (
          <span className="seated-guest" key={name}>
            <b>{initials(name)}</b>
          </span>
        ))}
      </div>
      {visibleGuests.length > 0 && <p className="guest-name-tag">{visibleGuests.map((name) => name.split(' ')[0]).join(', ')}</p>}
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
