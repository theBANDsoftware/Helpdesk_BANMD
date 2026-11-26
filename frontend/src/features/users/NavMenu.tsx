import { NavLink } from 'react-router';
import { useSelectedUser } from './selectedUserContext';
import type { Role } from './usersApi';
import NotificationCount from '../notifications/NotificationCount';

type MenuLink = {
  to: string;
  label: string;
  shortLabel: string;
  icon: string;
  roles: Role[];
};

/**
 * Länkarna i menyn och vilka roller som ser dem.
 * Styr bara vad som visas, det är inget skydd. Riktigt skydd kommer med inloggning
 */
const menuLinks: MenuLink[] = [
  {
    to: '/tickets/mine',
    label: 'Ärenden',
    shortLabel: 'Mina',
    icon: '⌂',
    roles: ['EMPLOYEE'],
  },
  { to: '/tickets', label: 'Alla ärenden', shortLabel: 'Ärenden', icon: '⌂', roles: ['IT_ADMIN'] },
  {
    to: '/tickets/new',
    label: 'Anmäl ett fel',
    shortLabel: 'Anmäl fel',
    icon: '⊕',
    roles: ['EMPLOYEE', 'IT_ADMIN'],
  },
  {
    to: '/tickets/statistics',
    label: 'Statistik',
    shortLabel: 'Statistik',
    icon: '▤',
    roles: ['IT_ADMIN'],
  },
	{
		to: '/notifications',
		label: 'Notiser',
		shortLabel: 'Notiser',
		icon: '◉',
		roles: ['EMPLOYEE', 'IT_ADMIN'],
	},
  {
    to: '/faq',
    label: 'FAQ',
    shortLabel: 'FAQ',
    icon: '?',
    roles: ['EMPLOYEE', 'IT_ADMIN'],
  },
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
			<NavLink key={link.to} to={link.to} end className="nav-link">
				<span className="nav-icon" aria-hidden="true">
					{link.icon}
				</span>
				<span className="nav-label-mobile">{link.shortLabel}</span>
				<span className="nav-label-desktop">{link.label}</span>
				{/* Antalet olästa ligger som en bubbla över notislänken */}
				{link.to === '/notifications' && <NotificationCount />}
			</NavLink>
		))}
    </nav>
  );
}
