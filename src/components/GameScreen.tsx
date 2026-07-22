import { useEffect, useRef, useState } from 'react';
import { CabinScene } from './CabinScene';
import { GameEndOverlays } from './GameEndOverlays';
import { GameHud } from './GameHud';
import { GameReadyMenu } from './GameReadyMenu';
import { GameSidePanel } from './GameSidePanel';
import { IntroSequence } from './IntroSequence';
import { roomAtPosition, roomCenter } from '../lib/rooms';
import { markGameCompleted, type GameSettings } from '../lib/settings';
import { playDoorCreak } from '../lib/sounds';
import { useCabinGame } from '../lib/useCabinGame';
import { useCabinGuests } from '../lib/useCabinGuests';

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
  const [playerPosition, setPlayerPosition] = useState(roomCenter('living'));
  const [windowShadow, setWindowShadow] = useState(false);
  const lastShadowOutcome = useRef('');
  const previousRoom = useRef(roomAtPosition(playerPosition));
  const room = roomAtPosition(playerPosition);
  const choiceLocked = game.status !== 'playing';
  const canExplore = game.status === 'waiting' || game.status === 'knocking';
  const signOut = () => {
    game.restart();
    cabinGuests.resetGuests();
    setPlayerPosition(roomCenter('living'));
    onSignOut();
  };
  const restartStory = () => {
    setIntroDone(settings.skipIntro);
    cabinGuests.resetGuests();
    setPlayerPosition(roomCenter('living'));
    game.restart();
  };
  const finishIntro = () => {
    setIntroDone(true);
    setPlayerPosition(roomCenter('living'));
    game.startNight();
  };
  useEffect(() => {
    if (autoStart && game.status === 'ready' && (introDone || settings.skipIntro)) game.startNight();
  }, [autoStart, game.status, introDone, settings.skipIntro]);
  useEffect(() => {
    if (!game.finishedAllNights || game.status !== 'won') return;
    markGameCompleted();
    onComplete();
  }, [game.finishedAllNights, game.status, onComplete]);
  useEffect(() => {
    if (previousRoom.current !== room && canExplore) playDoorCreak();
    previousRoom.current = room;
  }, [canExplore, room]);
  const allowVisitor = () => {
    cabinGuests.addAllowedGuest(game.visitor, game.night, game.score);
    game.makeChoice('allow');
  };
  const nextNight = () => {
    cabinGuests.advanceNight(game.night + 1);
    game.nextNight();
  };
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
    return <IntroSequence onComplete={finishIntro} settings={settings} />;
  }
  if (game.status === 'ready') return <GameReadyMenu onStart={game.startNight} />;
  return (
    <main className={`game-shell game-status-${game.status} ${windowShadow ? 'has-window-shadow' : ''} ${settings.screenShake ? '' : 'screen-shake-off'}`}>
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
          <CabinScene
            canMove={canExplore}
            hasKnock={game.status === 'knocking'}
            onLookThroughDoor={game.lookThroughPeephole}
            onPlayerPositionChange={setPlayerPosition}
            playerPosition={playerPosition}
            guestNames={cabinGuests.guests.map((guest) => guest.name)}
            room={room}
          />
          <GameSidePanel
            canAsk={game.canAsk}
            canLook={game.canLook}
            disabled={choiceLocked}
            entries={game.entries}
            guestMessage={cabinGuests.guestMessage}
            guests={cabinGuests.guests}
            onAllow={allowVisitor}
            onAsk={game.askQuestion}
            onCheckGuests={() => cabinGuests.checkGuests(game.score)}
            onLook={game.lookCloser}
            onPeephole={game.lookThroughPeephole}
            onRefuse={() => game.makeChoice('refuse')}
            onTalkGuest={cabinGuests.talkGuest}
            outcome={game.outcome}
            room={room}
            settings={settings}
            status={game.status}
            visitor={game.visitor}
          />
        </div>
      </div>
      {game.status === 'jumpscare' && (
        <div className="jumpscare" aria-label="Mimic jumpscare">
          <span>Game Over</span>
        </div>
      )}
      <GameEndOverlays
        delayedEnding={cabinGuests.delayedEnding}
        ending={game.ending}
        finishedAllNights={game.finishedAllNights}
        night={game.night}
        onNextNight={nextNight}
        onRestart={restartStory}
        status={game.status}
      />
    </main>
  );
}
