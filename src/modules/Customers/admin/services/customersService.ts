/**
 * Customers Service
 * Handles API calls for customer management
 */

import { apiClient } from '@/src/shared/lib/api-client';
import type {
  CustomerListResponse,
  CustomerDetailResponse,
  CustomerStatsResponse,
  CustomerFilters,
} from '../../types';

const CUSTOMERS_BASE_URL = '/admin/customers';

export const customersService = {
  /**
   * Get paginated list of customers
   */
  async getCustomers(filters?: CustomerFilters): Promise<CustomerListResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const url = `${CUSTOMERS_BASE_URL}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<CustomerListResponse>(url);

    console.log('🔍 Service - Raw axios response:', response);
    console.log('🔍 Service - response.data:', response.data);

    return response.data;
  },

  /**
   * Get customer by ID
   */
  async getCustomer(id: number): Promise<CustomerDetailResponse> {
    return apiClient.get<CustomerDetailResponse>(`${CUSTOMERS_BASE_URL}/${id}`);
  },

  /**
   * Get customer statistics
   */
  async getStats(): Promise<CustomerStatsResponse> {
    return apiClient.get<CustomerStatsResponse>(`${CUSTOMERS_BASE_URL}/stats`);
  },

  /**
   * Create a new customer
   */
  async createCustomer(data: any): Promise<CustomerDetailResponse> {
    return apiClient.post<CustomerDetailResponse>(CUSTOMERS_BASE_URL, data);
  },

  /**
   * Update a customer
   */
  async updateCustomer(id: number, data: any): Promise<CustomerDetailResponse> {
    return apiClient.put<CustomerDetailResponse>(`${CUSTOMERS_BASE_URL}/${id}`, data);
  },

  /**
   * Delete a customer (soft delete)
   */
  async deleteCustomer(id: number): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`${CUSTOMERS_BASE_URL}/${id}`);
  },
};
