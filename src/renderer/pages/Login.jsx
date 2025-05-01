import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
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

  const handleLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const tokens = await window.electronAPI.login();
      console.log('Login successful');
      
      // Store token info in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', tokens.access_token);
      
      // Navigate to home page on successful login
      navigate('/home');
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
      
      <div className="hp-feather-icon"></div>
      
      <div className="hp-login__card">
        <h2 className="hp-login__heading">Welcome to Hapzea</h2>
        <p className="hp-login__subheading">Sign in to continue to your dashboard</p>
        
        {error && (
          <div className="hp-error-message">
            <span>{error}</span>
          </div>
        )}
        
        <button 
          className={`hp-google-btn ${isLoading ? 'loading' : ''}`} 
          onClick={handleLogin}
          disabled={isLoading}
        >
          <div className="hp-btn-content">
            <div className="hp-google-icon"></div>
            <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
          </div>
          <div className="hp-loading-spinner"></div>
        </button>
        
        <div className="hp-login__divider">
          <span>Secure login</span>
        </div>
        
        <p className="hp-login__privacy">
          By signing in, you agree to our{' '}
          <a href="#" className="hp-link">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="hp-link">Privacy Policy</a>
        </p>
      </div>
      
      <div className="hp-login__footer">
        <p>© 2025 Hapzea Desktop App</p>
      </div>
    </div>
  );
}

export default Login;