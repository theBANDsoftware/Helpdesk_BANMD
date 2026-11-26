import { useEffect, useState, type ReactNode } from 'react';
import {
  SELECTED_USER_REMOVED_EVENT,
  readSelectedUser,
  writeSelectedUser,
} from '../../shared/selectedUserStorage';
import { SelectedUserContext } from './selectedUserContext';
import { roleLabels, type User } from './usersApi';

/**
 * Håller reda på vem som är vald. Valet läses från localStorage när appen
 * startar och sparas där igen varje gång det ändras (AK 3).
 */
export function SelectedUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => toUser(readSelectedUser()));
  const [userWasRemoved, setUserWasRemoved] = useState(false);

  /*
   * Svarade backend 404 för användaren har apiClient redan tömt localStorage och
   * skickat eventet. Här nollas state också, och då skickar RequireUser vidare
   * till listan "Vem är du?" i stället för att sidan visar ett felmeddelande (TB-60).
   */
  useEffect(() => {
    function handleUserRemoved() {
      setUser(null);
      setUserWasRemoved(true);
    }

    window.addEventListener(SELECTED_USER_REMOVED_EVENT, handleUserRemoved);
    return () => window.removeEventListener(SELECTED_USER_REMOVED_EVENT, handleUserRemoved);
  }, []);

  function selectUser(selected: User) {
    writeSelectedUser(selected);
    setUser(selected);
    setUserWasRemoved(false);
  }

  function clearUser() {
    writeSelectedUser(null);
    setUser(null);
    setUserWasRemoved(false);
  }

  return (
    <SelectedUserContext.Provider value={{ user, selectUser, clearUser, userWasRemoved }}>
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
