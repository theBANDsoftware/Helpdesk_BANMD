import { Navigate, Outlet } from 'react-router';
import { useSelectedUser } from './selectedUserContext';

/**
 * Skyddar alla sidor utom inloggningen. Är ingen inloggad skickas man till
 * inloggningen, även om man skrev in adressen direkt (TB-33).
 */
export function RequireUser() {
  const { user } = useSelectedUser();
  if (user === null) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
