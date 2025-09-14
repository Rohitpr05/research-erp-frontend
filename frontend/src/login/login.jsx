import React, { useState, useEffect } from 'react';
import authService from './authService';
import './login.css';

const Login = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    if (authService.isLoggedIn()) {
      onLogin();
    }
  }, [onLogin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLoginMode) {
        // Login
        const usernameOrEmail = formData.username || formData.email;
        if (!usernameOrEmail || !formData.password) {
          throw new Error('Please enter both username/email and password');
        }

        const result = await authService.login(usernameOrEmail, formData.password);
        setSuccess(result.message);

        setTimeout(() => {
          onLogin();
        }, 1000);

      } else {
        // Register
        if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
          throw new Error('Please fill in all required fields');
        }

        const result = await authService.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          department: formData.department
        });

        setSuccess(result.message + '. You can now login.');

        setTimeout(() => {
          setIsLoginMode(true);
          setFormData({
            username: formData.username,
            email: '',
            password: '',
            fullName: '',
            department: ''
          });
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Now Google button does nothing (just placeholder)
  const handleGoogleSignIn = () => {
    setError('Google Sign-In not implemented yet');
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setSuccess('');
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      department: ''
    });
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="image-section">
          <img src="/cu.jpg" alt="Christ University Campus" className="campus-image" />
        </div>
        
        <div className="form-section">
          <div className="form-content">
            <div className="logo-container">
              <img src="/logo.jpg" alt="CHRIST University" className="logo" />
            </div>
            
            <h1 className="login-title">
              {isLoginMode ? 'Faculty Login' : 'Faculty Registration'}
            </h1>
            <p className="login-subtitle">
              {isLoginMode ? 'Please enter to continue' : 'Create your faculty account'}
            </p>

            {error && (
              <div className="message error-message">
                {error}
              </div>
            )}
            {success && (
              <div className="message success-message">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="login-form">
              {!isLoginMode && (
                <>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required={!isLoginMode}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      placeholder="Enter your department"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="username">
                  {isLoginMode ? 'Username or Email' : 'Username *'}
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder={isLoginMode ? "Enter your username/email" : "Choose a username"}
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  autoComplete="username"
                />
              </div>

              {!isLoginMode && (
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your university email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required={!isLoginMode}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    autoComplete={isLoginMode ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePassword}
                    aria-label="Toggle password visibility"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {isLoginMode && (
                <a href="#" className="forgot-link">Forgot username/password?</a>
              )}
              
              <button type="submit" className="sign-in-btn" disabled={loading}>
                {loading ? (
                  <span className="loading-spinner">⏳</span>
                ) : (
                  isLoginMode ? 'Sign In' : 'Register'
                )}
              </button>
            </form>

            {isLoginMode && (
              <button className="google-btn" onClick={handleGoogleSignIn} disabled={loading}>
                <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Sign in with Google
              </button>
            )}

            <div className="mode-switch">
              <button type="button" className="switch-btn" onClick={switchMode} disabled={loading}>
                {isLoginMode 
                  ? "Don't have an account? Register here" 
                  : "Already have an account? Login here"}
              </button>
            </div>
            
            <p className="quote">
              "If we knew what we were doing, it would<br />
              not be called research"
            </p>

            {isLoginMode && (
              <div className="demo-info">
                <p><strong>Demo Credentials:</strong></p>
                <p>Username: <code>john.doe</code> | Password: <code>password123</code></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;