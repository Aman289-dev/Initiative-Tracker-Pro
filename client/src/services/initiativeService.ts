import apiClient from './apiClient';
import type { ApiResponse, Initiative, InitiativeFormData, InitiativeFilters } from '@/types';

export async function fetchInitiativesRequest(
  filters?: InitiativeFilters
): Promise<ApiResponse<Initiative[]>> {
  const params = new URLSearchParams();

  if (filters?.status) params.append('status', filters.status);
  if (filters?.owner) params.append('owner', filters.owner);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);

  const queryString = params.toString();
  const url = queryString ? `/initiatives?${queryString}` : '/initiatives';

  const response = await apiClient.get<ApiResponse<Initiative[]>>(url);
  return response.data;
}

export async function createInitiativeRequest(
  data: InitiativeFormData
): Promise<ApiResponse<Initiative>> {
  const response = await apiClient.post<ApiResponse<Initiative>>('/initiatives', data);
  return response.data;
}

export async function updateInitiativeRequest(
  id: string,
  data: Partial<InitiativeFormData>
): Promise<ApiResponse<Initiative>> {
  const response = await apiClient.put<ApiResponse<Initiative>>(`/initiatives/${id}`, data);
  return response.data;
}

export async function deleteInitiativeRequest(id: string): Promise<ApiResponse<void>> {
  const response = await apiClient.delete<ApiResponse<void>>(`/initiatives/${id}`);
  return response.data;
}
