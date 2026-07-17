import type { GameSettings, TextSpeed } from '../lib/settings';

type SettingsPanelProps = {
  completed: boolean;
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
};

const speeds: TextSpeed[] = ['Slow', 'Normal', 'Fast'];

export function SettingsPanel({ completed, settings, onChange }: SettingsPanelProps) {
  const update = (next: Partial<GameSettings>) => onChange({ ...settings, ...next });

  return (
    <aside className="menu-panel settings-panel">
      <p className="label">Settings</p>
      <label>
        Music Volume
        <input
          max="100"
          min="0"
          onChange={(event) => update({ musicVolume: Number(event.target.value) })}
          type="range"
          value={settings.musicVolume}
        />
      </label>
      <button onClick={() => update({ typewriter: !settings.typewriter })}>
        Typewriter Effect: {settings.typewriter ? 'ON' : 'OFF'}
      </button>
      <div className="settings-row">
        <span>Text Speed</span>
        {speeds.map((speed) => (
          <button className={settings.textSpeed === speed ? 'is-selected' : ''} key={speed} onClick={() => update({ textSpeed: speed })}>
            {speed}
          </button>
        ))}
      </div>
      <button onClick={() => update({ screenShake: !settings.screenShake })}>
        Screen Shake: {settings.screenShake ? 'ON' : 'OFF'}
      </button>
      <button disabled={!completed} onClick={() => update({ skipIntro: !settings.skipIntro })}>
        Skip Introduction: {completed ? (settings.skipIntro ? 'ON' : 'OFF') : 'Locked'}
      </button>
      {!completed && <p>Unlocked after first completion.</p>}
    </aside>
  );
}
