import { apiRequest } from '../../shared/apiClient';

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

/** Det backend svarar när inloggningen lyckas (TB-33). */
export type LoginResponse = {
  token: string;
  user: User;
};

/** Loggar in med e-post och lösenord. Backend svarar 401 vid fel uppgifter (TB-33). */
export function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', 'POST', { email, password });
}

export function getUsers(): Promise<User[]> {
  return apiRequest<User[]>('/users');
}
