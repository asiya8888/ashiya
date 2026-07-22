const notes = [110, 123.47, 92.5, 82.41];

export function startAmbientMelody(context: AudioContext, getVolume: () => number) {
  let step = 0;
  let timer: number | null = null;

  const playNote = () => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    oscillator.frequency.value = notes[step % notes.length];
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.012 * getVolume(), now + 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 2.85);
    step += 1;
    timer = window.setTimeout(playNote, 4800 + Math.random() * 3200);
  };

  timer = window.setTimeout(playNote, 2200);
  return () => {
    if (timer) window.clearTimeout(timer);
  };
}
