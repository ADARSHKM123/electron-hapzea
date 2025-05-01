import React from 'react';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="app-container">
      <main className="app-content">
        <Outlet />
      </main>
      
      <footer className="app-footer">
        <p>© 2025 Hapzea Desktop App</p>
      </footer>
    </div>
  );
}

export default App;