import type { RoomId } from '../lib/rooms';

type DoorPromptProps = {
  currentRoom: RoomId;
  onLook: () => void;
};

export function DoorPrompt({ currentRoom, onLook }: DoorPromptProps) {
  const atDoor = currentRoom === 'living';

  return (
    <section className="door-prompt">
      <p className="label">A knock at the door</p>
      <h2>Someone is outside.</h2>
      <p>{atDoor ? 'The peephole waits in the dark.' : 'The sound comes from the living room.'}</p>
      <div className="choices door-choices">
        {atDoor && <button onClick={onLook} type="button">Look Through Peephole</button>}
      </div>
    </section>
  );
}
