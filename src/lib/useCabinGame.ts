import { useCallback, useMemo, useRef, useState } from 'react';
import { answerQuestion } from './conversations';
import { unlockDiaryPage } from './diaryPages';
import { finalEnding } from './endings';
import { emptyEncounterDelay, encounterDelay, FINAL_NIGHT, gameSubtitle, STARTING_LIVES, STARTING_SUPPLIES, TOTAL_VISITORS } from './gameConfig';
import { playEventSound } from './eventSounds';
import { resolveChoice } from './outcomes';
import { questions, questionText, type QuestionKey } from './questions';
import { takeRandom } from './random';
import { playDoorCreak, playJumpscare, playKnock, setMusicIntensity, startAmbience, stopAmbience } from './sounds';
import type { GameStatus } from './gameTypes';
import { makeVisitor, type Visitor } from './visitors';
import type { VisitorMemory } from './visitorMemory';

export function useCabinGame() {
  const firstVisitor = useRef(makeVisitor(1, 1));
  const [night, setNight] = useState(1);
  const [visitorIndex, setVisitorIndex] = useState(1);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [supplies, setSupplies] = useState(STARTING_SUPPLIES);
  const [diaryCount, setDiaryCount] = useState(0);
  const [helped, setHelped] = useState(0);
  const [refused, setRefused] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>('ready');
  const [shaking, setShaking] = useState(false);
  const [visitor, setVisitor] = useState<Visitor>(() => firstVisitor.current);
  const [entries, setEntries] = useState<string[]>([]);
  const [outcome, setOutcome] = useState('');
  const [remainingQuestions, setRemainingQuestions] = useState<QuestionKey[]>(() => questions.map((question) => question.key));
  const [askedResponses, setAskedResponses] = useState<Partial<Record<QuestionKey, string>>>({});
  const [remainingInspections, setRemainingInspections] = useState<string[]>(() => firstVisitor.current.inspections);
  const [lookedThisVisitor, setLookedThisVisitor] = useState(false);
  const memories = useRef<VisitorMemory[]>([]);
  const nextKnockTimer = useRef<number>(), nextVisitorTimer = useRef<number>(), jumpscareTimer = useRef<number>();

  const subtitle = useMemo(() => gameSubtitle(status), [status]);
  const clearTimers = () => [nextKnockTimer, nextVisitorTimer, jumpscareTimer].forEach((timer) => window.clearTimeout(timer.current));

  const resetEncounter = (next: Visitor) => {
    setVisitor(next); setEntries([]); setOutcome('');
    setRemainingQuestions(questions.map((question) => question.key)); setAskedResponses({});
    setRemainingInspections(next.inspections); setLookedThisVisitor(false);
    setMusicIntensity(next.kind === 'skinwalker');
  };
  const triggerArrival = useCallback((eventSound?: Visitor['eventSound']) => {
    setStatus('knocking'); setShaking(true); playKnock(); playEventSound(eventSound);
    window.setTimeout(() => setShaking(false), 420);
  }, []);

  const nextVisitor = useCallback(() => {
    setScore((currentScore) => currentScore + 1);
    if (visitorIndex >= TOTAL_VISITORS) {
      setStatus('won'); stopAmbience();
      return;
    }

    const nextIndex = visitorIndex + 1;
    const next = makeVisitor(nextIndex, night, memories.current);
    setVisitorIndex(nextIndex); resetEncounter(next);
    nextKnockTimer.current = window.setTimeout(() => triggerArrival(next.eventSound), 140);
  }, [night, triggerArrival, visitorIndex]);
  const restart = () => {
    clearTimers();
    setNight(1); setVisitorIndex(1); setLives(STARTING_LIVES); setSupplies(STARTING_SUPPLIES);
    setDiaryCount(0); setHelped(0); setRefused(0); memories.current = [];
    setScore(0); setStatus('ready'); stopAmbience(); resetEncounter(makeVisitor(1, 1));
  };

  const makeChoice = (choice: 'allow' | 'refuse') => {
    const result = resolveChoice(visitor, choice);
    const diaryPage = result.diary ? unlockDiaryPage(diaryCount) : '';
    if (result.diary) setDiaryCount((count) => count + 1); if (visitor.kind !== 'empty' && choice === 'allow') setHelped((count) => count + 1);
    if (visitor.kind !== 'empty' && choice === 'refuse') setRefused((count) => count + 1);
    if (visitor.kind !== 'empty') memories.current = [{ choice, kind: visitor.kind, name: visitor.name }, ...memories.current].slice(0, 4);
    setOutcome(diaryPage ? `${result.message} ${diaryPage}` : result.message);
    if (result.jumpscare) {
      setStatus('jumpscare'); playJumpscare(); stopAmbience();
      jumpscareTimer.current = window.setTimeout(() => setStatus('lost'), 900);
      return;
    }
    if (result.livesLost > 0) {
      const nextLives = lives - result.livesLost;
      setLives(nextLives);
      if (nextLives <= 0) {
        setStatus('lost'); playJumpscare(); stopAmbience();
        return;
      }
    }
    if (result.suppliesLost > 0) setSupplies((current) => Math.max(0, current - result.suppliesLost));
    setStatus('waiting'); nextVisitorTimer.current = window.setTimeout(nextVisitor, encounterDelay());
  };

  const lookThroughPeephole = () => {
    if (visitor.kind === 'empty') {
      playDoorCreak(); playEventSound('wind');
      nextKnockTimer.current = window.setTimeout(() => playEventSound('footsteps'), 900);
      setOutcome(visitor.eventText ?? 'Nobody is outside.'); setStatus('waiting');
      nextVisitorTimer.current = window.setTimeout(nextVisitor, emptyEncounterDelay());
      return;
    }
    playDoorCreak(); setStatus('playing'); setMusicIntensity(visitor.kind === 'skinwalker');
  };

  const askQuestion = () => {
    const profile = visitor.conversation;
    if (!profile) return;
    setRemainingQuestions((currentQuestions) => {
      if (currentQuestions.length === 0) return currentQuestions;
      const next = takeRandom(currentQuestions);
      const repeated = Boolean(askedResponses[next.item]);
      const answer = askedResponses[next.item] ?? answerQuestion(visitor.name, visitor.kind, profile, next.item, repeated);
      setAskedResponses((current) => ({ ...current, [next.item]: answer }));
      setEntries((current) => [`${questionText(next.item)} ${answer}`, ...current].slice(0, 5));
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
    setStatus('waiting'); startAmbience(); setMusicIntensity(false);
    nextKnockTimer.current = window.setTimeout(() => triggerArrival(visitor.eventSound), encounterDelay());
  };
  const nextNight = () => {
    const nextNightNumber = night + 1;
    const firstVisitor = makeVisitor(1, nextNightNumber, memories.current);
    setNight(nextNightNumber); setVisitorIndex(1); resetEncounter(firstVisitor);
    setStatus('waiting'); startAmbience(); setMusicIntensity(false);
    nextKnockTimer.current = window.setTimeout(() => triggerArrival(firstVisitor.eventSound), encounterDelay());
  };

  return {
    diaryCount, entries, lives, night, outcome, score, shaking, status, subtitle, supplies, visitor, visitorIndex,
    ending: finalEnding({ diaryCount, helped, refused, supplies }),
    totalVisitors: TOTAL_VISITORS,
    finishedAllNights: status === 'won' && night >= FINAL_NIGHT,
    canAsk: remainingQuestions.length > 0,
    canLook: remainingInspections.length > 0 && !lookedThisVisitor,
    askQuestion, lookCloser, lookThroughPeephole, makeChoice, nextNight, restart, startNight,
  };
}
