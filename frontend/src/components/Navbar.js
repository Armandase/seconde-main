import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="navbar">
      <h1>Seconde Main</h1>
      <nav>
        <Link to="/">Search</Link>
        {isAuthenticated ? (
          <>
            <Link to="/favorites">Favorites</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
