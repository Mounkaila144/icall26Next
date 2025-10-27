import { LoginForm } from '@/src/modules/UsersGuard';

export const metadata = {
  title: 'iCall26 - Connexion Admin',
  description: 'Connexion au portail administrateur iCall26',
};

export default function AdminLoginPage() {
  return <LoginForm />;
}