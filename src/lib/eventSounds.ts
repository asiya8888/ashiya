import { softNoise, tone } from './sounds';
import type { EventSound } from './visitors';

export function playEventSound(event?: EventSound) {
  if (!event) return;

  if (event === 'scratch') {
    [0, 0.22, 0.48].forEach((delay) => {
      tone(420, delay, 0.08, 0.05, 'sawtooth');
      softNoise(delay, 0.08, 0.08);
    });
  }

  if (event === 'footsteps') [0, 0.34, 0.82].forEach((delay) => tone(58, delay, 0.12, 0.16));
  if (event === 'roof') [0, 0.18, 0.44].forEach((delay) => tone(74, delay, 0.16, 0.13, 'triangle'));
  if (event === 'wind') softNoise(0, 0.9, 0.18);
  if (event === 'flicker') [0, 0.08].forEach((delay) => tone(180, delay, 0.05, 0.05, 'square'));
  if (event === 'cry') [0, 0.4].forEach((delay) => tone(310, delay, 0.32, 0.035));
  if (event === 'inside') tone(118, 0.18, 0.42, 0.07, 'triangle');
}
