import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define API endpoint
const API_ENDPOINT = 'https://api.hapzea.com';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Add subtle animation when component mounts
  useEffect(() => {
    const loginWrapper = document.querySelector('.hp-login__wrapper');
    if (loginWrapper) {
      loginWrapper.classList.add('fade-in');
    }
  }, []);

  const handleEmailLogin = (e) => {
    e.preventDefault();
    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    // Here you would typically handle the email/password login
    console.log('Email login attempted with:', email);
    // For now, just show an error
    setError('Email login not implemented yet. Please use Google Sign-in.');
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // 1. Get tokens from Google OAuth
      const tokens = await window.electronAPI.login();
      console.log('Google OAuth successful');
      
      // 2. Extract user information from ID token
      let googleId = null;
      let userEmail = null;
      let userData = null;
      
      if (tokens.id_token) {
        try {
          // Decode JWT token to get user information
          const tokenParts = tokens.id_token.split('.');
          if (tokenParts.length === 3) {
            userData = JSON.parse(atob(tokenParts[1]));
            console.log('User details from Google:', userData);
            
            // Extract googleId (sub) and email
            googleId = userData.sub;
            userEmail = userData.email;
            
            console.log('Extracted Google ID:', googleId);
            console.log('Extracted Email:', userEmail);
          }
        } catch (decodeError) {
          console.error('Error decoding ID token:', decodeError);
          setError('Failed to extract user information from Google sign-in');
          setIsLoading(false);
          return;
        }
      } else {
        console.error('No ID token received from Google');
        setError('Failed to get user information from Google');
        setIsLoading(false);
        return;
      }
      
      // 3. Validate with your backend API
      try {
        console.log('Validating with backend API...');
        const serverResponse = await axios.post(
          `${API_ENDPOINT}/api/v1/user/googlesignIn`,
          { email: userEmail, id: googleId },
          { withCredentials: true }
        );
        
        console.log('Backend validation response:', serverResponse.data);
        
        // 4. If successful, store user info and proceed
        if (serverResponse.data.success) {
          // Store user info in localStorage
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('token', tokens.access_token);
          localStorage.setItem('refreshToken', tokens.refresh_token || '');
          localStorage.setItem('tokenExpiry', tokens.expires_in ? (Date.now() + tokens.expires_in * 1000).toString() : '');
          
          // Store user profile data
          if (userData) {
            if (userData.email) localStorage.setItem('userEmail', userData.email);
            if (userData.name) localStorage.setItem('userName', userData.name);
            if (userData.picture) localStorage.setItem('userPicture', userData.picture);
            if (userData.sub) localStorage.setItem('userId', userData.sub);
          }
          
          // Store any additional data from your server response
          if (serverResponse.data.user) {
            localStorage.setItem('serverUserId', serverResponse.data.user.id || '');
            localStorage.setItem('userRole', serverResponse.data.user.role || '');
          }
          
          // Navigate to home page on successful login
          navigate('/home');
        } else {
          throw new Error(serverResponse.data.message || 'Authentication failed with server');
        }
      } catch (apiError) {
        console.error('API validation error:', apiError);
        setError('Server validation failed: ' + (apiError.response?.data?.message || apiError.message || 'Unknown error'));
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed: ' + (err.message || 'Unknown error'));
      setIsLoading(false);
    }
  };

  return (
    <div className="hp-login__wrapper">
      <div className="hp-app-title">
        <h1>Hapzea Desktop App</h1>
      </div>
      
      <div className="hp-logo">
        <img src="../../assets/icon.ico" alt="Hapzea Logo" className="hp-logo__img" />
      </div>
      
      <div className="hp-login__card">
        <h2 className="hp-login__heading">Welcome to Hapzea</h2>
        <p className="hp-login__subheading">Sign in to continue to your dashboard</p>
        
        {error && (
          <div className="hp-error-message">
            <span>{error}</span>
          </div>
        )}
        
        <form className="hp-login__form" onSubmit={handleEmailLogin}>
          <div className="hp-input-group">
            <label htmlFor="email" className="hp-input-label">Email</label>
            <input 
              type="email" 
              id="email"
              className="hp-input" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="hp-input-group">
            <label htmlFor="password" className="hp-input-label">Password</label>
            <input 
              type="password" 
              id="password"
              className="hp-input" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="hp-login-btn">
            Sign in
          </button>
        </form>
        
        <div className="hp-login__divider">
          <span>OR</span>
        </div>
        
        <button 
          className={`hp-google-btn ${isLoading ? 'loading' : ''}`} 
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <div className="hp-btn-content">
            <div className="hp-google-icon"></div>
            <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
          </div>
          <div className="hp-loading-spinner"></div>
        </button>
        
        <div className="hp-login__footer-links">
          <p className="hp-login__privacy">
            By signing in, you agree to our{' '}
            <a href="#" className="hp-link">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="hp-link">Privacy Policy</a>
          </p>
        </div>
      </div>
      
      <div className="hp-login__footer">
        <p>© 2025 Hapzea Desktop App</p>
      </div>
    </div>
  );
}

export default Login;