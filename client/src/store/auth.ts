/**
 * @author Arman Hazrati
 * Authentication state management with Zustand
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
          });

          const { accessToken, refreshToken, user } = response.data;

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
          });
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Login failed');
          }
          throw error;
        }
      },

      register: async (name: string, email: string, password: string, role: string) => {
        try {
          const response = await axios.post(`${API_URL}/auth/register`, {
            name,
            email,
            password,
            role,
          });

          const { accessToken, refreshToken, user } = response.data;

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
          });
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Registration failed');
          }
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;

          set({ accessToken });
        } catch (error) {
          // If refresh fails, logout
          get().logout();
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
