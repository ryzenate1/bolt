"use client";

import { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'editor';
};

type AuthContextType = {
  user: User | null;
  login: (phoneNumber: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user session
    const checkAuth = async () => {
      try {
        // In a real implementation, this would check with the server
        const savedUser = localStorage.getItem('oceanFreshUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (phoneNumber: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login for admin panel with phone:', phoneNumber);
      
      // First try the hard-coded admin credentials for development/testing
      if (phoneNumber === '9876543210' && password === 'admin123') {
        console.log('Using test admin credentials - bypassing API');
        const testAdminUser: User = {
          id: '1',
          email: 'admin@kadalthunai.com',
          name: 'Admin User',
          role: 'admin',
        };
        setUser(testAdminUser);
        localStorage.setItem('oceanFreshUser', JSON.stringify(testAdminUser));
        // Use a fixed test token that will be accepted by the server
        localStorage.setItem('oceanFreshToken', 'admin-test-token');
        return true;
      }
      
      // Otherwise, make the API call
      console.log('Making API request to:', "http://localhost:5001/api/auth/login");
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, password })
      });
      
      console.log('API response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.text();
        console.error('Login failed:', res.status, errorData);
        return false;
      }
      
      const data = await res.json();
      console.log('Login successful, received data:', data);
      
      // Check if the user has admin role
      if (data.role !== 'admin') {
        console.error('User is not an admin:', data.role);
        return false;
      }
      
      const user: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
      };
      
      setUser(user);
      localStorage.setItem('oceanFreshUser', JSON.stringify(user));
      localStorage.setItem('oceanFreshToken', data.token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('oceanFreshUser');
    localStorage.removeItem('oceanFreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};