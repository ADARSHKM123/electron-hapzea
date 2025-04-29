// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Home  from './pages/Home';

function LoginWrapper() {
  const navigate = useNavigate();
  const handleSuccess = (tokens) => {
    // you might store tokens in context / state…
    console.log('############',tokens);
    
    if(tokens){
        navigate('/home');
    }
  };
  return <Login onSuccess={handleSuccess} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginWrapper />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
