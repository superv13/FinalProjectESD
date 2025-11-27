import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../presentation/EmployeeDetails.css';

function EmployeeDetails() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        // Fetch employee details
        const response = await fetch(`http://localhost:8081/api/employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        console.log('Fetched employee:', data); // Debug log
        setEmployee(data);

        // Fetch assigned courses
        const coursesResponse = await fetch(`http://localhost:8081/api/employees/${employeeId}/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const coursesData = await coursesResponse.json();
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (err) {
        setError('Failed to load employee details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    

    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId, navigate]);

  if (loading) return <div className="details-container"><p>Loading...</p></div>;
  if (error) return <div className="details-container error-message">{error}</div>;

  return (
    <div className="details-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back to List</button>

      {employee && (
        <div className="details-card">
          <div className="details-header">
            {employee.photographPath && (
              <img
                src={
                  employee.photographPath?.startsWith("http")
                    ? employee.photographPath
                    : `http://localhost:8081/images/${employee.photographPath}`
                }
                alt={`${employee.firstName} ${employee.lastName}`}
                className="details-photo"
              />
            )}
            <div className="details-title">
              <h1>{`${employee.firstName} ${employee.lastName}`}</h1>
              <p className="role">{employee.title}</p>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-field">
              <label>Email</label>
              <p>{employee.email}</p>
            </div>
            <div className="detail-field">
              <label>Department</label>
              <p>{employee.departmentName || 'N/A'}</p> {/* ✅ Display department name */}
            </div>
            <div className="detail-field">
              <label>Employee ID</label>
              <p>{employee.employeeId}</p>
            </div>
            <div className="detail-field">
              <label>Role</label>
              <p>{employee.role || 'Faculty'}</p>
            </div>
          </div>

          <div className="courses-section">
            <h2>Assigned Courses</h2>
            {courses.length > 0 ? (
              <div className="courses-grid">
                {courses.map((course) => (
                  <div key={course.courseId} className="course-card">
                    <h3>{course.courseCode}</h3>
                    <p>{course.courseName || 'Course'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No courses assigned</p>
            )}
          </div>

          <div className="actions">
            <button 
              onClick={() => navigate(`/auth/update/${employeeId}`)} 
              className="action-btn edit-btn"
            >
              Edit Employee
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDetails;
