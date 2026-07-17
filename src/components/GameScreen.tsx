import { useEffect, useRef, useState } from 'react';
import { CabinScene } from './CabinScene';
import { DoorPrompt } from './DoorPrompt';
import { EndScreen } from './EndScreen';
import { GameHud } from './GameHud';
import { GameReadyMenu } from './GameReadyMenu';
import { IntroSequence } from './IntroSequence';
import { QuietMoment } from './QuietMoment';
import { VisitorCard } from './VisitorCard';
import { markGameCompleted, type GameSettings } from '../lib/settings';
import { useCabinGame } from '../lib/useCabinGame';

type GameScreenProps = {
  autoStart?: boolean;
  onComplete: () => void;
  onSignOut: () => void;
  settings: GameSettings;
};

export function GameScreen({ autoStart = false, onComplete, onSignOut, settings }: GameScreenProps) {
  const game = useCabinGame();
  const [introDone, setIntroDone] = useState(!autoStart || settings.skipIntro);
  const [windowShadow, setWindowShadow] = useState(false);
  const lastShadowOutcome = useRef('');
  const choiceLocked = game.status !== 'playing';

  const signOut = () => {
    game.restart();
    onSignOut();
  };

  const restartStory = () => {
    setIntroDone(false);
    game.restart();
  };

  const finishIntro = () => {
    setIntroDone(true);
    game.startNight();
  };

  useEffect(() => {
    if (game.status !== 'knocking') return undefined;
    const timer = window.setTimeout(game.lookThroughPeephole, 4000);
    return () => window.clearTimeout(timer);
  }, [game.status]);

  useEffect(() => {
    if (autoStart && game.status === 'ready' && introDone) game.startNight();
  }, [autoStart, game.status, introDone]);

  useEffect(() => {
    if (!game.finishedAllNights || game.status !== 'won') return;
    markGameCompleted();
    onComplete();
  }, [game.finishedAllNights, game.status, onComplete]);

  useEffect(() => {
    const shouldShadow =
      game.status === 'waiting' &&
      game.visitor.kind === 'skinwalker' &&
      game.outcome &&
      lastShadowOutcome.current !== game.outcome &&
      Math.random() > 0.55;

    if (!shouldShadow) return undefined;
    lastShadowOutcome.current = game.outcome;
    setWindowShadow(true);
    const timer = window.setTimeout(() => setWindowShadow(false), 2600);
    return () => window.clearTimeout(timer);
  }, [game.status, game.outcome, game.visitor.kind]);

  if (autoStart && game.status === 'ready' && !introDone && !settings.skipIntro) {
    return <IntroSequence onComplete={finishIntro} />;
  }

  if (game.status === 'ready') {
    return <GameReadyMenu onStart={game.startNight} />;
  }

  return (
    <main className={`game-shell game-status-${game.status} ${windowShadow ? 'has-window-shadow' : ''}`}>
      <div className={`play-area ${game.shaking && settings.screenShake ? 'is-shaking' : ''}`}>
        <GameHud
          diaryCount={game.diaryCount}
          lives={game.lives}
          score={game.score}
          supplies={game.supplies}
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
            <DoorPrompt />
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
          title={game.finishedAllNights ? game.ending.title : `Night ${game.night} Survived`}
          text={game.finishedAllNights ? game.ending.text : 'Ten knocks passed. The next night will be harder.'}
          actionLabel={game.finishedAllNights ? 'Play Again' : 'Next Night'}
          label={game.finishedAllNights ? 'Ending' : undefined}
          onRestart={game.finishedAllNights ? restartStory : game.nextNight}
        />
      )}
    </main>
  );
}
