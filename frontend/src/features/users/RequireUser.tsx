import { Navigate, Outlet } from 'react-router';
import { useSelectedUser } from './selectedUserContext';

/**
 * Skyddar alla sidor utom användarlistan. Är ingen användare vald skickas man
 * till listan, även om man skrev in adressen direkt (AK 5).
 */
export function RequireUser() {
  const { user } = useSelectedUser();
  if (user === null) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
