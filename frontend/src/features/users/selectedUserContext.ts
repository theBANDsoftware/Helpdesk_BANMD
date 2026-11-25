import { createContext, useContext } from 'react';
import type { User } from './usersApi';

/** Det som alla komponenter kan läsa och göra med den inloggade användaren (TB-33). */
export type SelectedUserContextValue = {
  user: User | null;
  logIn: (user: User, token: string) => void;
  logOut: () => void;
};

export const SelectedUserContext = createContext<SelectedUserContextValue | null>(null);

/** Hämtar den inloggade användaren. Fungerar bara inuti <SelectedUserProvider>. */
export function useSelectedUser(): SelectedUserContextValue {
  const context = useContext(SelectedUserContext);
  if (context === null) {
    throw new Error('useSelectedUser måste användas inuti <SelectedUserProvider>');
  }
  return context;
}
