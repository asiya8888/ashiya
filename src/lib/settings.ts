export type TextSpeed = 'Slow' | 'Normal' | 'Fast';

export type GameSettings = {
  musicVolume: number;
  screenShake: boolean;
  skipIntro: boolean;
  textSpeed: TextSpeed;
  typewriter: boolean;
};

export const defaultSettings: GameSettings = {
  musicVolume: 70,
  screenShake: true,
  skipIntro: false,
  textSpeed: 'Normal',
  typewriter: true,
};

export const readSettings = () => {
  const saved = localStorage.getItem('whiteout-settings');
  return saved ? { ...defaultSettings, ...JSON.parse(saved) } as GameSettings : defaultSettings;
};

export const saveSettings = (settings: GameSettings) => {
  localStorage.setItem('whiteout-settings', JSON.stringify(settings));
};

export const hasCompletedGame = () => localStorage.getItem('whiteout-completed') === 'yes';

export const markGameCompleted = () => {
  localStorage.setItem('whiteout-completed', 'yes');
};
