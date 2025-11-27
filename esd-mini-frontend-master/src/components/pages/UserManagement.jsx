import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import '../presentation/UserManagement.css'

function UserManagementPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Unauthorized access. Please log in.");
        const response = await UserService.getAllUsers(token);
        console.log(response);
        if (response && Array.isArray(response.employeesList)) {
          const filteredUsers = response.employeesList.filter(user => user.title !== "ROLE_ADMIN");
          setUsers(filteredUsers);
        } else {
          throw new Error("Invalid response format: Expected 'employeesList' to be an array.");
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError("Failed to load users. Please try again.");
      }
    };
    fetchUsers();
  }, []);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="user-management-container">
      <div className="management-header">
        <h2>Faculty List</h2>
        <button onClick={() => navigate('/dashboard')} className="back-link-btn">
          ← Back to Dashboard
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Photo</th>
            <th>Course Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.employeeId}>
              <td>{user.employeeId}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>
                {user.photographPath ? (
                  <img 
                    src={user.photographPath} 
                    alt={`${user.firstName} ${user.lastName}`} 
                    className='photo'
                  />
                ) : (
                  'N/A'
                )}
              </td>
              <td>{user.facultyCourses && user.facultyCourses.length > 0 ? user.facultyCourses.map(fc => fc.course.courseCode).join(', ') : 'N/A'}</td>
              <td className="action-cell">
                <button 
                  onClick={() => navigate(`/auth/employee/${user.employeeId}`)}
                  className="action-btn view-btn"
                >
                  View
                </button>
                <button 
                  className="action-btn edit-btn"
                >
                  <Link to={`/auth/update/${user.employeeId}`}>
                    Edit
                  </Link>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagementPage;