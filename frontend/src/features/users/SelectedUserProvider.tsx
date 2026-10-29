import { useState, type ReactNode } from 'react';
import { readSelectedUser, writeSelectedUser } from '../../shared/selectedUserStorage';
import { SelectedUserContext } from './selectedUserContext';
import { roleLabels, type User } from './usersApi';

/**
 * Håller reda på vem som är vald. Valet läses från localStorage när appen
 * startar och sparas där igen varje gång det ändras (AK 3).
 */
export function SelectedUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => toUser(readSelectedUser()));

  function selectUser(selected: User) {
    writeSelectedUser(selected);
    setUser(selected);
  }

  function clearUser() {
    writeSelectedUser(null);
    setUser(null);
  }

  return (
    <SelectedUserContext.Provider value={{ user, selectUser, clearUser }}>
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
