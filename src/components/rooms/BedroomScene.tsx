import type { RoomId } from '../../lib/rooms';
import { snowStyle } from '../../lib/snow';
import { SceneHotspot } from './SceneHotspot';

type BedroomSceneProps = {
  canMove: boolean;
  onMove: (room: RoomId) => void;
};

export function BedroomScene({ canMove, onMove }: BedroomSceneProps) {
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
      <SceneHotspot className="hotspot-living" disabled={!canMove} onClick={() => onMove('living')}>
        Living Room
      </SceneHotspot>
    </>
  );
}
