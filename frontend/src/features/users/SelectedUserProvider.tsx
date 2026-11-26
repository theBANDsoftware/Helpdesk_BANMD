import { useState, type ReactNode } from 'react';
import {
  clearLogin,
  readSelectedUser,
  readToken,
  saveLogin,
} from '../../shared/selectedUserStorage';
import { SelectedUserContext } from './selectedUserContext';
import { roleLabels, type User } from './usersApi';

/**
 * Håller reda på vem som är inloggad (TB-33). Användaren och token läses från
 * localStorage när appen startar, så att man är inloggad även efter omladdning.
 * Saknas token räknas man som utloggad, även om en användare finns sparad.
 */
export function SelectedUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    readToken() === null ? null : toUser(readSelectedUser()),
  );

  function logIn(loggedIn: User, token: string) {
    saveLogin(loggedIn, token);
    setUser(loggedIn);
  }

  function logOut() {
    clearLogin();
    setUser(null);
  }

  return (
    <SelectedUserContext.Provider value={{ user, logIn, logOut }}>
      {children}
    </SelectedUserContext.Provider>
  );
}

/** Det som ligger i localStorage kan vara gammalt eller ändrat för hand. Godta bara en hel användare. */
function toUser(value: unknown): User | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const { id, name, role } = value as Record<string, unknown>;
  if (
    typeof id === 'number' &&
    typeof name === 'string' &&
    typeof role === 'string' &&
    role in roleLabels
  ) {
    return { id, name, role: role as User['role'] };
  }
  return null;
}
