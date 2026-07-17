import type { RoomId } from '../../lib/rooms';
import { snowStyle } from '../../lib/snow';
import { SceneHotspot } from './SceneHotspot';

type KitchenSceneProps = {
  canMove: boolean;
  onMove: (room: RoomId) => void;
};

export function KitchenScene({ canMove, onMove }: KitchenSceneProps) {
  return (
    <>
      <p className="room-title">Kitchen</p>
      <div className="kitchen-window">
        {Array.from({ length: 18 }, (_, index) => <span className="snowflake" key={index} style={snowStyle(index + 40)} />)}
      </div>
      <div className="kitchen-cabinets">
        <span className="cabinet-row" />
      </div>
      <div className="kitchen-counter">
        <span className="sink" />
        <span className="stove" />
        <span className="small-jars" />
      </div>
      <div className="fridge" />
      <div className="table">
        <span className="chair chair-left" />
        <span className="chair chair-right" />
        <span className="chair chair-back" />
        <span className="mug" />
      </div>
      <SceneHotspot className="hotspot-living" disabled={!canMove} onClick={() => onMove('living')}>
        Living Room
      </SceneHotspot>
    </>
  );
}
