import { useEffect, useState } from 'react';
import { ApiError } from '../../shared/apiClient';
import { getUsers, roleLabels, type User } from './usersApi';

type State =
  { kind: 'loading' } | { kind: 'ok'; users: User[] } | { kind: 'error'; message: string };

/**
 * Listan med användare från databasen. Första delen av storyn "Välja vem man är":
 * än så länge visas bara listan, att välja en användare kommer i nästa steg.
 */
export function UserList() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    getUsers()
      .then((users) => setState({ kind: 'ok', users }))
      .catch((error: unknown) => setState({ kind: 'error', message: errorMessage(error) }));
  }, []);

  return (
    <section className="card">
      <h2>Vem är du?</h2>
      {state.kind === 'loading' && <p>Hämtar användare …</p>}
      {state.kind === 'ok' && state.users.length === 0 && (
        <p>Det finns inga användare i databasen. Har testdatan lagts in?</p>
      )}
      {state.kind === 'ok' && state.users.length > 0 && (
        <ul className="user-list">
          {state.users.map((user) => (
            <li key={user.id}>
              <span className="user-name">{user.name}</span>
              <span className="user-role">{roleLabels[user.role]}</span>
            </li>
          ))}
        </ul>
      )}
      {state.kind === 'error' && <p className="error">{state.message}</p>}
    </section>
  );
}

// Vite svarar 502 när backend inte är startad.
const NOT_REACHABLE = 'Kunde inte nå backend. Är den startad på port 8080?';

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const body = error.body as { error?: string } | null;
    if (error.status === 503 && body?.error) {
      return body.error;
    }
    if (error.status === 502 || error.status === 504) {
      return NOT_REACHABLE;
    }
    return `Backend svarade med fel (${error.status}).`;
  }
  return NOT_REACHABLE;
}
