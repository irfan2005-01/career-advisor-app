import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="page-container fade-in">
      <h1>Personalized Career Advisor</h1>
      <p>Your journey to a better career starts here. Log in or sign up to get personalized recommendations and skills advice.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/login" style={{ marginRight: '10px' }}>
          <button>Login</button>
        </Link>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;