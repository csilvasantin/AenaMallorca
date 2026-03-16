import { useState, useCallback } from 'react';

// SHA-256 hash of the password — change by running:
// echo -n "yourpassword" | shasum -a 256
const PASSWORD_HASH = 'e6f45147f091328d3300df63f8fdc719982a56e74bd8d8f7dfa088cc8ce0eb60';

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const SESSION_KEY = 'aena_auth';

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(false);
    const hash = await sha256(input.trim());
    if (hash === PASSWORD_HASH) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthenticated(true);
    } else {
      setError(true);
      setInput('');
    }
    setChecking(false);
  }, [input]);

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="password-gate">
      <div className="password-box">
        {/* Pixel art lock icon */}
        <div className="lock-icon">
          <div className="lock-grid">
            {[
              0,0,1,1,1,0,0,
              0,1,0,0,0,1,0,
              0,1,0,0,0,1,0,
              1,1,1,1,1,1,1,
              1,1,1,1,1,1,1,
              1,1,1,2,1,1,1,
              1,1,1,2,1,1,1,
              1,1,1,1,1,1,1,
              1,1,1,1,1,1,1,
            ].map((v, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  background: v === 2 ? '#ff8906' : v === 1 ? '#a7a9be' : 'transparent',
                }}
              />
            ))}
          </div>
        </div>

        <h2 className="password-title">Acceso Restringido</h2>
        <p className="password-subtitle">Introduce la clave para continuar</p>

        <form onSubmit={handleSubmit} className="password-form">
          <input
            type="password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            className={`password-input ${error ? 'password-error' : ''}`}
            placeholder="********"
            autoFocus
            disabled={checking}
          />
          <button type="submit" className="password-btn" disabled={checking || !input.trim()}>
            {checking ? '...' : 'Entrar'}
          </button>
        </form>

        {error && (
          <p className="password-error-msg">
            ✖ Clave incorrecta
          </p>
        )}

        <div className="password-footer">
          <span>aena</span> × <span>admira</span>
        </div>
      </div>
    </div>
  );
}
