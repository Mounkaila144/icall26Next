// ============================================================================
// CustomersContracts Module - Contract Form Component
// ============================================================================
// Form component for creating and editing contracts
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useContractForm } from '../hooks/useContractForm';
import type { CreateContractData, UpdateContractData, CustomerContract } from '../../types';

interface ContractFormProps {
  contract?: CustomerContract | null;
  onSuccess?: (contract: CustomerContract) => void;
  onCancel?: () => void;
}

/**
 * ContractForm Component
 * Handles both creation and editing of contracts
 */
export default function ContractForm({ contract, onSuccess, onCancel }: ContractFormProps) {
  const { submitting, error, createContract, updateContract, generateReference, clearError } =
    useContractForm();

  // Form state
  const [formData, setFormData] = useState<Partial<CreateContractData>>({
    reference: contract?.reference || '',
    customer_id: contract?.customer_id || 0,
    financial_partner_id: contract?.financial_partner_id || 0,
    tax_id: contract?.tax_id || 0,
    team_id: contract?.team_id || 0,
    telepro_id: contract?.telepro_id || 0,
    sale_1_id: contract?.sale_1_id || 0,
    manager_id: contract?.manager_id || 0,
    state_id: contract?.state_id || 0,
    total_price_with_taxe: contract?.total_price_with_taxe || 0,
    total_price_without_taxe: contract?.total_price_without_taxe || 0,
    is_signed: contract?.is_signed || 'NO',
    status: contract?.status_flag || 'ACTIVE',
    remarks: contract?.remarks || '',
  });

  const isEditMode = !!contract;

  // Styles
  const containerStyle: React.CSSProperties = {
    background: 'white',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '900px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '32px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: '24px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  };

  const requiredStyle: React.CSSProperties = {
    color: '#dc3545',
    marginLeft: '4px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: 'inherit',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-end',
    marginTop: '32px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: '#6c757d',
  };

  const errorStyle: React.CSSProperties = {
    background: '#fee',
    color: '#c33',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
    border: '1px solid #fcc',
  };

  const linkButtonStyle: React.CSSProperties = {
    background: 'transparent',
    color: '#667eea',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    textDecoration: 'underline',
    marginTop: '8px',
  };

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? value === ''
            ? 0
            : parseFloat(value)
          : value,
    }));

    // Clear error when user starts typing
    if (error) clearError();
  };

  const handleGenerateReference = async () => {
    const ref = await generateReference('CONT');
    if (ref) {
      setFormData((prev) => ({ ...prev, reference: ref }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let result: CustomerContract | null = null;

    if (isEditMode && contract) {
      result = await updateContract(contract.id, formData as UpdateContractData);
    } else {
      result = await createContract(formData as CreateContractData);
    }

    if (result && onSuccess) {
      onSuccess(result);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>{isEditMode ? 'Edit Contract' : 'Create New Contract'}</h1>
        <p style={subtitleStyle}>
          {isEditMode
            ? 'Update contract information below'
            : 'Fill in the details to create a new contract'}
        </p>
      </div>

      {/* Error Message */}
      {error && <div style={errorStyle}>❌ {error}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Reference */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>
            Reference <span style={requiredStyle}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              required
              style={{ ...inputStyle, flex: 1 }}
              placeholder="e.g., CONT-2024-00001"
            />
            {!isEditMode && (
              <button
                type="button"
                onClick={handleGenerateReference}
                style={linkButtonStyle}
              >
                Generate
              </button>
            )}
          </div>
        </div>

        {/* Basic Information Grid */}
        <div style={gridStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Customer ID <span style={requiredStyle}>*</span>
            </label>
            <input
              type="number"
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Customer ID"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Financial Partner ID <span style={requiredStyle}>*</span>
            </label>
            <input
              type="number"
              name="financial_partner_id"
              value={formData.financial_partner_id}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Financial Partner ID"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Tax ID <span style={requiredStyle}>*</span>
            </label>
            <input
              type="number"
              name="tax_id"
              value={formData.tax_id}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Tax ID"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              State ID <span style={requiredStyle}>*</span>
            </label>
            <input
              type="number"
              name="state_id"
              value={formData.state_id}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Contract Status ID"
            />
          </div>
        </div>

        {/* Team Information Grid */}
        <div style={gridStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Team ID <span style={requiredStyle}>*</span>
            </label>
            <input
              type="number"
              name="team_id"
              value={formData.team_id}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Team ID"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Telepro ID <span style={requiredStyle}>*</span>
            </label>
            <input
              type="number"
              name="telepro_id"
              value={formData.telepro_id}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Telepro ID"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Sale 1 ID <span style={requiredStyle}>*</span>
            </label>
            <input
              type="number"
              name="sale_1_id"
              value={formData.sale_1_id}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Primary Salesperson ID"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Manager ID <span style={requiredStyle}>*</span>
            </label>
            <input
              type="number"
              name="manager_id"
              value={formData.manager_id}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Manager ID"
            />
          </div>
        </div>

        {/* Price Information Grid */}
        <div style={gridStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Price (Tax Included) <span style={requiredStyle}>*</span>
            </label>
            <input
              type="number"
              name="total_price_with_taxe"
              value={formData.total_price_with_taxe}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              style={inputStyle}
              placeholder="0.00"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Price (Tax Excluded) <span style={requiredStyle}>*</span>
            </label>
            <input
              type="number"
              name="total_price_without_taxe"
              value={formData.total_price_without_taxe}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              style={inputStyle}
              placeholder="0.00"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Signed Status</label>
            <select
              name="is_signed"
              value={formData.is_signed}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="NO">Not Signed</option>
              <option value="YES">Signed</option>
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Contract Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="ACTIVE">Active</option>
              <option value="DELETE">Deleted</option>
            </select>
          </div>
        </div>

        {/* Remarks */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            style={textareaStyle}
            placeholder="Additional notes or remarks..."
          />
        </div>

        {/* Action Buttons */}
        <div style={buttonGroupStyle}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={secondaryButtonStyle}
              disabled={submitting}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            style={{
              ...buttonStyle,
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
            disabled={submitting}
          >
            {submitting ? 'Saving...' : isEditMode ? 'Update Contract' : 'Create Contract'}
          </button>
        </div>
      </form>
    </div>
  );
}
