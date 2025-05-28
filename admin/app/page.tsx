import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/login-form';

export default function Home() {
  // In a real implementation, we would check if the user is already authenticated
  // and redirect to the dashboard if they are
  // For now, we'll just show the login form
  
  // Uncomment this when authentication is fully implemented
  // if (isAuthenticated) {
  //   redirect('/dashboard');
  // }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}