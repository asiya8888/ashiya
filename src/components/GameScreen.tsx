import { CabinScene } from './CabinScene';
import { DiaryFragment } from './DiaryFragment';
import { EndScreen } from './EndScreen';
import { GameHud } from './GameHud';
import { VisitorCard } from './VisitorCard';
import { useCabinGame } from '../lib/useCabinGame';
import { snowStyle } from '../lib/snow';

type GameScreenProps = {
  onSignOut: () => void;
};

export function GameScreen({ onSignOut }: GameScreenProps) {
  const game = useCabinGame();
  const choiceLocked = game.status !== 'playing';

  const signOut = () => {
    game.restart();
    onSignOut();
  };

  if (game.status === 'ready') {
    return (
      <main className="menu-shell">
        <div className="menu-cabin" aria-hidden="true">
          {Array.from({ length: 48 }, (_, index) => (
            <span
              className="menu-snow"
              key={index}
              style={snowStyle(index)}
            />
          ))}
        </div>
        <EndScreen
          menu
          label="WHITEOUT"
          title="WHITEOUT"
          text="Lost travelers knock at your cabin. Some are only pretending to be human."
          actionLabel="Start Game"
          onRestart={game.startNight}
        >
          <DiaryFragment />
        </EndScreen>
      </main>
    );
  }

  return (
    <main className="game-shell">
      <div className={`play-area ${game.shaking ? 'is-shaking' : ''}`}>
        <GameHud
          lives={game.lives}
          score={game.score}
          night={game.night}
          visitorNumber={game.visitorIndex}
          totalVisitors={game.totalVisitors}
          onRestart={game.restart}
          onSignOut={signOut}
        />
        <p className="subtitle">{game.subtitle}</p>
        <div className="game-layout">
          <CabinScene />
          <VisitorCard
            disabled={choiceLocked}
            visitor={game.visitor}
            entries={game.entries}
            outcome={game.outcome}
            onAsk={game.askQuestion}
            onLook={game.lookCloser}
            onAllow={() => game.makeChoice('allow')}
            onRefuse={() => game.makeChoice('refuse')}
          />
        </div>
      </div>
      {game.status === 'jumpscare' && (
        <div className="jumpscare" aria-label="Mimic jumpscare">
          <span>Game Over</span>
        </div>
      )}
      {game.status === 'lost' && (
        <EndScreen danger title="Game Over" text="The cabin goes quiet before sunrise." onRestart={game.restart} />
      )}
      {game.status === 'won' && (
        <EndScreen
          title={`Night ${game.night} Survived`}
          text="Ten knocks passed. The next night will be harder."
          actionLabel="Next Night"
          onRestart={game.nextNight}
        />
      )}
    </main>
  );
}
