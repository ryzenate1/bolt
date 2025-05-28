/**
 * API utilities for the admin panel
 */

import { toast } from "@/hooks/use-toast";

// Define the base API URL - can be configured based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Helper to get fallback images based on context
export function getFallbackImage(context: string): string {
  switch (context) {
    case 'trusted-badges':
      return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop";
    case 'categories':
      return "https://images.unsplash.com/photo-1534766438357-2b270dbd1b40?q=80&w=1974&auto=format&fit=crop";
    case 'products':
      return "https://images.unsplash.com/photo-1565980648495-e01d24d7d8be?q=80&w=2070&auto=format&fit=crop";
    default:
      return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop";
  }
}

// Helper to parse error responses
export async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      return errorData.message || errorData.error || `API Error: ${response.status}`;
    } else {
      const text = await response.text();
      return text || `API Error: ${response.status}`;
    }
  } catch (e) {
    return `API Error: ${response.status}`;
  }
}

/**
 * Makes an authenticated API request to the server
 * Automatically adds the authorization token from localStorage
 */
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('oceanFreshToken') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  console.log("Auth headers:", JSON.stringify(headers));

  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  try {
    console.log(`Making ${options.method || 'GET'} request to: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    console.log(`Response status from ${url}: ${response.status}`);
    
    // Automatically handle 401/403 errors
    if (response.status === 401 || response.status === 403) {
      console.error('Authentication error:', response.status);
      // If we're not on the login page, redirect to login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('login')) {
        window.location.href = '/login';
        return null;
      }
    }
    
    // Parse JSON if possible
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await response.json();
        
        // Handle server error messages
        if (!response.ok) {
          throw new Error(data.message || data.error || `API Error: ${response.status}`);
        }
        
        return data;
      } catch (e) {
        console.error("Error parsing JSON response:", e);
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        return {};
      }
    } else {
      const text = await response.text();
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${text}`);
      }
      
      return text;
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * API client for admin panel
 */
export const adminApi = {
  // Fetch data from API endpoints
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new Error(errorMessage);
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      throw error;
    }
  },
  
  // Create new resources
  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new Error(errorMessage);
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  },
  
  // Update existing resources
  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new Error(errorMessage);
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error);
      throw error;
    }
  },
  
  // Delete resources
  async delete(endpoint: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(`Error deleting from ${endpoint}:`, error);
      throw error;
    }
  },
  
  // Upload a file (image)
  async uploadImage(file: File, context: string = 'general'): Promise<string> {
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);
      formData.append('context', context);
      
      // Send the file to the upload API
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        console.warn('Image upload failed, using fallback image');
        return getFallbackImage(context);
      }
      
      const data = await response.json();
      
      // For our demo, we'll just use an immediate URL
      // In a real app, you'd use the URL from the storage service
      if (!data.url) {
        return getFallbackImage(context);
      }
      
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return getFallbackImage(context);
    }
  }
};

// Helpers for common API operations with toast notifications
export const apiHelpers = {
  // Fetch data with loading toast
  async fetchWithToast<T>(endpoint: string, loadingMessage: string, errorMessage: string): Promise<T | null> {
    try {
      toast({
        title: "Loading",
        description: loadingMessage,
      });
      
      const data = await adminApi.get<T>(endpoint);
      
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  },
  
  // Create with success/error toasts
  async createWithToast<T>(endpoint: string, data: any, successMessage: string, errorMessage: string): Promise<T | null> {
    try {
      const result = await adminApi.post<T>(endpoint, data);
      
      toast({
        title: "Success",
        description: successMessage,
      });
      
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  },
  
  // Update with success/error toasts
  async updateWithToast<T>(endpoint: string, data: any, successMessage: string, errorMessage: string): Promise<T | null> {
    try {
      const result = await adminApi.put<T>(endpoint, data);
      
      toast({
        title: "Success",
        description: successMessage,
      });
      
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  },
  
  // Delete with success/error toasts
  async deleteWithToast(endpoint: string, successMessage: string, errorMessage: string): Promise<boolean> {
    try {
      await adminApi.delete(endpoint);
      
      toast({
        title: "Success",
        description: successMessage,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }
}; 