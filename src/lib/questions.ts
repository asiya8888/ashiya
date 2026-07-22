export type QuestionKey = 'name' | 'age' | 'origin' | 'event' | 'outside' | 'alone' | 'feeling' | 'mimics' | 'hiding' | 'stay';

export const questions: Array<{ key: QuestionKey; text: string }> = [
  { key: 'name', text: "What's your name?" },
  { key: 'age', text: 'How old are you?' },
  { key: 'origin', text: 'Where are you coming from?' },
  { key: 'event', text: 'What happened to you?' },
  { key: 'outside', text: "What's outside?" },
  { key: 'alone', text: 'Are you alone?' },
  { key: 'feeling', text: 'How are you feeling?' },
  { key: 'mimics', text: 'Have you seen Mimics before?' },
  { key: 'hiding', text: 'Are you hiding something?' },
  { key: 'stay', text: 'How long will you stay?' },
];

export const questionText = (key: QuestionKey) => questions.find((question) => question.key === key)?.text ?? '';
