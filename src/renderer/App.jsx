import React, { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setError(null);
      const tokens = await window.electronAPI.login();
      console.log('Login successful');
      setIsLoggedIn(true);
      setUserInfo({ token: tokens.access_token.substring(0, 10) + '...' });
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed: ' + err.message);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Hapzea Desktop App</h1>
      </header>
      
      <main>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {!isLoggedIn ? (
          <div className="login-section">
            <h2>Welcome to Hapzea</h2>
            <p>Please log in to continue</p>
            <button onClick={handleLogin}>
              Login with Google
            </button>
          </div>
        ) : (
          <div className="dashboard">
            <h2>Dashboard</h2>
            <p>You are logged in!</p>
            <div className="user-info">
              <p>Access Token: {userInfo?.token}</p>
            </div>
            <button onClick={() => setIsLoggedIn(false)}>
              Logout
            </button>
          </div>
        )}
      </main>
      
      <footer>
        <p>© 2025 Hapzea Desktop App</p>
      </footer>
    </div>
  );
}

export default App;