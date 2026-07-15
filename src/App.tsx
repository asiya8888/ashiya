import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Auth } from './components/Auth';
import { GameScreen } from './components/GameScreen';
import { clearAuthCallbackUrl, readAuthErrorFromUrl } from './lib/auth';
import { snowStyle } from './lib/snow';
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError] = useState(readAuthErrorFromUrl);
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
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const signOut = () => {
    void supabase.auth.signOut();
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

  if (!session) {
    return (
      <main className="login-shell">
        <div className="login-cabin" aria-hidden="true" />
        {loginSnow}
        <section className="login-copy">
          <h1>WHITEOUT</h1>
          <p>Log in to begin the night inspection.</p>
        </section>
        <Auth initialMessage={authError} />
      </main>
    );
  }

  return <GameScreen onSignOut={signOut} />;
}

export default App;
