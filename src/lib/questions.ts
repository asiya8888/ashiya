export type QuestionKey = 'name' | 'age' | 'origin' | 'event' | 'outside' | 'alone' | 'cold';

export const questions: Array<{ key: QuestionKey; text: string }> = [
  { key: 'name', text: "What's your name?" },
  { key: 'age', text: 'How old are you?' },
  { key: 'origin', text: 'Where are you coming from?' },
  { key: 'event', text: 'What happened to you?' },
  { key: 'outside', text: "What's outside?" },
  { key: 'alone', text: 'Are you alone?' },
  { key: 'cold', text: 'Are you cold?' },
];

export const questionText = (key: QuestionKey) => questions.find((question) => question.key === key)?.text ?? '';
