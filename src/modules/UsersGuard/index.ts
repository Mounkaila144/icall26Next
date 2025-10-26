/**
 * UsersGuard Module Barrel Export
 * Exposes public API of the module
 */

// Admin exports
export { default as LoginForm } from './admin/components/LoginForm';
export { useAuth } from './admin/hooks/useAuth';
export { adminAuthService } from './admin/services/authService';

// Types
export type {
  User,
  Group,
  LoginCredentials,
  LoginResponse,
  AuthState,
} from './types/auth.types';