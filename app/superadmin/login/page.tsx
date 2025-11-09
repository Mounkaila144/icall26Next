import { SuperadminLoginForm } from '@/src/modules/UsersGuard';

export const metadata = {
  title: 'iCall26 - Connexion Super Admin',
  description: 'Connexion au portail super administrateur iCall26',
};

export default function SuperadminLoginPage() {
  return <SuperadminLoginForm />;
}