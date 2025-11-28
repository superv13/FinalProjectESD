import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import '../presentation/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }
        // Note: Backend has GET /api/employees/profile for authenticated user profile
        // For now, we'll fetch all employees and use mock data
        setUser({ name: 'Faculty Member', email: 'faculty@school.edu' });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;
  if (error) return <div className="dashboard-container error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 className="dashboard-title">Faculty Portal</h1>
        <button onClick={() => { UserService.logout(); navigate('/'); }} className="logout-btn">
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-grid">
          {/* Welcome Card */}
          <div className="card welcome-card">
            <h2>Welcome</h2>
            <p>Hello, {user?.name || 'Faculty Member'}!</p>
            <p className="subtitle">Manage your profile and courses from here.</p>
          </div>

          {/* My Profile Card */}
          <div className="card action-card">
            <h3>My Profile</h3>
            <p>View and edit your personal information</p>
            <button onClick={() => navigate('/dashboard/profile')} className="card-btn">
              Go to Profile →
            </button>
          </div>

          {/* All Employees Card */}
          <div className="card action-card">
            <h3>Faculty List</h3>
            <p>View all faculty members and their courses</p>
            <button
                onClick={() => navigate('/employees')}
                className="card-btn"
            >
                View Employees →
            </button>
            </div>


          {/* Courses Card */}
          <div className="card action-card">
            <h3>My Courses</h3>
            <p>Manage your assigned courses</p>
            <button onClick={() => navigate('/dashboard/courses')} className="card-btn">
              View Courses →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
