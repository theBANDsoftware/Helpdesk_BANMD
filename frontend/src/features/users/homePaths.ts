import type { Role } from './usersApi';

/** Vart man skickas efter att ha valt användare, beroende på roll (TB-24). */
export const homePaths: Record<Role, string> = {
  EMPLOYEE: '/tickets/mine',
  IT_ADMIN: '/start',
};
