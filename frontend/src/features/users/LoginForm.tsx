import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '../../shared/apiClient';
import { useSelectedUser } from './selectedUserContext';
import { login } from './usersApi';
import { homePaths } from './homePaths';

/**
 * Inloggningssidan (TB-33). Ersätter listan där man valde vem man var.
 * När inloggningen lyckas sparas användaren och token, och man skickas
 * vidare beroende på roll (se homePaths).
 */
export function LoginForm() {
  const { user, logIn } = useSelectedUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (response) => logIn(response.user, response.token),
  });

  // Inloggad, antingen sedan förut eller precis nu: skicka vidare till rätt startsida
  if (user !== null) {
    return <Navigate to={homePaths[user.role]} replace />;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  const isEmpty = email.trim() === '' || password === '';

  return (
    <section className="card">
      <h2 className="section-title">Logga in</h2>
      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <label className="form-field">
          E-post
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="form-field">
          Lösenord
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="btn-row">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isEmpty || mutation.isPending}
          >
            {mutation.isPending ? 'Loggar in …' : 'Logga in'}
          </button>
        </div>
      </form>
      {mutation.isError && (
        <p className="error" role="alert">
          {errorMessage(mutation.error)}
        </p>
      )}
    </section>
  );
}

// Vite svarar 502 när backend inte är startad.
const NOT_REACHABLE = 'Kunde inte nå backend. Är den startad på port 8080?';

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const body = error.body as { error?: string } | null;
    // 401: fel e-post eller lösenord. 503: databasen svarar inte.
    if ((error.status === 401 || error.status === 503) && body?.error) {
      return body.error;
    }
    if (error.status === 400) {
      return 'Fyll i både e-post och lösenord.';
    }
    if (error.status === 502 || error.status === 504) {
      return NOT_REACHABLE;
    }
    return `Backend svarade med fel (${error.status}).`;
  }
  return NOT_REACHABLE;
}
