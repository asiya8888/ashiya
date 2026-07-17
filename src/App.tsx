import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Auth, type AuthMode } from './components/Auth';
import { DiaryFragment } from './components/DiaryFragment';
import { GameScreen } from './components/GameScreen';
import { SettingsPanel } from './components/SettingsPanel';
import { clearAuthCallbackUrl, readAuthErrorFromUrl } from './lib/auth';
import { hasCompletedGame, readSettings, saveSettings, type GameSettings } from './lib/settings';
import { snowStyle } from './lib/snow';
import { setMasterVolume, startAmbience } from './lib/sounds';
import { supabase } from './lib/supabase';

type MenuPanel = 'auth' | 'diary' | 'settings' | null;

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError] = useState(readAuthErrorFromUrl);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [menuPanel, setMenuPanel] = useState<MenuPanel>(authError ? 'auth' : null);
  const [completed, setCompleted] = useState(hasCompletedGame);
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = readSettings();
    return hasCompletedGame() ? saved : { ...saved, skipIntro: false };
  });
  const [showGame, setShowGame] = useState(false);
  const loginSnow = Array.from({ length: 56 }, (_, index) => (
    <span className="login-snow" key={index} style={snowStyle(index)} />
  ));

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) clearAuthCallbackUrl();
      setAuthLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) clearAuthCallbackUrl();
      else setShowGame(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    saveSettings(settings);
    setMasterVolume(settings.musicVolume / 100);
  }, [settings]);

  const signOut = () => {
    setShowGame(false);
    void supabase.auth.signOut();
  };

  const updateSettings = (next: GameSettings) => {
    setSettings(completed ? next : { ...next, skipIntro: false });
  };

  const beginNight = () => {
    if (session) {
      setShowGame(true);
      return;
    }
    openAuth('signin');
  };

  const openAuth = (mode: AuthMode) => {
    startAmbience();
    setAuthMode(mode);
    setMenuPanel('auth');
  };

  const openPanel = (panel: Exclude<MenuPanel, 'auth' | null>) => {
    startAmbience();
    setMenuPanel(panel);
  };

  if (authLoading) {
    return (
      <main className="login-shell">
        <div className="login-cabin" aria-hidden="true" />
        {loginSnow}
        <p className="loading-text">Checking the locks...</p>
      </main>
    );
  }

  if (!session || !showGame) {
    return (
      <main className="login-shell">
        <div className="login-cabin" aria-hidden="true">
          <span className="login-window" />
          <span className="login-smoke login-smoke-one" />
          <span className="login-smoke login-smoke-two" />
        </div>
        {loginSnow}
        <section className="login-copy" aria-label="Whiteout title menu">
          <div>
            <h1>WHITEOUT</h1>
            <p>A quiet cabin, a long storm, and a door you may regret opening.</p>
          </div>
          <nav className="title-menu" aria-label="Main menu">
            <button onClick={beginNight}>Begin Night</button>
            <button onClick={() => openPanel('diary')}>The Diary</button>
            <button onClick={() => openPanel('settings')}>Settings</button>
            {session ? (
              <button onClick={signOut}>Log Out</button>
            ) : (
              <>
                <button onClick={() => openAuth('signin')}>Log In</button>
                <button onClick={() => openAuth('signup')}>Don't have an account? Sign Up</button>
              </>
            )}
            <button onClick={() => setMenuPanel(null)}>Exit</button>
          </nav>
        </section>
        {!session && menuPanel === 'auth' && (
          <Auth
            initialMessage={authError}
            initialMode={authMode}
            onModeChange={setAuthMode}
          />
        )}
        {menuPanel === 'diary' && (
          <aside className="menu-panel">
            <p className="label">Found under the snow</p>
            <DiaryFragment />
          </aside>
        )}
        {menuPanel === 'settings' && (
          <SettingsPanel completed={completed} onChange={updateSettings} settings={settings} />
        )}
      </main>
    );
  }

  return (
    <GameScreen
      autoStart
      onComplete={() => setCompleted(true)}
      onSignOut={signOut}
      settings={settings}
    />
  );
}

export default App;
