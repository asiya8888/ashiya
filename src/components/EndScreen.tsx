import type { ReactNode } from 'react';

type EndScreenProps = {
  label?: string;
  title: string;
  text: string;
  actionLabel?: string;
  danger?: boolean;
  menu?: boolean;
  children?: ReactNode;
  onRestart: () => void;
};

export function EndScreen({
  label,
  title,
  text,
  actionLabel = 'Restart',
  danger = false,
  menu = false,
  children,
  onRestart,
}: EndScreenProps) {
  return (
    <div className={`end-screen ${danger ? 'end-screen--danger' : ''} ${menu ? 'end-screen--menu' : ''}`}>
      <div>
        <p className="label">{label ?? (danger ? 'The door was a mistake' : 'Sunrise')}</p>
        <h2>{title}</h2>
        <p>{text}</p>
        {children}
        <button onClick={onRestart}>{actionLabel}</button>
      </div>
    </div>
  );
}
