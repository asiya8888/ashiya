import type { VisitorKind } from './visitors';

export type VisitorMemory = {
  choice: 'allow' | 'refuse';
  kind: VisitorKind;
  name: string;
};

export function memoryLine(memory?: VisitorMemory) {
  if (!memory) return '';
  if (memory.choice === 'allow') return "I didn't expect to find this cabin again after that night.";
  return "It's me again. You left me outside before, but I kept walking.";
}
