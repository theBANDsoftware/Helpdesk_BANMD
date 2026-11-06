import { NavLink } from 'react-router';
import { useSelectedUser } from './selectedUserContext';
import type { Role } from './usersApi';

type MenuLink = {
  to: string;
  label: string;
  roles: Role[];
};

/**
 * Länkarna i menyn och vilka roller som ser dem.
 * Styr bara vad som visas, det är inget skydd. Riktigt skydd kommer med inloggning
 */
const menuLinks: MenuLink[] = [
  { to: '/tickets/mine', label: 'Mina ärenden', roles: ['EMPLOYEE'] },
  { to: '/tickets', label: 'Alla ärenden', roles: ['IT_ADMIN'] },
  { to: '/tickets/new', label: 'Anmäl ett fel', roles: ['EMPLOYEE', 'IT_ADMIN'] },
  { to: '/tickets/assigned', label: 'Mina tilldelade ärenden', roles: ['IT_ADMIN'] },
];

/** Menyn i sidhuvudet. Visas bara när någon är vald, och visar bara länkarna för användarens roll. */
export function NavMenu() {
  const { user } = useSelectedUser();

  if (user === null) {
    return null;
  }

  const visibleLinks = menuLinks.filter((link) => link.roles.includes(user.role));

  return (
    <nav className="nav-menu" aria-label="Huvudmeny">
      {visibleLinks.map((link) => (
        <NavLink key={link.to} to={link.to} end>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
