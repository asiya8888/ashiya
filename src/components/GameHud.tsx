type GameHudProps = {
  lives: number;
  supplies: number;
  diaryCount: number;
  score: number;
  night: number;
  visitorNumber: number;
  totalVisitors: number;
  onRestart: () => void;
  onSignOut: () => void;
};

export function GameHud({ diaryCount, lives, score, night, supplies, visitorNumber, totalVisitors, onRestart, onSignOut }: GameHudProps) {
  const progress = Math.round(((visitorNumber - 1) / totalVisitors) * 100);

  return (
    <header className="hud">
      <div>
        <p className="label">WHITEOUT</p>
        <h1>Night Watch</h1>
      </div>
      <div className="stats">
        <span>Lives {lives}/3</span>
        <span>Supplies {supplies}</span>
        <span>Diary {diaryCount}</span>
        <span>Score {score}</span>
        <span>Night {night}</span>
        <span>Progress {progress}%</span>
        <span>Visitor {visitorNumber}/{totalVisitors}</span>
        <button onClick={onRestart}>Restart</button>
        <button onClick={onSignOut}>Log Out</button>
      </div>
    </header>
  );
}
