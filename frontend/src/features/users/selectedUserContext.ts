import { createContext, useContext } from 'react';
import type { User } from './usersApi';

/** Det som alla komponenter kan läsa och göra med den valda användaren. */
export type SelectedUserContextValue = {
  user: User | null;
  selectUser: (user: User) => void;
  clearUser: () => void;
};

export const SelectedUserContext = createContext<SelectedUserContextValue | null>(null);

/** Hämtar den valda användaren. Fungerar bara inuti <SelectedUserProvider>. */
export function useSelectedUser(): SelectedUserContextValue {
  const context = useContext(SelectedUserContext);
  if (context === null) {
    throw new Error('useSelectedUser måste användas inuti <SelectedUserProvider>');
  }
  return context;
}
