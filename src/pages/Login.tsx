import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="page-container fade-in">
      <h1>Login Page</h1>
      <p>This is where the user will log in to the application.</p>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default Login;