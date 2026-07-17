import { DiaryFragment } from './DiaryFragment';
import { EndScreen } from './EndScreen';
import { snowStyle } from '../lib/snow';

type GameReadyMenuProps = {
  onStart: () => void;
};

export function GameReadyMenu({ onStart }: GameReadyMenuProps) {
  return (
    <main className="menu-shell">
      <div className="menu-cabin" aria-hidden="true">
        {Array.from({ length: 48 }, (_, index) => (
          <span className="menu-snow" key={index} style={snowStyle(index)} />
        ))}
      </div>
      <EndScreen
        actionLabel="Begin Night"
        label="WHITEOUT"
        menu
        onRestart={onStart}
        text="The cabin is warm. The road is gone. Someone may knock before dawn."
        title="WHITEOUT"
      >
        <DiaryFragment />
      </EndScreen>
    </main>
  );
}
