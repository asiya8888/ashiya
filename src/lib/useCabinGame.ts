import { useCallback, useMemo, useRef, useState } from 'react';
import { answerQuestion } from './conversations';
import { unlockDiaryPage } from './diaryPages';
import { finalEnding } from './endings';
import { encounterDelay, FINAL_NIGHT, gameSubtitle, QUESTIONS_PER_VISITOR, STARTING_LIVES, STARTING_SUPPLIES, TOTAL_VISITORS } from './gameConfig';
import { playEventSound } from './eventSounds';
import { resolveChoice } from './outcomes';
import type { QuestionKey } from './questions';
import { createVisitorRun, initialRunStats, makeRunVisitor } from './runVisitors';
import { playJumpscare, playKnock, setMusicIntensity, startAmbience, stopAmbience } from './sounds';
import type { GameStatus } from './gameTypes';
import type { Visitor } from './visitors';
import type { VisitorMemory } from './visitorMemory';

export function useCabinGame() {
  const run = useRef(createVisitorRun());
  const initialVisitor = useRef(makeRunVisitor(run.current, 1, 1, initialRunStats()));
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
  const [visitor, setVisitor] = useState<Visitor>(() => initialVisitor.current);
  const [entries, setEntries] = useState<string[]>([]);
  const [outcome, setOutcome] = useState('');
  const [remainingQuestions, setRemainingQuestions] = useState<QuestionKey[]>(() => initialVisitor.current.conversation?.map((question) => question.id) ?? []);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [askedResponses, setAskedResponses] = useState<Partial<Record<QuestionKey, string>>>({});
  const memories = useRef<VisitorMemory[]>([]);
  const nextKnockTimer = useRef<number>(), nextVisitorTimer = useRef<number>(), jumpscareTimer = useRef<number>();

  const subtitle = useMemo(() => gameSubtitle(status), [status]);
  const clearTimers = () => [nextKnockTimer, nextVisitorTimer, jumpscareTimer].forEach((timer) => window.clearTimeout(timer.current));
  const resetEncounter = (next: Visitor) => {
    setVisitor(next); setEntries([]); setOutcome('');
    setRemainingQuestions(next.conversation?.map((question) => question.id) ?? []); setAskedResponses({});
    setQuestionsAsked(0);
    setMusicIntensity(next.kind === 'skinwalker');
  };
  const triggerArrival = useCallback((eventSound?: Visitor['eventSound']) => {
    setStatus('knocking'); setShaking(true); playKnock(); playEventSound(eventSound);
    window.setTimeout(() => setShaking(false), 420);
  }, []);
  const makeScheduledVisitor = (nextIndex: number, nextNightNumber: number) => makeRunVisitor(
    run.current,
    nextIndex,
    nextNightNumber,
    { helped, refused, supplies },
    memories.current,
  );
  const nextVisitor = useCallback(() => {
    setScore((currentScore) => currentScore + 1);
    if (visitorIndex >= TOTAL_VISITORS) {
      setStatus('won'); stopAmbience();
      return;
    }

    const nextIndex = visitorIndex + 1;
    const next = makeScheduledVisitor(nextIndex, night);
    setVisitorIndex(nextIndex); resetEncounter(next);
    nextKnockTimer.current = window.setTimeout(() => triggerArrival(next.eventSound), 140);
  }, [helped, night, refused, supplies, triggerArrival, visitorIndex]);
  const restart = () => {
    clearTimers();
    run.current = createVisitorRun();
    setNight(1); setVisitorIndex(1); setLives(STARTING_LIVES); setSupplies(STARTING_SUPPLIES);
    setDiaryCount(0); setHelped(0); setRefused(0); memories.current = [];
    setScore(0); setStatus('ready'); stopAmbience();
    resetEncounter(makeRunVisitor(run.current, 1, 1, initialRunStats()));
  };
  const makeChoice = (choice: 'allow' | 'refuse') => {
    const result = resolveChoice(visitor, choice);
    const diaryPage = result.diary ? unlockDiaryPage(diaryCount) : '';
    if (result.diary) setDiaryCount((count) => count + 1); if (visitor.kind !== 'empty' && choice === 'allow') setHelped((count) => count + 1); if (visitor.kind !== 'empty' && choice === 'refuse') setRefused((count) => count + 1);
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
        setStatus('consequence');
        nextVisitorTimer.current = window.setTimeout(() => {
          setStatus('lost');
          stopAmbience();
        }, 3200);
        return;
      }
    }
    if (result.suppliesLost > 0) setSupplies((current) => Math.max(0, current - result.suppliesLost));
    if (visitor.kind === 'skinwalker' && choice === 'allow') run.current.hadMimicInside = true;
    setStatus('consequence'); nextVisitorTimer.current = window.setTimeout(nextVisitor, 3200);
  };
  const lookThroughPeephole = () => {
    setStatus('playing'); setMusicIntensity(visitor.kind === 'skinwalker');
  };

  const askQuestion = (key: QuestionKey) => {
    const profile = visitor.conversation;
    if (!profile || questionsAsked >= QUESTIONS_PER_VISITOR) return;
    if (!remainingQuestions.includes(key)) return;
    const question = profile.find((item) => item.id === key);
    if (!question) return;
    const repeated = Boolean(askedResponses[key]);
    const answer = askedResponses[key] ?? answerQuestion(visitor.name, visitor.kind, profile, key, repeated);
    setAskedResponses((current) => ({ ...current, [key]: answer }));
    setQuestionsAsked((count) => count + 1);
    setEntries((current) => [`${question.text} — ${answer}`, ...current].slice(0, 3));
    setRemainingQuestions((current) => current.filter((item) => item !== key));
  };
  const startNight = () => {
    setStatus('waiting'); startAmbience(); setMusicIntensity(false);
    nextKnockTimer.current = window.setTimeout(() => triggerArrival(visitor.eventSound), encounterDelay());
  };
  const nextNight = () => {
    const nextNightNumber = night + 1;
    const firstVisitor = makeScheduledVisitor(1, nextNightNumber);
    setNight(nextNightNumber); setVisitorIndex(1); resetEncounter(firstVisitor);
    setStatus('waiting'); startAmbience(); setMusicIntensity(false);
    nextKnockTimer.current = window.setTimeout(() => triggerArrival(firstVisitor.eventSound), encounterDelay());
  };

  return {
    diaryCount, entries, lives, night, outcome, score, shaking, status, subtitle, supplies, visitor, visitorIndex,
    ending: finalEnding({ diaryCount, helped, refused, supplies }),
    totalVisitors: TOTAL_VISITORS,
    finishedAllNights: status === 'won' && night >= FINAL_NIGHT,
    availableQuestions: visitor.conversation?.filter((question) => remainingQuestions.includes(question.id)) ?? [],
    canAsk: remainingQuestions.length > 0 && questionsAsked < QUESTIONS_PER_VISITOR,
    askQuestion, lookThroughPeephole, makeChoice, nextNight, restart, startNight,
  };
}
