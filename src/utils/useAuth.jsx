// utils/useAuth.js
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export function useAuth() {
  const { user, isLoggedIn, isLoading } = useContext(AuthContext);

  return { user, isLoggedIn, isLoading };
}
