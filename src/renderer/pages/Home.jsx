import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [userData, setUserData] = useState({
    // Google OAuth information
    email: localStorage.getItem('userEmail') || 'Not available',
    name: localStorage.getItem('userName') || 'User',
    picture: localStorage.getItem('userPicture') || null,
    googleId: localStorage.getItem('userId') || 'Not available',
    
    // OAuth tokens
    token: localStorage.getItem('token') 
      ? localStorage.getItem('token').substring(0, 15) + '...' 
      : 'Not available',
    tokenExpiry: localStorage.getItem('tokenExpiry')
      ? new Date(parseInt(localStorage.getItem('tokenExpiry'))).toLocaleString()
      : 'Not available',
      
    // Server information
    serverUserId: localStorage.getItem('serverUserId') || 'Not available',
    userRole: localStorage.getItem('userRole') || 'Not available'
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in when component mounts
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    
    // Log user information to console
    console.log('User logged in with the following information:');
    console.log('Email:', userData.email);
    console.log('Name:', userData.name);
    console.log('Google ID:', userData.googleId);
    console.log('Server User ID:', userData.serverUserId);
    console.log('User Role:', userData.userRole);
    console.log('Token:', localStorage.getItem('token'));
    console.log('Token Expiry:', userData.tokenExpiry);
    
    // Fade in animation
    const dashboard = document.querySelector('.hp-dashboard');
    if (dashboard) {
      dashboard.classList.add('fade-in');
    }
  }, [navigate, userData]);

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPicture');
    localStorage.removeItem('userId');
    localStorage.removeItem('serverUserId');
    localStorage.removeItem('userRole');
    
    console.log('User logged out');
    
    // Navigate back to login page
    navigate('/');
  };

  return (
    <div className="hp-dashboard">
      <div className="hp-dashboard__content">
        <h2 className="hp-dashboard__title">Hapzea Dashboard</h2>
        <p className="hp-dashboard__welcome">Welcome, {userData.name}!</p>
        
        <div className="hp-dashboard__card">
          {userData.picture && (
            <div className="hp-user-avatar">
              <img src={userData.picture} alt="User profile" />
            </div>
          )}
          
          <div className="hp-user-info">
            <div className="hp-info-item">
              <div className="hp-info-label">Email:</div>
              <div className="hp-info-value">{userData.email}</div>
            </div>
            
            <div className="hp-info-item">
              <div className="hp-info-label">Google ID:</div>
              <div className="hp-info-value">{userData.googleId}</div>
            </div>
            
            <div className="hp-info-item">
              <div className="hp-info-label">Server User ID:</div>
              <div className="hp-info-value">{userData.serverUserId}</div>
            </div>
            
            <div className="hp-info-item">
              <div className="hp-info-label">User Role:</div>
              <div className="hp-info-value">{userData.userRole}</div>
            </div>
            
            <div className="hp-info-item">
              <div className="hp-info-label">Access Token:</div>
              <div className="hp-info-value">{userData.token}</div>
            </div>
            
            <div className="hp-info-item">
              <div className="hp-info-label">Token Expiry:</div>
              <div className="hp-info-value">{userData.tokenExpiry}</div>
            </div>
          </div>
          
          <button className="hp-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;