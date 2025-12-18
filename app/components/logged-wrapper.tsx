import type { ReactNode } from 'react';
import { Outlet, redirect } from 'react-router';
import { isAuth } from '~/lib/auth';
import { AuthProvider } from '~/contexts/auth';


export async function clientLoader() {
  const isAuthenticated = await isAuth();
  
  if (!isAuthenticated) {
    throw redirect('/login');
  }
  
  return null;
}


export default function LoggedWrapper({ children }: { children?: ReactNode }) {
  return (
    <AuthProvider>
      <Outlet />
      {children}
    </AuthProvider>
  );
}

