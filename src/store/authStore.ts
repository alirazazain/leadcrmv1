import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Mock admin user for development
const mockAdmin: User = {
  id: '1',
  email: 'admin@example.com',
  password: 'admin123', // In real app, never store plain passwords
  role: 'admin',
  name: 'Admin User'
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === mockAdmin.email && password === mockAdmin.password) {
        set({ user: mockAdmin, loading: false, error: null });
      } else {
        set({ error: 'Invalid credentials', loading: false });
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      throw error;
    }
  },
  logout: () => {
    set({ user: null, error: null });
  }
}));