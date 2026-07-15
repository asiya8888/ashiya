import { useState } from 'react';
import { getOAuthRedirectUrl } from '../lib/auth';
import { supabase } from '../lib/supabase';

type AuthProps = {
  initialMessage?: string;
};

export function Auth({ initialMessage = '' }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [message, setMessage] = useState(initialMessage);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const fn =
        mode === 'signup'
          ? supabase.auth.signUp({ email, password })
          : supabase.auth.signInWithPassword({ email, password });
      const { error } = await fn;
      if (error) setMessage(error.message);
      else if (mode === 'signup') setMessage('Account created. Check your email if confirmation is enabled.');
    } catch {
      setMessage('Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    setBusy(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getOAuthRedirectUrl() },
    });
    if (error) {
      setMessage(error.message);
      setBusy(false);
    }
  }

  return (
    <section className="auth-card">
      <p className="label">Access required</p>
      <h2>{mode === 'signin' ? 'Log In' : 'Create Account'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password (6+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button type="submit" disabled={busy}>
          {busy ? '...' : mode === 'signin' ? 'Enter Cabin' : 'Create Account'}
        </button>
      </form>
      <div className="auth-divider">or</div>
      <button className="google-button" disabled={busy} onClick={signInWithGoogle}>
        Continue with Google
      </button>
      {message && <p className="message">{message}</p>}
      <button
        className="ghost"
        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
      >
        {mode === 'signin' ? 'Need an account?' : 'Already have an account?'}
      </button>
    </section>
  );
}
