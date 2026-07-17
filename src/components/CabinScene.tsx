import type { CSSProperties } from 'react';
import { nextRoom, roomOrder, type RoomId } from '../lib/rooms';
import { BedroomScene } from './rooms/BedroomScene';
import { KitchenScene } from './rooms/KitchenScene';
import { LivingRoomScene } from './rooms/LivingRoomScene';

type CabinSceneProps = {
  canMove: boolean;
  hasKnock: boolean;
  onLookThroughDoor: () => void;
  onMove: (room: RoomId) => void;
  room: RoomId;
};

export function CabinScene({ canMove, hasKnock, onLookThroughDoor, onMove, room }: CabinSceneProps) {
  const walk = (direction: 'left' | 'right') => {
    const destination = nextRoom(room, direction);
    if (destination) onMove(destination);
  };

  return (
    <section className={`cabin cabin--${room}`} aria-label={`Cabin ${room}`}>
      <div className="wall-planks" aria-hidden="true" />
      <div className="cabin-world" style={{ '--room-index': roomOrder.indexOf(room) } as CSSProperties}>
        <div className="cabin-room"><KitchenScene /></div>
        <div className="cabin-room"><LivingRoomScene hasKnock={hasKnock} onLookThroughDoor={onLookThroughDoor} /></div>
        <div className="cabin-room"><BedroomScene /></div>
      </div>
      <div className="walk-controls" aria-label="Walk through the cabin">
        <button disabled={!canMove || !nextRoom(room, 'left')} onClick={() => walk('left')} type="button">Walk Left</button>
        <button disabled={!canMove || !nextRoom(room, 'right')} onClick={() => walk('right')} type="button">Walk Right</button>
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
