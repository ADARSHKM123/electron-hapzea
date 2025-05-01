import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [userInfo, setUserInfo] = useState({
    token: localStorage.getItem('token') 
      ? localStorage.getItem('token').substring(0, 10) + '...' 
      : null
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in when component mounts
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/');
    }
    
    // Fade in animation
    const dashboard = document.querySelector('.hp-dashboard');
    if (dashboard) {
      dashboard.classList.add('fade-in');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    
    // Navigate back to login page
    navigate('/');
  };

  return (
    <div className="hp-dashboard">
      <div className="hp-dashboard__content">
        <h2 className="hp-dashboard__title">Hapzea Dashboard</h2>
        <p className="hp-dashboard__welcome">Welcome to your dashboard!</p>
        
        <div className="hp-dashboard__card">
          <div className="hp-dashboard__info">
            <div className="hp-dashboard__info-label">Access Token:</div>
            <div className="hp-dashboard__info-value">{userInfo.token}</div>
          </div>
          
          <button className="hp-dashboard__logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;