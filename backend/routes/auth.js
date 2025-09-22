const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Helper function to generate JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRY || '24h';
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(
    { userId, timestamp: Date.now() }, 
    secret, 
    { expiresIn }
  );
};

// Helper function to validate email domain
const isValidEmailDomain = (email) => {
  if (!process.env.ALLOWED_DOMAINS) {
    console.warn('⚠️ ALLOWED_DOMAINS not set in environment variables');
    return true; // Allow all domains if not specified
  }
  
  const allowedDomains = process.env.ALLOWED_DOMAINS.split(',').map(d => d.trim());
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
};

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName, department, phoneNumber } = req.body;

    console.log('📝 Registration attempt for:', username);

    // Basic validation
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: username, email, password, and fullName'
      });
    }

    // Validate email domain
    if (!isValidEmailDomain(email)) {
      return res.status(400).json({
        success: false,
        message: `Please use a valid university email address. Allowed domains: ${process.env.ALLOWED_DOMAINS}`
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      console.log('❌ Registration failed: User already exists');
      return res.status(400).json({
        success: false,
        message: existingUser.email === email.toLowerCase() 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    const userData = {
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
      fullName: fullName.trim(),
      department: department?.trim() || '',
      phoneNumber: phoneNumber?.trim() || ''
    };

    const newUser = new User(userData);
    await newUser.save();

    console.log('✅ User registered successfully:', newUser.username);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please login to continue.',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        department: newUser.department,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        details: messages
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again later.'
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    console.log('🔐 Login attempt for:', identifier);

    // Basic validation
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username/email and password'
      });
    }

    // Find user by username or email
    const user = await User.findByUsernameOrEmail(identifier.toLowerCase().trim());

    if (!user) {
      console.log('❌ Login failed: User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60));
      console.log('🔒 Login blocked: Account locked');
      return res.status(423).json({
        success: false,
        message: `Account temporarily locked due to too many login attempts. Please try again in ${lockTimeRemaining} minutes.`
      });
    }

    // Check if account is active
    if (!user.isActive) {
      console.log('❌ Login failed: Account inactive');
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password');
      
      // Increment login attempts
      await user.incLoginAttempts();
      
      const attemptsLeft = (parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5) - (user.loginAttempts + 1);
      let message = 'Invalid credentials';
      
      if (attemptsLeft > 0) {
        message += `. ${attemptsLeft} attempts remaining.`;
      }
      
      return res.status(401).json({
        success: false,
        message
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();
    await user.updateLastLogin();

    // Generate JWT token
    const token = generateToken(user._id);

    console.log('✅ Login successful:', user.fullName);

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        department: user.department,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again later.'
    });
  }
});

// POST /api/auth/verify-token - Verify JWT token
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    console.log('✅ Token verified for:', user.fullName);

    res.json({
      success: true,
      message: 'Token is valid',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        department: user.department,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('❌ Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
});

// Middleware to authenticate JWT token (for protected routes)
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('❌ Token authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Token authentication failed'
    });
  }
};

// GET /api/auth/profile - Get user profile (protected route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user; // Set by authenticateToken middleware
    
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        department: user.department,
        role: user.role,
        phoneNumber: user.phoneNumber,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch profile'
    });
  }
});

module.exports = router;