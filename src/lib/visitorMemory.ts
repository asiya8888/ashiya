import type { VisitorKind } from './visitors';

export type VisitorMemory = {
  choice: 'allow' | 'refuse';
  kind: VisitorKind;
  name: string;
};

export function memoryLine(memory?: VisitorMemory) {
  if (!memory) return '';
  if (memory.choice === 'allow') return `I saw you let ${memory.name} inside.`;
  return `I passed ${memory.name} after you refused them.`;
}
