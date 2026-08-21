import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuthStore } from '../store/auth.store';
import { apiClient } from '../api/axios.config';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } =
    useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('token', token);

          // Get user data from backend
          const response = await apiClient.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUser(response.data.data);
        } catch (error) {
          console.error('Failed to get user:', error);
          setUser(null);
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };
};