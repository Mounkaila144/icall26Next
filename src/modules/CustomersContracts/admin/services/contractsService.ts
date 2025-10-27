// ============================================================================
// CustomersContracts Module - Service Layer
// ============================================================================
// This service handles all API communication for the CustomersContracts module
// following the repository pattern from the Laravel backend.
// ============================================================================

import { apiClient } from '@/src/shared/lib/api-client';
import type {
  CustomerContract,
  ContractListResponse,
  ContractDetailResponse,
  ContractStatsResponse,
  ContractHistoryResponse,
  ContractFilters,
  CreateContractData,
  UpdateContractData,
} from '../../types';

const CONTRACTS_BASE_URL = '/admin/customerscontracts/contracts';

/**
 * CustomersContracts Service
 * Provides methods to interact with the contracts API
 */
export const contractsService = {
  /**
   * Get paginated list of contracts with optional filters
   * @param filters - Optional filters for search, pagination, sorting, etc.
   * @returns Promise with paginated contracts data
   */
  async getContracts(filters?: ContractFilters): Promise<ContractListResponse> {
    try {
      const params = new URLSearchParams();

      // Search & Basic Filters
      if (filters?.reference) params.append('reference', filters.reference);
      if (filters?.customer_id) params.append('customer_id', filters.customer_id.toString());
      if (filters?.remarks) params.append('remarks', filters.remarks);

      // Status Filters
      if (filters?.state_id) params.append('state_id', filters.state_id.toString());
      if (filters?.install_state_id) params.append('install_state_id', filters.install_state_id.toString());
      if (filters?.admin_status_id) params.append('admin_status_id', filters.admin_status_id.toString());
      if (filters?.is_signed) params.append('is_signed', filters.is_signed);
      if (filters?.status) params.append('status', filters.status);

      // Date Range Filters
      if (filters?.opened_at_from) params.append('opened_at_from', filters.opened_at_from);
      if (filters?.opened_at_to) params.append('opened_at_to', filters.opened_at_to);
      if (filters?.payment_at_from) params.append('payment_at_from', filters.payment_at_from);
      if (filters?.payment_at_to) params.append('payment_at_to', filters.payment_at_to);
      if (filters?.opc_at_from) params.append('opc_at_from', filters.opc_at_from);
      if (filters?.opc_at_to) params.append('opc_at_to', filters.opc_at_to);

      // Team & Staff Filters
      if (filters?.team_id) params.append('team_id', filters.team_id.toString());
      if (filters?.telepro_id) params.append('telepro_id', filters.telepro_id.toString());
      if (filters?.sale_1_id) params.append('sale_1_id', filters.sale_1_id.toString());
      if (filters?.sale_2_id) params.append('sale_2_id', filters.sale_2_id.toString());
      if (filters?.manager_id) params.append('manager_id', filters.manager_id.toString());
      if (filters?.assistant_id) params.append('assistant_id', filters.assistant_id.toString());
      if (filters?.installer_user_id) params.append('installer_user_id', filters.installer_user_id.toString());

      // Financial Filters
      if (filters?.financial_partner_id) params.append('financial_partner_id', filters.financial_partner_id.toString());
      if (filters?.price_min) params.append('price_min', filters.price_min.toString());
      if (filters?.price_max) params.append('price_max', filters.price_max.toString());

      // Pagination & Sorting
      if (filters?.sort_by) params.append('sort_by', filters.sort_by);
      if (filters?.sort_order) params.append('sort_order', filters.sort_order);
      if (filters?.per_page) params.append('per_page', filters.per_page.toString());
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.with_relations !== undefined) {
        params.append('with_relations', filters.with_relations ? '1' : '0');
      }

      const url = `${CONTRACTS_BASE_URL}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<ContractListResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  },

  /**
   * Get single contract by ID with all relations
   * @param id - Contract ID
   * @returns Promise with contract details
   */
  async getContract(id: number): Promise<ContractDetailResponse> {
    try {
      const response = await apiClient.get<ContractDetailResponse>(`${CONTRACTS_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contract ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get contract statistics
   * @returns Promise with aggregated statistics
   */
  async getStatistics(): Promise<ContractStatsResponse> {
    try {
      const response = await apiClient.get<ContractStatsResponse>(`${CONTRACTS_BASE_URL}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contract statistics:', error);
      throw error;
    }
  },

  /**
   * Get contract history (change log)
   * @param id - Contract ID
   * @returns Promise with contract history
   */
  async getContractHistory(id: number): Promise<ContractHistoryResponse> {
    try {
      const response = await apiClient.get<ContractHistoryResponse>(`${CONTRACTS_BASE_URL}/${id}/history`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contract ${id} history:`, error);
      throw error;
    }
  },

  /**
   * Create new contract
   * @param data - Contract creation data
   * @returns Promise with created contract
   */
  async createContract(data: CreateContractData): Promise<ContractDetailResponse> {
    try {
      const response = await apiClient.post<ContractDetailResponse>(CONTRACTS_BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  },

  /**
   * Update existing contract
   * @param id - Contract ID
   * @param data - Contract update data
   * @returns Promise with updated contract
   */
  async updateContract(id: number, data: UpdateContractData): Promise<ContractDetailResponse> {
    try {
      const response = await apiClient.put<ContractDetailResponse>(`${CONTRACTS_BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating contract ${id}:`, error);
      throw error;
    }
  },

  /**
   * Soft delete contract (sets status to DELETE)
   * @param id - Contract ID
   * @returns Promise with success message
   */
  async deleteContract(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(
        `${CONTRACTS_BASE_URL}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting contract ${id}:`, error);
      throw error;
    }
  },

  /**
   * Generate unique contract reference
   * @param prefix - Reference prefix (default: 'CONT')
   * @returns Promise with generated reference
   */
  async generateReference(prefix: string = 'CONT'): Promise<{ success: boolean; reference: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; reference: string }>(
        `${CONTRACTS_BASE_URL}/generate-reference`,
        { prefix }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating contract reference:', error);
      throw error;
    }
  },
};
