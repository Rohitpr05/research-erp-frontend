// authService.js - Updated for Research ERP MongoDB Backend
// Replace your current authService.js content with this code

class AuthService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api/auth';
    this.tokenKey = 'research_erp_token';
    this.userKey = 'research_erp_user';
  }

  // Helper method to handle API requests
  async apiRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add authorization header if token exists
    const token = this.getToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log(`📡 API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      console.log(`📡 Response: ${response.status} - ${data.message || 'Success'}`);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // Enhanced error handling for better user experience
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('🔌 Connection Error: Cannot connect to backend server');
        throw new Error('Cannot connect to server. Please ensure the backend is running on localhost:5000');
      }
      
      console.error('📡 API Error:', error.message);
      throw error;
    }
  }

  // Register a new user (same interface as your original)
  async register(userData) {
    try {
      console.log('📝 Registering user:', userData.username);
      
      const response = await this.apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      console.log('✅ Registration successful');
      
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      throw new Error(error.message || 'Registration failed');
    }
  }

  // Login user (same interface as your original)
  async login(identifier, password) {
    try {
      console.log('🔐 Attempting login for:', identifier);
      
      const response = await this.apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      });

      if (response.success) {
        // Store token and user data in localStorage (same as before)
        this.setToken(response.token);
        this.setUserData(response.user);
        console.log('✅ Login successful for:', response.user.fullName);
      }

      return {
        success: true,
        message: response.message,
        user: response.user
      };
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      throw new Error(error.message || 'Login failed');
    }
  }

  // Verify if current token is valid
  async verifyToken() {
    const token = this.getToken();
    if (!token) {
      console.log('🔍 No token found');
      return false;
    }

    try {
      console.log('🔍 Verifying token...');
      
      const response = await this.apiRequest('/verify-token', {
        method: 'POST',
        body: JSON.stringify({ token })
      });

      if (response.success) {
        // Update user data
        this.setUserData(response.user);
        console.log('✅ Token verified for:', response.user.fullName);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Token verification failed:', error.message);
      this.logout();
      return false;
    }
  }

  // Get user profile
  async getProfile() {
    try {
      console.log('👤 Fetching user profile...');
      
      const response = await this.apiRequest('/profile');
      
      console.log('✅ Profile fetched');
      return response.user;
    } catch (error) {
      console.error('❌ Profile fetch failed:', error.message);
      throw new Error(error.message || 'Failed to fetch profile');
    }
  }

  // Logout user (same as before)
  logout() {
    console.log('🚪 Logging out user...');
    
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    
    console.log('✅ Logout successful');
  }

  // Check if user is logged in (same as before)
  isLoggedIn() {
    const token = this.getToken();
    const userData = this.getUserData();
    const isLoggedIn = !!(token && userData);
    
    if (isLoggedIn) {
      console.log('✅ User is logged in:', userData.fullName);
    }
    
    return isLoggedIn;
  }

  // Get stored token (same as before)
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Set token (same as before)
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get user data (same as before)
  getUserData() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Set user data (same as before)
  setUserData(userData) {
    localStorage.setItem(this.userKey, JSON.stringify(userData));
  }

  // Get current user info (same as before)
  getCurrentUser() {
    return this.getUserData();
  }

  // Check if user has specific role
  hasRole(role) {
    const userData = this.getUserData();
    return userData && userData.role === role;
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole('admin');
  }

  // Check if user is faculty
  isFaculty() {
    return this.hasRole('faculty');
  }

  // Check if user is student
  isStudent() {
    return this.hasRole('student');
  }

  // Server health check (useful for debugging)
  async checkServerHealth() {
    try {
      console.log('🏥 Checking server health...');
      
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Server is healthy:', data.message);
      } else {
        console.log('⚠️ Server health check failed');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Server health check failed:', error.message);
      return { 
        success: false, 
        error: error.message,
        message: 'Server is not responding. Make sure backend is running on localhost:5000'
      };
    }
  }

  // Backward compatibility methods (if your existing code uses these)
  async authenticateUser(username, password) {
    console.log('⚠️ Using legacy method. Consider using login() instead.');
    return this.login(username, password);
  }

  async createUser(userData) {
    console.log('⚠️ Using legacy method. Consider using register() instead.');
    return this.register(userData);
  }
}

// Create and export a single instance (same as before)
const authService = new AuthService();

export default authService;