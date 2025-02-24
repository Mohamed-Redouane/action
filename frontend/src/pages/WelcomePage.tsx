// src/pages/WelcomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      <h1>Welcome to Concordia Navigation App</h1>
      <p>Click the button below to get started:</p>
      <Link to="/role-selection">
        <button>Get Started</button>
      </Link>
    </div>
  );
}

export default WelcomePage;
