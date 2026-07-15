export function getOAuthRedirectUrl() {
  return `${window.location.origin}/auth/callback`;
}

export function readAuthErrorFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('error_description') ?? params.get('error') ?? '';
}

export function clearAuthCallbackUrl() {
  if (window.location.pathname === '/auth/callback') {
    window.history.replaceState({}, document.title, '/');
  }
}
