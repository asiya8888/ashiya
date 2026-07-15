export function noiseBurst(context: AudioContext, start: number, length: number, volume: number) {
  const buffer = context.createBuffer(1, context.sampleRate * length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
  }

  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(0.001, context.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + start + length);
  source.connect(gain);
  gain.connect(context.destination);
  source.start(context.currentTime + start);
}
