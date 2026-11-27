import type { Role } from './usersApi';

/** Vart man skickas efter inloggningen, beroende på roll (TB-24, TB-25, TB-33). */
export const homePaths: Record<Role, string> = {
  EMPLOYEE: '/tickets/mine',
  IT_ADMIN: '/tickets',
};
