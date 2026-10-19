import { apiGet } from '../../shared/apiClient';

export type HealthResponse = {
  status: 'ok' | 'error';
  database: string;
};

export function getHealth(): Promise<HealthResponse> {
  return apiGet<HealthResponse>('/health');
}
