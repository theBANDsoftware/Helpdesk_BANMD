import { apiGet } from '../../shared/apiClient';

export type Role = 'EMPLOYEE' | 'IT_ADMIN';

export type User = {
  id: number;
  name: string;
  role: Role;
};

export const roleLabels: Record<Role, string> = {
  EMPLOYEE: 'Anställd',
  IT_ADMIN: 'IT-ansvarig',
};

export function getUsers(): Promise<User[]> {
  return apiGet<User[]>('/users');
}
