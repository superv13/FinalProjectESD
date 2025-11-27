import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import '../presentation/UpdateUser.css'

function UpdateUser() {
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const [userData, setUserData] = useState({
    employeeRefId: '',
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    photographPath:'',
    department:'',
    password:''
  });

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  useEffect(() => {
    const fetchUserDataById = async (employeeId) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token is missing.');
          alert('Please log in again.');
          navigate('/login');
          return;
        }
        const response = await UserService.getUserById(employeeId, token);
        const { employeeRefId, firstName, lastName, email, title, photographPath, department, password } = response.ourUsers;
        setUserData({ employeeRefId, firstName, lastName, email, title, photographPath, department, password });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    const fetchAllCourses = async () => {
      setCoursesLoading(true);
      setCoursesError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token is missing.');
          setCoursesError('Token is missing. Please log in again.');
          navigate('/login');
          return;
        }
        const response = await fetch('http://localhost:8080/auth/courses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        console.log('Courses API Response:', data);
  
        if (data.statusCode === 200) {
          console.log('Courses loaded:', data.courseList);
          setCourses(data.courseList || []);
        } else {
          console.error('Error from API:', data.message);
          setCoursesError(data.message || 'Failed to load courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCoursesError('Failed to load courses. Check console for details.');
      } finally {
        setCoursesLoading(false);
      }
    };
  
    if (employeeId) {
      fetchUserDataById(employeeId);
    }
    fetchAllCourses();
  }, [employeeId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value
    }));
  };

  const handleCourseChange = (e) => {
    const selectedId = e.target.value;
    setSelectedCourse(selectedId);
    console.log("Selected course ID: ", selectedId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Selected course ID before submit:", selectedCourse);
      const token = localStorage.getItem('token');
      const updatedData = { ...userData, courseId: selectedCourse };
      console.log("Updated Data Sent to Backend: ", updatedData);
      const response = await UserService.updateUser(employeeId, updatedData, token);
      console.log('User updated successfully:', response);
      alert('User details updated successfully!');
      navigate('/auth/user-management');
    } catch (error) {
      console.error('Error updating user details:', error);
      alert('Failed to update user details. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Modify Faculty Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Employee Id:</label>
          <input type="text" name="employeeRefId" value={userData.employeeRefId} onChange={handleInputChange} />
        </div>
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
          <label>Title:</label>
          <input type="text" name="title" value={userData.title} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Photograph File Path:</label>
          <input type="text" name="photographPath" value={userData.photographPath} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Department:</label>
          <input type="text" name="department" value={userData.department} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Course:</label>
          <select value={selectedCourse} onChange={handleCourseChange} disabled={coursesLoading}>
            <option value="">
              {coursesLoading ? 'Loading courses...' : 'Select a course'}
            </option>
            {coursesError && (
              <option disabled style={{color: 'red'}}>
                Error: {coursesError}
              </option>
            )}
            {!coursesLoading && courses.length === 0 && (
              <option disabled>No courses available</option>
            )}
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseCode} - {course.courseName || 'No name available'}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="text" name="password" value={userData.password} onChange={handleInputChange} />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateUser;