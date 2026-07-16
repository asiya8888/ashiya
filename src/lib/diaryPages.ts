const diaryPages = [
  'PAGE #12: "They never seem afraid of the cold."',
  'PAGE #19: "Perhaps I was wrong. Fear looks different on everyone."',
  'PAGE #27: "Do not trust their smiles. Do not trust the absence of one either."',
  'PAGE #35: "Sometimes I think I stopped understanding what is human a long time ago."',
  'PAGE #41: "A good answer can still be practiced. A strange answer can still be fear."',
  'PAGE #48: "The worst mistake is believing you have enough proof."',
];

export function unlockDiaryPage(unlockedCount: number) {
  return diaryPages[unlockedCount % diaryPages.length];
}
