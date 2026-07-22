import { softNoise, tone } from './sounds';

export type ButtonSound = 'allow' | 'ask' | 'inspect' | 'menu';

export function playButtonSound(sound?: ButtonSound) {
  if (sound === 'menu') {
    softNoise(0, 0.025, 0.012);
    tone(620, 0, 0.035, 0.008);
    return;
  }
  if (sound === 'allow') {
    softNoise(0, 0.045, 0.022);
    softNoise(0.065, 0.035, 0.014);
    return;
  }
  if (sound === 'inspect') {
    softNoise(0, 0.025, 0.019);
    tone(430, 0, 0.035, 0.007);
    return;
  }
  if (sound === 'ask') {
    softNoise(0, 0.035, 0.016);
    tone(260, 0, 0.045, 0.006, 'triangle');
    return;
  }
  softNoise(0, 0.03, 0.015);
}
