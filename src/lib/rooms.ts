export type RoomId = 'living' | 'kitchen' | 'bedroom';

export const roomOrder: RoomId[] = ['kitchen', 'living', 'bedroom'];

export function nextRoom(current: RoomId, direction: 'left' | 'right') {
  const currentIndex = roomOrder.indexOf(current);
  const nextIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
  return roomOrder[nextIndex];
}
