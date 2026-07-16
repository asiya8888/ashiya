import { CabinScene } from './CabinScene';
import { DiaryFragment } from './DiaryFragment';
import { DoorPrompt } from './DoorPrompt';
import { EndScreen } from './EndScreen';
import { GameHud } from './GameHud';
import { QuietMoment } from './QuietMoment';
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
    <main className={`game-shell game-status-${game.status}`}>
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
          {game.status === 'waiting' ? (
            <QuietMoment outcome={game.outcome} />
          ) : game.status === 'knocking' ? (
            <DoorPrompt
              onLook={game.lookThroughPeephole}
              onIgnore={() => game.makeChoice('refuse')}
            />
          ) : (
            <VisitorCard
              disabled={choiceLocked}
              visitor={game.visitor}
              entries={game.entries}
              outcome={game.outcome}
              canAsk={game.canAsk}
              canLook={game.canLook}
              onAsk={game.askQuestion}
              onLook={game.lookCloser}
              onAllow={() => game.makeChoice('allow')}
              onRefuse={() => game.makeChoice('refuse')}
            />
          )}
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
          title={game.finishedAllNights ? 'You Survived Whiteout' : `Night ${game.night} Survived`}
          text={game.finishedAllNights ? 'Five nights passed. The diary was enough, for now.' : 'Ten knocks passed. The next night will be harder.'}
          actionLabel={game.finishedAllNights ? 'Play Again' : 'Next Night'}
          onRestart={game.finishedAllNights ? game.restart : game.nextNight}
        />
      )}
    </main>
  );
}
