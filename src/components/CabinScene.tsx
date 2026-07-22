import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { type RoomId } from '../lib/rooms';
import { BedroomScene } from './rooms/BedroomScene';
import { KitchenScene } from './rooms/KitchenScene';
import { LivingRoomScene } from './rooms/LivingRoomScene';

type CabinSceneProps = {
  canMove: boolean;
  guestNames: string[];
  hasKnock: boolean;
  onLookThroughDoor: () => void;
  onPlayerPositionChange: (position: number) => void;
  playerPosition: number;
  room: RoomId;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function CabinScene({ canMove, guestNames, hasKnock, onLookThroughDoor, onPlayerPositionChange, playerPosition, room }: CabinSceneProps) {
  const [depth, setDepth] = useState(0.45);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const camera = clamp(playerPosition - 0.5, 0, 2);

  const movePlayer = useCallback((xChange: number, yChange: number) => {
    if (!canMove) return;
    onPlayerPositionChange(clamp(playerPosition + xChange, 0.14, 2.86));
    setDepth((current) => clamp(current + yChange, 0, 1));
  }, [canMove, onPlayerPositionChange, playerPosition]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!['a', 'd', 'w', 's', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(key)) return;
      event.preventDefault();
      if (key === 'a' || key === 'arrowleft') movePlayer(-0.06, 0);
      if (key === 'd' || key === 'arrowright') movePlayer(0.06, 0);
      if (key === 'w' || key === 'arrowup') movePlayer(0, 0.08);
      if (key === 's' || key === 'arrowdown') movePlayer(0, -0.08);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [movePlayer]);

  const startTouch = (event: PointerEvent<HTMLDivElement>) => {
    touchStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const dragTouch = (event: PointerEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const xChange = (event.clientX - touchStart.current.x) * 0.004;
    const yChange = (touchStart.current.y - event.clientY) * 0.004;
    touchStart.current = { x: event.clientX, y: event.clientY };
    movePlayer(xChange, yChange);
  };

  return (
    <section className={`cabin cabin--${room}`} aria-label={`Cabin ${room}`}>
      <div className="wall-planks" aria-hidden="true" />
      <div className="cabin-world" style={{ '--camera': camera, '--player-x': playerPosition, '--player-depth': depth } as CSSProperties}>
        <div className="cabin-room"><KitchenScene /></div>
        <div className="cabin-room"><LivingRoomScene guestNames={guestNames} hasKnock={hasKnock} onLookThroughDoor={onLookThroughDoor} /></div>
        <div className="cabin-room"><BedroomScene /></div>
      </div>
      <div className="touch-move-pad" onPointerDown={startTouch} onPointerMove={dragTouch} onPointerUp={() => { touchStart.current = null; }}>
        <span />
      </div>
      <div className="ash-specks" aria-hidden="true">
        {Array.from({ length: 36 }, (_, index) => (
          <span
            key={index}
            style={{
              animationDelay: `${(index % 9) * 0.4}s`,
              left: `${(index * 37) % 100}%`,
              top: `${(index * 29) % 100}%`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
