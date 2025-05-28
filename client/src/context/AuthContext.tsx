"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { API } from '@/types/api';
import AuthService from '@/services/auth';

type User = API.UserProfile & {
  token?: string;
};

type AuthContextType = {
  user: User | null;
  login: (phoneNumber: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phoneNumber: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginWithOtp: (phoneNumber: string, otp: string, userData?: { name?: string; email?: string }) => Promise<{ success: boolean; message?: string }>;
  sendOtp: (phoneNumber: string) => Promise<{ success: boolean; message?: string; userExists?: boolean }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  updateUserProfile: (data: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token and user data in localStorage on initial load
    const token = localStorage.getItem('token');
    const savedUserData = localStorage.getItem('userData');
    
    if (token) {
      // If we have saved user data, use it immediately to avoid delay
      if (savedUserData) {
        try {
          const parsedUserData = JSON.parse(savedUserData);
          const token = localStorage.getItem('token');
          if (token) {
            setUser({ ...parsedUserData, token });
          }
        } catch (e) {
          console.error('Error parsing saved user data:', e);
        }
      }
      
      // Then fetch fresh data from API
      AuthService.fetchUserProfile(token).then((userData) => {
        setUser({ ...userData, token });
      }).catch((error) => {
        console.error('Error fetching user profile:', error);
        localStorage.removeItem('token');
        setUser(null);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    
    // Add event listener for storage changes (for multi-tab support)
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Handle changes to localStorage (for multi-tab support)
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'token' && !event.newValue) {
      // Token was removed in another tab
      setUser(null);
    } else if (event.key === 'userData' && event.newValue) {
      // User data was updated in another tab
      try {
        const userData = JSON.parse(event.newValue);
        const token = localStorage.getItem('token');
        if (token) {
          setUser({ ...userData, token });
        }
      } catch (e) {
        console.error('Error parsing user data from storage event:', e);
      }
    }
  };

  // Fetch user profile with token
  const fetchUserProfile = async (token: string) => {
    try {
      const userData = await api.get('/users/profile');
      
      setUser({ ...userData, token });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login with phone and password
  const login = async (phoneNumber: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log(`Attempting to login with phone: ${phoneNumber}`);
      
      // For testing purposes, let's use the test credentials from our seed data
      if (phoneNumber === '9876543210' && password === 'password123') {
        console.log('Using test credentials - bypassing API for now');
        const testUser = {
          id: '88e49eec-e6fb-404a-93da-6fa7740ad944', // This should match the ID from your seed data
          name: 'Kadal Thunai Customer',
          email: 'customer@kadalthunai.com',
          phoneNumber: '9876543210',
          loyaltyPoints: 1250,
          loyaltyTier: 'Silver',
          token: 'test-token-for-development'
        };
        
        localStorage.setItem('token', testUser.token);
        localStorage.setItem('userData', JSON.stringify(testUser));
        setUser(testUser);
        return { success: true, message: 'Welcome to Kadal Thunai! You have successfully logged in.' };
      }
      
      const data = await api.post('/auth/login', { phoneNumber, password });

      // If we get here, the login was successful
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        setUser({ ...data.user, token: data.token });
        return { 
          success: true, 
          message: 'Welcome to Kadal Thunai! You have successfully logged in.'
        };
      } else {
        // Handle unexpected response format
        console.error('Login response missing token or user data:', data);
        return { 
          success: false, 
          message: 'Login failed. Please try again.'
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Network error. Please check your connection and try again.'
      };
    }
  };

  // Register new user
  const register = async (name: string, email: string, phoneNumber: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const data = await api.post('/auth/register', { name, email, phoneNumber, password });

      localStorage.setItem('token', data.token);
      setUser({ ...data.user, token: data.token });
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Network error. Please check your connection and try again.'
      };
    }
  };

  // Send OTP for phone verification
  const sendOtp = async (phoneNumber: string): Promise<{ success: boolean; message?: string; userExists?: boolean }> => {
    try {
      const data = await api.post('/auth/send-otp', { phoneNumber });

      return { 
        success: true, 
        message: data.message,
        userExists: data.userExists 
      };
    } catch (error: any) {
      console.error('Send OTP error:', error);
      return { 
        success: false, 
        message: error.message || 'Network error. Please check your connection and try again.'
      };
    }
  };

  // Login with OTP
  const loginWithOtp = async (
    phoneNumber: string, 
    otp: string, 
    userData?: { name?: string; email?: string }
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const data = await api.post('/auth/verify-otp', { phoneNumber, otp, ...userData });

      localStorage.setItem('token', data.token);
      setUser({ ...data.user, token: data.token });
      return { success: true };
    } catch (error: any) {
      console.error('OTP verification error:', error);
      return { 
        success: false, 
        message: error.message || 'Network error. Please check your connection and try again.'
      };
    }
  };

  // Update user data
  const updateUser = async (userData: Partial<User>): Promise<{ success: boolean; message?: string }> => {
    try {
      if (!user) {
        return { success: false, message: 'Not authenticated' };
      }
      
      const data = await api.put('/users/update', userData);

      setUser(prev => prev ? { ...prev, ...data.user } : null);
      return { success: true };
    } catch (error: any) {
      console.error('Update user error:', error);
      return { 
        success: false, 
        message: error.message || 'Network error. Please check your connection and try again.'
      };
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<User>): Promise<{ success: boolean; message?: string }> => {
    try {
      if (!user) {
        return { success: false, message: 'Not authenticated' };
      }
      
      const updatedData = await api.put('/users/profile', data);

      setUser(prev => prev ? { ...prev, ...updatedData } : null);
      return { success: true, message: 'Profile updated successfully' };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        message: error.message || 'Network error. Please check your connection and try again.'
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        loginWithOtp,
        sendOtp,
        logout,
        updateUser,
        updateUserProfile,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
