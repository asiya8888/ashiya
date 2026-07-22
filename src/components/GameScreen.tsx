import { useEffect, useRef, useState } from 'react';
import { roomCenter } from '../lib/rooms';
import { markGameCompleted, type GameSettings } from '../lib/settings';
import { useCabinGame } from '../lib/useCabinGame';
import { useCabinGuests } from '../lib/useCabinGuests';
import { CabinScene } from './CabinScene';
import { ConsequenceScreen } from './ConsequenceScreen';
import { DoorPrompt } from './DoorPrompt';
import { GameEndOverlays } from './GameEndOverlays';
import { GameHud } from './GameHud';
import { GameReadyMenu } from './GameReadyMenu';
import { IntroSequence } from './IntroSequence';
import { VisitorCard } from './VisitorCard';

type GameScreenProps = {
  autoStart?: boolean;
  onComplete: () => void;
  onSignOut: () => void;
  settings: GameSettings;
};

export function GameScreen({ autoStart = false, onComplete, onSignOut, settings }: GameScreenProps) {
  const game = useCabinGame();
  const cabinGuests = useCabinGuests();
  const [introDone, setIntroDone] = useState(!autoStart || settings.skipIntro);
  const [transitioning, setTransitioning] = useState(false);
  const transitionTimer = useRef<number>();

  const start = () => {
    setIntroDone(true);
    game.startNight();
  };
  const restart = () => {
    window.clearTimeout(transitionTimer.current);
    setTransitioning(false);
    setIntroDone(settings.skipIntro);
    cabinGuests.resetGuests();
    game.restart();
  };
  const signOut = () => {
    restart();
    onSignOut();
  };
  const lookThroughPeephole = () => {
    setTransitioning(true);
    transitionTimer.current = window.setTimeout(() => {
      game.lookThroughPeephole();
      setTransitioning(false);
    }, 520);
  };
  const allowVisitor = () => {
    cabinGuests.addAllowedGuest(game.visitor, game.night, game.score);
    game.makeChoice('allow');
  };
  const nextNight = () => {
    cabinGuests.advanceNight(game.night + 1);
    game.nextNight();
  };

  useEffect(() => () => window.clearTimeout(transitionTimer.current), []);
  useEffect(() => {
    if (autoStart && game.status === 'ready' && (introDone || settings.skipIntro)) game.startNight();
  }, [autoStart, game.status, introDone, settings.skipIntro]);
  useEffect(() => {
    if (!game.finishedAllNights || game.status !== 'won') return;
    markGameCompleted();
    onComplete();
  }, [game.finishedAllNights, game.status, onComplete]);

  if (autoStart && game.status === 'ready' && !introDone && !settings.skipIntro) {
    return <IntroSequence onComplete={start} settings={settings} />;
  }
  if (game.status === 'ready') return <GameReadyMenu onStart={game.startNight} />;

  const meetingVisitor = game.status === 'playing';
  return (
    <main className={`game-shell cinematic-game game-status-${game.status} ${transitioning ? 'peephole-transition' : ''}`}>
      {!meetingVisitor && (
        <div className={`living-room-screen ${game.shaking && settings.screenShake ? 'is-shaking' : ''}`}>
          <GameHud
            diaryCount={game.diaryCount} lives={game.lives} night={game.night}
            onRestart={restart} onSignOut={signOut} score={game.score}
            supplies={game.supplies} totalVisitors={game.totalVisitors}
            visitorNumber={game.visitorIndex}
          />
          <CabinScene
            canMove={false} guests={[]} hasKnock={false}
            onLookThroughDoor={lookThroughPeephole}
            onPlayerPositionChange={() => undefined}
            playerPosition={roomCenter('living')} room="living"
          />
          {game.status === 'knocking' && <DoorPrompt onLook={lookThroughPeephole} />}
          {game.status === 'waiting' && game.outcome && <p className="living-room-message">{game.outcome}</p>}
        </div>
      )}
      {meetingVisitor && (
        <VisitorCard
          canAsk={game.canAsk} disabled={false} entries={game.entries}
          onAllow={allowVisitor} onAsk={game.askQuestion}
          onRefuse={() => game.makeChoice('refuse')}
          outcome={game.outcome} questions={game.availableQuestions}
          settings={settings} visitor={game.visitor}
        />
      )}
      {game.status === 'consequence' && <ConsequenceScreen message={game.outcome} />}
      {transitioning && <div className="peephole-blackout" aria-hidden="true" />}
      {game.status === 'jumpscare' && <div className="jumpscare"><span>Game Over</span></div>}
      <GameEndOverlays
        delayedEnding={cabinGuests.delayedEnding} ending={game.ending}
        finishedAllNights={game.finishedAllNights} night={game.night}
        onNextNight={nextNight} onRestart={restart} status={game.status}
      />
    </main>
  );
}
