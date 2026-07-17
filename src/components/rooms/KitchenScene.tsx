import { snowStyle } from '../../lib/snow';

export function KitchenScene() {
  return (
    <>
      <p className="room-title">Kitchen</p>
      <div className="kitchen-glow" aria-hidden="true" />
      <div className="kitchen-window">
        <span className="window-crossbar window-crossbar-vertical" />
        <span className="window-crossbar window-crossbar-horizontal" />
        <span className="window-frost" />
        {Array.from({ length: 18 }, (_, index) => <span className="snowflake" key={index} style={snowStyle(index + 40)} />)}
      </div>
      <div className="kitchen-cabinets">
        <span className="cabinet-door cabinet-door-left" />
        <span className="cabinet-door cabinet-door-mid" />
        <span className="cabinet-door cabinet-door-right" />
        <span className="cabinet-shelf" />
      </div>
      <div className="kitchen-counter">
        <span className="stove"><span /></span>
        <span className="sink"><span /></span>
        <span className="faucet" />
        <span className="small-jars" />
      </div>
      <div className="fridge">
        <span className="fridge-freezer" />
        <span className="fridge-handle fridge-handle-top" />
        <span className="fridge-handle fridge-handle-bottom" />
        <span className="fridge-note" />
      </div>
      <div className="table">
        <span className="table-top" />
        <span className="table-leg table-leg-left" />
        <span className="table-leg table-leg-right" />
        <span className="chair chair-left"><span /></span>
        <span className="chair chair-right"><span /></span>
        <span className="chair chair-back"><span /></span>
        <span className="mug" />
      </div>
      <span className="doorway doorway-right" aria-hidden="true" />
    </>
  );
}
