import { useEffect, useState } from 'react';
import { ApiError } from '../../shared/apiClient';
import { getHealth, type HealthResponse } from './healthApi';

type State =
  { kind: 'loading' } | { kind: 'ok'; health: HealthResponse } | { kind: 'error'; message: string };

/** Visar om frontend når backend och om backend når databasen. */
export function HealthStatus() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    getHealth()
      .then((health) => setState({ kind: 'ok', health }))
      .catch((error: unknown) => setState({ kind: 'error', message: errorMessage(error) }));
  }, []);

  return (
    <section className="card">
      <h2>Systemstatus</h2>
      {state.kind === 'loading' && <p>Kontrollerar …</p>}
      {state.kind === 'ok' && (
        <ul className="status-list">
          <li className="ok">Frontend når backend</li>
          <li className="ok">Backend når databasen: {state.health.database}</li>
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
    const body = error.body as Partial<HealthResponse> | null;
    if (error.status === 503 && body?.database) {
      return `Backend svarar, men når inte databasen: ${body.database}`;
    }
    if (error.status === 502 || error.status === 504) {
      return NOT_REACHABLE;
    }
    return `Backend svarade med fel (${error.status}).`;
  }
  return NOT_REACHABLE;
}
