import { LoginForm } from '@/src/modules/UsersGuard';

export const metadata = {
  title: 'Admin Login',
  description: 'Login to admin panel',
};

export default function AdminLoginPage() {
  return <LoginForm />;
}