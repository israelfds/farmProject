import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiService {
  private api: any;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config: any) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: any) => {
        return response;
      },
      (error: any) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Handle unauthorized
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic methods
  async get(url: string, params?: any): Promise<any> {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  async post(url: string, data?: any): Promise<any> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  async put(url: string, data?: any): Promise<any> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  async patch(url: string, data?: any): Promise<any> {
    const response = await this.api.patch(url, data);
    return response.data;
  }

  async delete(url: string): Promise<any> {
    const response = await this.api.delete(url);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService; 