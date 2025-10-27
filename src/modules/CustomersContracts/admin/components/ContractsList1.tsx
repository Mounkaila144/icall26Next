// ============================================================================
// CustomersContracts Module - Main Contracts List Component
// ============================================================================

'use client';

import React, { useState } from 'react';
import { useContracts } from '../hooks/useContracts';
import type { CustomerContract } from '../../types';

/**
 * StatsCard Component - Reusable card for displaying statistics
 */
interface StatsCardProps {
  title: string;
  value: number | string;
  color: string;
  icon?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, color, icon }) => {
  const cardStyle: React.CSSProperties = {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: `2px solid ${color}`,
    flex: '1',
    minWidth: '200px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: color,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>{title}</div>
      <div style={valueStyle}>
        {icon && <span>{icon}</span>}
        {value}
      </div>
    </div>
  );
};

/**
 * StatusBadge Component - Display status with color and icon
 */
interface StatusBadgeProps {
  name: string;
  color: string;
  icon?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ name, color, icon }) => {
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '20px',
    backgroundColor: `${color}20`,
    color: color,
    fontSize: '13px',
    fontWeight: '500',
    border: `1px solid ${color}40`,
  };

  return (
    <span style={style}>
      {icon && <span>{icon}</span>}
      {name}
    </span>
  );
};

/**
 * Main Contracts List Component
 */
export default function ContractsList1() {
  const {
    contracts,
    stats,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    perPage,
    filters,
    setCurrentPage,
    setPerPage,
    updateFilter,
    clearFilters,
    deleteContract,
  } = useContracts();

  const [searchTerm, setSearchTerm] = useState('');

  // Styles
  const containerStyle: React.CSSProperties = {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '32px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#666',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  };

  const filtersSectionStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    flex: '1',
    minWidth: '200px',
  };

  const selectStyle: React.CSSProperties = {
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    minWidth: '150px',
    cursor: 'pointer',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: '#6c757d',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    overflowX: 'auto',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #667eea',
    fontWeight: '600',
    color: '#333',
    fontSize: '14px',
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
  };

  const paginationStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  };

  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#666',
  };

  const errorStyle: React.CSSProperties = {
    background: '#fee',
    color: '#c33',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #fcc',
  };

  const emptyStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#999',
    fontSize: '16px',
  };

  const deleteButtonStyle: React.CSSProperties = {
    padding: '6px 12px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  };

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('reference', searchTerm);
  };

  const handleDelete = async (id: number) => {
    await deleteContract(id);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    clearFilters();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Contracts Management</h1>
        <p style={subtitleStyle}>Manage and track customer contracts</p>
      </div>

      {/* Statistics */}
      {stats && (
        <div style={statsGridStyle}>
          <StatsCard
            title="Total Contracts"
            value={stats.total_contracts}
            color="#667eea"
            icon="📋"
          />
          <StatsCard
            title="Signed Contracts"
            value={stats.total_signed}
            color="#28a745"
            icon="✅"
          />
          <StatsCard
            title="Unsigned Contracts"
            value={stats.total_unsigned}
            color="#ffc107"
            icon="⏳"
          />
          <StatsCard
            title="Total Revenue"
            value={formatPrice(stats.total_revenue)}
            color="#17a2b8"
            icon="💰"
          />
        </div>
      )}

      {/* Filters */}
      <div style={cardStyle}>
        <form onSubmit={handleSearch}>
          <div style={filtersSectionStyle}>
            <input
              type="text"
              placeholder="Search by reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle}
            />

            <select
              value={filters.actif !== undefined ? (filters.actif ? 'true' : 'false') : 'all'}
              onChange={(e) => {
                if (e.target.value === 'all') {
                  updateFilter('actif', undefined);
                } else {
                  updateFilter('actif', e.target.value === 'true');
                }
              }}
              style={selectStyle}
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <select
              value={filters.confirme !== undefined ? (filters.confirme ? 'true' : 'false') : 'all'}
              onChange={(e) => {
                if (e.target.value === 'all') {
                  updateFilter('confirme', undefined);
                } else {
                  updateFilter('confirme', e.target.value === 'true');
                }
              }}
              style={selectStyle}
            >
              <option value="all">All Confirmed</option>
              <option value="true">Confirmed</option>
              <option value="false">Not Confirmed</option>
            </select>

            <select
              value={filters.sort_by || 'created_at'}
              onChange={(e) => updateFilter('sort_by', e.target.value)}
              style={selectStyle}
            >
              <option value="created_at">Created Date</option>
              <option value="reference">Reference</option>
              <option value="date_ouverture">Opened Date</option>
              <option value="date_paiement">Payment Date</option>
              <option value="montant_ttc">Price TTC</option>
            </select>

            <select
              value={filters.sort_order || 'desc'}
              onChange={(e) => updateFilter('sort_order', e.target.value as 'asc' | 'desc')}
              style={selectStyle}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>

            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              style={selectStyle}
            >
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <button type="submit" style={buttonStyle}>
              Search
            </button>

            <button type="button" onClick={handleClearFilters} style={secondaryButtonStyle}>
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div style={cardStyle}>
        {error && <div style={errorStyle}>❌ {error}</div>}

        {loading ? (
          <div style={loadingStyle}>
            <div
              style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p style={{ marginTop: '16px' }}>Loading contracts...</p>
          </div>
        ) : !Array.isArray(contracts) || contracts.length === 0 ? (
          <div style={emptyStyle}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <p>No contracts found</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Ref</th>
                    <th style={thStyle}>Customer</th>
                    <th style={thStyle}>Address</th>
                    <th style={thStyle}>Price TTC</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Confirmed</th>
                    <th style={thStyle}>Date Ouverture</th>
                    <th style={thStyle}>Date Paiement</th>
                    <th style={thStyle}>Created</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(contracts) && contracts.map((contract) => (
                    <tr key={contract.id}>
                      <td style={tdStyle}>
                        <strong>{contract.reference || `#${contract.id}`}</strong>
                      </td>
                      <td style={tdStyle}>
                        {contract.customer ? (
                          <>
                            <div style={{ fontWeight: '500' }}>
                              {contract.customer.company || contract.customer.nom_prenom}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              📧 {contract.customer.email}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              📞 {contract.customer.telephone || contract.customer.phone}
                            </div>
                          </>
                        ) : (
                          <span style={{ color: '#999' }}>-</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {contract.customer?.address ? (
                          <>
                            <div style={{ fontSize: '13px' }}>
                              {contract.customer.address.address1}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {contract.customer.address.postcode} {contract.customer.address.city}
                            </div>
                          </>
                        ) : (
                          <span style={{ color: '#999' }}>-</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <strong>{formatPrice(contract.montant_ttc)}</strong>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          HT: {formatPrice(contract.montant_ht)}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        {contract.status_contrat && (
                          <StatusBadge
                            name={contract.status_contrat.name}
                            color={contract.status_contrat.color || '#667eea'}
                            icon={contract.status_contrat.icon}
                          />
                        )}
                      </td>
                      <td style={tdStyle}>
                        {contract.confirme ? (
                          <span style={{ color: '#28a745' }}>✅ Yes</span>
                        ) : (
                          <span style={{ color: '#ffc107' }}>⏳ No</span>
                        )}
                      </td>
                      <td style={tdStyle}>{formatDate(contract.date_ouverture)}</td>
                      <td style={tdStyle}>{formatDate(contract.date_paiement)}</td>
                      <td style={tdStyle}>{formatDate(contract.created_at)}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleDelete(contract.id)}
                          style={deleteButtonStyle}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#c82333';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#dc3545';
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={paginationStyle}>
              <div style={{ color: '#666', fontSize: '14px' }}>
                Showing {(currentPage - 1) * perPage + 1} to{' '}
                {Math.min(currentPage * perPage, total)} of {total} contracts
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    ...buttonStyle,
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Previous
                </button>

                <span style={{ padding: '0 16px', color: '#666', fontSize: '14px' }}>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    ...buttonStyle,
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
