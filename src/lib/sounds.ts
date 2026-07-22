import { noiseBurst } from './noise';
import { startAmbientMelody } from './ambientMelody';

type LegacyAudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

let audio: AudioContext | null = null;
let wind: OscillatorNode | null = null;
let drone: OscillatorNode | null = null;
let windGain: GainNode | null = null;
let droneGain: GainNode | null = null;
let fireTimer: number | null = null;
let stopMelody: (() => void) | null = null;
let masterVolume = 0.7;

function getAudio() {
  const AudioCtor = window.AudioContext || (window as LegacyAudioWindow).webkitAudioContext;
  if (!AudioCtor) return null;

  if (!audio) audio = new AudioCtor();
  if (audio.state === 'suspended') void audio.resume();
  return audio;
}

export function tone(frequency: number, start: number, length: number, volume: number, type: OscillatorType = 'sine') {
  const context = getAudio();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  gain.gain.setValueAtTime(0.001, context.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume * masterVolume, context.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + start + length);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(context.currentTime + start);
  oscillator.stop(context.currentTime + start + length + 0.03);
}

export function softNoise(start: number, length: number, volume: number) {
  const context = getAudio();
  if (context) noiseBurst(context, start, length, volume * masterVolume);
}

function scheduleFire() {
  fireTimer = window.setTimeout(() => {
    softNoise(0, 0.035 + Math.random() * 0.035, 0.018);
    scheduleFire();
  }, 180 + Math.random() * 900);
}

export function setMasterVolume(volume: number) {
  masterVolume = Math.max(0, Math.min(1, volume));
  if (!audio) return;
  const now = audio.currentTime;
  windGain?.gain.setTargetAtTime(0.012 * masterVolume, now, 0.2);
  droneGain?.gain.setTargetAtTime(0.008 * masterVolume, now, 0.2);
}

export function playKnock() {
  const count = 2 + Math.floor(Math.random() * 3);
  const basePitch = 72 + Math.random() * 22;
  let time = 0;

  Array.from({ length: count }).forEach(() => {
    tone(basePitch + Math.random() * 12, time, 0.13, 0.42, 'sine');
    tone(basePitch * 0.55, time + 0.015, 0.11, 0.22, 'triangle');
    time += 0.16 + Math.random() * 0.38;
  });
}

export function playDoorCreak() {
  tone(96, 0, 0.45, 0.08, 'sawtooth');
  tone(132, 0.08, 0.34, 0.04, 'triangle');
  softNoise(0.02, 0.18, 0.025);
}


export function playJumpscare() {
  const context = getAudio();
  if (context) noiseBurst(context, 0, 0.42, 0.95 * masterVolume);
  [0, 0.035, 0.07, 0.11].forEach((delay) => tone(620 + delay * 2400, delay, 0.13, 1, 'sawtooth'));
  tone(42, 0, 0.7, 1, 'sawtooth');
  tone(150, 0.08, 0.42, 0.95, 'triangle');
}

export function startAmbience() {
  const context = getAudio();
  if (!context || wind) return;

  wind = context.createOscillator();
  windGain = context.createGain();
  wind.type = 'sine';
  wind.frequency.value = 36;
  windGain.gain.value = 0.012 * masterVolume;
  wind.connect(windGain);
  windGain.connect(context.destination);
  wind.start();

  drone = context.createOscillator();
  droneGain = context.createGain();
  drone.type = 'sine';
  drone.frequency.value = 74;
  droneGain.gain.value = 0.008 * masterVolume;
  drone.connect(droneGain);
  droneGain.connect(context.destination);
  drone.start();

  scheduleFire();
  stopMelody = startAmbientMelody(context, () => masterVolume);
}

export function setMusicIntensity(isSuspicious: boolean) {
  if (!audio || !drone || !droneGain || !windGain) return;

  const now = audio.currentTime;
  drone.frequency.setTargetAtTime(isSuspicious ? 82 : 74, now, 0.7);
  droneGain.gain.setTargetAtTime((isSuspicious ? 0.014 : 0.008) * masterVolume, now, 0.9);
  windGain.gain.setTargetAtTime((isSuspicious ? 0.018 : 0.012) * masterVolume, now, 0.9);
}

export function stopAmbience() {
  if (fireTimer) window.clearTimeout(fireTimer);
  stopMelody?.();
  fireTimer = null;
  stopMelody = null;

  [wind, drone].forEach((node) => {
    node?.stop();
    node?.disconnect();
  });
  [windGain, droneGain].forEach((node) => node?.disconnect());

  wind = null;
  drone = null;
  windGain = null;
  droneGain = null;
}
