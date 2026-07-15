export function snowStyle(index: number, spread = 100) {
  const left = (index * 37 + index * index * 11) % spread;
  const size = 2 + ((index * 13) % 5);
  const drift = -55 + ((index * 19) % 95);
  const spin = 90 + ((index * 31) % 270);

  return {
    '--drift': `${drift}px`,
    '--spin': `${spin}deg`,
    animationDelay: `-${((index * 17) % 90) / 10}s`,
    animationDuration: `${5 + ((index * 7) % 8)}s`,
    height: `${size}px`,
    left: `${left}%`,
    opacity: `${0.35 + (((index * 23) % 60) / 100)}`,
    width: `${size}px`,
  } as React.CSSProperties;
}
