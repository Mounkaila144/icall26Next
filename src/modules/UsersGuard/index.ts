/**
 * UsersGuard Module Barrel Export
 * Exposes public API of the module
 */

// Admin exports
export { default as LoginForm } from './admin/components/LoginForm';
export { useAuth } from './admin/hooks/useAuth';
export { adminAuthService } from './admin/services/authService';
export { initUsersGuardModule } from './admin/init';

// Types
export type {
  User,
  Group,
  Permission,
  LoginCredentials,
  LoginResponse,
  AuthState,
} from './types/auth.types';