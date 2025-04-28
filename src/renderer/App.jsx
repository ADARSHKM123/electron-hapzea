import React, { useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';

export default function App() {
  const [token, setToken] = useState(null);

  if (!token) {
    return <Login onSuccess={setToken} />;
  }
  return <Home token={token} />;
}
