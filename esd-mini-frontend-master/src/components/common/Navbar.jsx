import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserService from '../service/UserService';
import '../presentation/Navbar.css'

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
  const location = useLocation();

  useEffect(() => {
    // Listen for changes in localStorage (like login/logout)
    const handleStorageChange = () => {
      setIsAuthenticated(UserService.isAuthenticated());
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    const confirmDelete = window.confirm('Are you sure you want to logout this user?');
    if (confirmDelete) {
      UserService.logout();
      setIsAuthenticated(false);
    }
  };

  // Check if we're on the login page
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand - Left side */}
        {(isLoginPage && !isAuthenticated) || (isAuthenticated && !isLoginPage) ? (
          <Link to="/" className="navbar-brand">Academic ERP</Link>
        ) : null}

        {/* Menu items - Right side */}
        <ul className="navbar-menu">
          {isAuthenticated && !isLoginPage && (
            <>
              <li className="navbar-item">
                <Link to="/auth/user-management" className="navbar-link">Faculty List</Link>
              </li>
              <li className="navbar-item">
                <Link to="/auth/courses" className="navbar-link">Courses</Link>
              </li>
              <li className="navbar-item">
                <Link to="/" onClick={handleLogout} className="navbar-link logout-link">Logout</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;