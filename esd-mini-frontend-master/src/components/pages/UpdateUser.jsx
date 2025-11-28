import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import UserService from '../service/UserService';
import '../presentation/UpdateUser.css';
import { jwtDecode } from "jwt-decode";

function UpdateUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId } = useParams();

  const [userData, setUserData] = useState({
    employeeRefId: '',
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    photographPath: '',
    department: '',   // storing only departmentId
    role: ''  // Add role field
  });

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [actualEmployeeId, setActualEmployeeId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in again.');
          return navigate('/login');
        }

        // Decode token to check role
        try {
          const decoded = jwtDecode(token);
          const roles = decoded.roles || decoded.authorities || [];
          setIsAdmin(roles.includes("ROLE_ADMIN"));
        } catch (e) {
          console.error("Failed to decode token", e);
        }

        let response;

        // Check if we have a valid employeeId in the URL (admin editing another user)
        if (employeeId && employeeId !== 'undefined' && employeeId !== '0') {
          // Admin is editing a specific employee
          response = await UserService.getUserById(employeeId, token);
          setActualEmployeeId(parseInt(employeeId));
        } else {
          // User is editing their own profile
          response = await UserService.getCurrentUser(token);
          setActualEmployeeId(response.id);
        }

        const {
          employeeRefId,
          firstName,
          lastName,
          email,
          title,
          photographPath,
          department,
          role
        } = response;

        setUserData({
          employeeRefId: employeeRefId || '',
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          title: title || '',
          photographPath: photographPath || '',
          department: department?.departmentId || department || '',
          role: role || 'ROLE_USER'  // Default to ROLE_USER if not provided
        });

      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to load user data. Please try again.');
      }
    };

    const fetchAllCourses = async () => {
      setCoursesLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setCoursesError('Token missing. Please login.');
          return navigate('/login');
        }

        const data = await UserService.getAllCourses(token);

        if (data.courseList) {
          setCourses(data.courseList);
        } else {
          setCoursesError('Failed to load courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCoursesError('Failed to load courses.');
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchUserData();
    fetchAllCourses();
  }, [employeeId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const departments = [
    { id: 1, name: 'Computer Science' },
    { id: 2, name: 'Electronics' },
    { id: 3, name: 'Mechanical' },
    { id: 4, name: 'Civil' },
    { id: 5, name: 'Electrical' },
    { id: 6, name: 'Information Technology' },
    { id: 7, name: 'Artificial Intelligence' },
    { id: 8, name: 'Data Science' },
    { id: 9, name: 'Cyber Security' },
    { id: 10, name: 'Robotics' },
    { id: 11, name: 'Administration' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!actualEmployeeId) {
      alert('User data not loaded yet. Please wait.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Token exists (length: ' + token.length + ')' : 'NO TOKEN FOUND');

      // Only send fields that exist in the backend Employees entity
      const updatedData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        title: userData.title || '',
        role: userData.role,
        employeeId: userData.employeeRefId ? parseInt(userData.employeeRefId) : 0,
        department: userData.department
          ? { departmentId: parseInt(userData.department) }
          : null,
      };

      // Only include password if it's being changed (not empty)
      if (userData.password && userData.password.trim() !== '') {
        updatedData.password = userData.password;
      }

      console.log('Sending update data:', updatedData);
      console.log('Actual Employee ID:', actualEmployeeId);
      console.log('Department value:', userData.department);
      console.log('Selected Course:', selectedCourse);

      const updateResponse = await UserService.updateUser(actualEmployeeId, updatedData, token);
      console.log('Update response:', updateResponse);

      // If a course is selected, assign it to the employee
      if (selectedCourse && selectedCourse.trim() !== '') {
        try {
          // Find the course object to get its code
          const selectedCourseObj = courses.find(c => c.id === parseInt(selectedCourse));
          console.log('Selected course object:', selectedCourseObj);

          if (selectedCourseObj && selectedCourseObj.courseCode) {
            console.log('Assigning course:', selectedCourseObj.courseCode, 'to employee ID:', actualEmployeeId);
            const courseResponse = await UserService.assignCourse(
              actualEmployeeId,
              selectedCourseObj.courseCode,
              token
            );
            console.log('Course assignment response:', courseResponse);
          } else {
            console.error('Course object not found or missing courseCode');
          }
        } catch (courseError) {
          console.error('Error assigning course:', courseError);
          console.error('Course error details:', courseError.response ? courseError.response.data : courseError.message);
          alert('Employee updated but course assignment failed: ' + (courseError.response ? courseError.response.data.message : courseError.message));
          return;
        }
      }

      alert('User details updated successfully!');

      // Check if we came from profile page
      if (location.state?.from === 'profile') {
        navigate('/dashboard/profile');
      } else {
        navigate('/auth/user-management');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      alert('Failed to update. Try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Modify Faculty Details</h2>
      <form onSubmit={handleSubmit}>
        {isAdmin && (
          <>
            <div className="form-group">
              <label>Employee Id:</label>
              <input
                type="text"
                name="employeeRefId"
                value={userData.employeeRefId}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Department:</label>
              <select
                name="department"
                value={userData.department}
                onChange={handleInputChange}
              >
                <option key="dept-default" value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label>First Name:</label>
          <input type="text" name="firstName" value={userData.firstName} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" name="lastName" value={userData.lastName} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={userData.email} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Course:</label>
          <select value={selectedCourse} onChange={handleCourseChange}>
            <option key="default" value="">
              {coursesLoading ? 'Loading...' : 'Select a course'}
            </option>

            {coursesError && (
              <option key="error" disabled style={{ color: 'red' }}>
                Error: {coursesError}
              </option>
            )}

            {!coursesLoading && courses.length === 0 && (
              <option key="no-courses" disabled>No courses available</option>
            )}

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseCode} - {course.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateUser;
