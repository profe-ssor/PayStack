const API_BASE_URL = 'http://localhost:8000/api/payments';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  // Set authentication tokens
  setTokens(accessToken, refreshToken) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Set user data
  setUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get access token
  getAccessToken() {
    return this.token;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();
      console.log('Registration response:', result);

      if (response.ok && result.status === 'success') {
        this.setTokens(result.data.tokens.access, result.data.tokens.refresh);
        this.setUser(result.data.user);
        return result;
      } else {
        // Handle validation errors
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(', ');
          throw new Error(errorMessages);
        }
        // Handle Django REST framework validation errors
        if (typeof result === 'object') {
          const errorMessages = Object.values(result).flat().join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();
      console.log('Login response:', result);

      if (response.ok && result.status === 'success') {
        this.setTokens(result.data.tokens.access, result.data.tokens.refresh);
        this.setUser(result.data.user);
        return result;
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      if (this.refreshToken) {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ refresh_token: this.refreshToken })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: this.refreshToken })
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        this.setTokens(result.data.access, this.refreshToken);
        return result.data.access;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuth();
      throw error;
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        this.setUser(result.data);
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to get profile');
      }
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(profileData)
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        this.setUser(result.data);
        return result;
      } else {
        throw new Error(result.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Clear authentication data
  clearAuth() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Get authorization header for API requests
  getAuthHeader() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
  }
}

const authService = new AuthService();
export default authService; 