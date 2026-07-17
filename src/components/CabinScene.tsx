import type { RoomId } from '../lib/rooms';
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
  return (
    <section className={`cabin cabin--${room}`} aria-label={`Cabin ${room}`}>
      <div className="wall-planks" aria-hidden="true" />
      {room === 'living' && (
        <LivingRoomScene
          canMove={canMove}
          hasKnock={hasKnock}
          onLookThroughDoor={onLookThroughDoor}
          onMove={onMove}
        />
      )}
      {room === 'kitchen' && <KitchenScene canMove={canMove} onMove={onMove} />}
      {room === 'bedroom' && <BedroomScene canMove={canMove} onMove={onMove} />}
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
