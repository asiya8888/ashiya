import { useCallback, useMemo, useRef, useState } from 'react';
import { encounterDelay, FINAL_NIGHT, gameSubtitle, STARTING_LIVES, TOTAL_VISITORS } from './gameConfig';
import { playEventSound } from './eventSounds';
import { resolveChoice } from './outcomes';
import { randomQuestion } from './questions';
import { takeRandom } from './random';
import { playDoorCreak, playJumpscare, playKnock, setMusicIntensity, startAmbience, stopAmbience } from './sounds';
import type { GameStatus } from './gameTypes';
import { makeVisitor, type Visitor } from './visitors';

export function useCabinGame() {
  const firstVisitor = useRef(makeVisitor(1, 1));
  const [night, setNight] = useState(1);
  const [visitorIndex, setVisitorIndex] = useState(1);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>('ready');
  const [shaking, setShaking] = useState(false);
  const [visitor, setVisitor] = useState<Visitor>(() => firstVisitor.current);
  const [entries, setEntries] = useState<string[]>([]);
  const [outcome, setOutcome] = useState('');
  const [remainingAnswers, setRemainingAnswers] = useState<string[]>(() => firstVisitor.current.answers);
  const [remainingInspections, setRemainingInspections] = useState<string[]>(() => firstVisitor.current.inspections);
  const [askedThisVisitor, setAskedThisVisitor] = useState(false);
  const [lookedThisVisitor, setLookedThisVisitor] = useState(false);
  const nextKnockTimer = useRef<number>(), nextVisitorTimer = useRef<number>(), jumpscareTimer = useRef<number>();

  const subtitle = useMemo(() => gameSubtitle(status), [status]);
  const clearTimers = () => {
    window.clearTimeout(nextKnockTimer.current);
    window.clearTimeout(nextVisitorTimer.current);
    window.clearTimeout(jumpscareTimer.current);
  };

  const resetEncounter = (next: Visitor) => {
    setVisitor(next);
    setEntries([]);
    setOutcome('');
    setRemainingAnswers(next.answers);
    setRemainingInspections(next.inspections);
    setAskedThisVisitor(false); setLookedThisVisitor(false);
    setMusicIntensity(next.kind === 'skinwalker');
  };
  const triggerArrival = useCallback((eventSound?: Visitor['eventSound']) => {
    setStatus('knocking');
    setShaking(true);
    playKnock();
    playEventSound(eventSound);
    window.setTimeout(() => setShaking(false), 420);
  }, []);

  const nextVisitor = useCallback(() => {
    setScore((currentScore) => currentScore + 1);
    if (visitorIndex >= TOTAL_VISITORS) {
      setStatus('won');
      stopAmbience();
      return;
    }

    const nextIndex = visitorIndex + 1;
    const next = makeVisitor(nextIndex, night);
    setVisitorIndex(nextIndex);
    resetEncounter(next);
    nextKnockTimer.current = window.setTimeout(() => triggerArrival(next.eventSound), 140);
  }, [night, triggerArrival, visitorIndex]);
  const restart = () => {
    clearTimers();
    setNight(1); setVisitorIndex(1); setLives(STARTING_LIVES);
    setScore(0); setStatus('ready');
    stopAmbience();
    resetEncounter(makeVisitor(1, 1));
  };

  const makeChoice = (choice: 'allow' | 'refuse') => {
    const result = resolveChoice(visitor, choice);
    setOutcome(result.message);
    if (result.jumpscare) {
      setStatus('jumpscare');
      playJumpscare();
      stopAmbience();
      jumpscareTimer.current = window.setTimeout(() => setStatus('lost'), 900);
      return;
    }
    if (result.livesLost > 0) {
      const nextLives = lives - result.livesLost;
      setLives(nextLives);
      if (nextLives <= 0) {
        setStatus('lost');
        playJumpscare();
        stopAmbience();
        return;
      }
    }
    setStatus('waiting');
    nextVisitorTimer.current = window.setTimeout(nextVisitor, encounterDelay());
  };

  const lookThroughPeephole = () => {
    playDoorCreak();
    setStatus('playing');
    setMusicIntensity(visitor.kind === 'skinwalker');
  };

  const askQuestion = () => {
    if (askedThisVisitor) return;
    setRemainingAnswers((currentAnswers) => {
      if (currentAnswers.length === 0) return currentAnswers;
      const next = takeRandom(currentAnswers);
      setEntries((current) => [`${randomQuestion()} ${next.item}`, ...current].slice(0, 3));
      setAskedThisVisitor(true);
      return next.rest;
    });
  };
  const lookCloser = () => {
    if (lookedThisVisitor) return;
    setRemainingInspections((currentClues) => {
      if (currentClues.length === 0) return currentClues;
      const next = takeRandom(currentClues);
      setEntries((current) => [`Inspection: ${next.item}`, ...current].slice(0, 3));
      setLookedThisVisitor(true);
      return next.rest;
    });
  };
  const startNight = () => {
    setStatus('waiting');
    startAmbience();
    setMusicIntensity(false);
    nextKnockTimer.current = window.setTimeout(() => triggerArrival(visitor.eventSound), encounterDelay());
  };
  const nextNight = () => {
    const nextNightNumber = night + 1;
    const firstVisitor = makeVisitor(1, nextNightNumber);
    setNight(nextNightNumber); setVisitorIndex(1);
    resetEncounter(firstVisitor);
    setStatus('waiting');
    startAmbience();
    setMusicIntensity(false);
    nextKnockTimer.current = window.setTimeout(() => triggerArrival(firstVisitor.eventSound), encounterDelay());
  };

  return {
    entries, lives, night, outcome, score, shaking, status, subtitle,
    totalVisitors: TOTAL_VISITORS,
    visitor, visitorIndex,
    finishedAllNights: status === 'won' && night >= FINAL_NIGHT,
    canAsk: remainingAnswers.length > 0 && !askedThisVisitor,
    canLook: remainingInspections.length > 0 && !lookedThisVisitor,
    askQuestion, lookCloser, lookThroughPeephole, makeChoice, nextNight, restart, startNight,
  };
}
