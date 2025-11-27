import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import '../presentation/MyProfile.css';

function MyProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }
        // Backend: GET /api/employees/profile
        const response = await fetch('http://localhost:8081/api/employees/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data && data.id) {
          setProfile(data);
          // Fetch courses for this employee
          const coursesResponse = await fetch(`http://localhost:8081/api/employees/${data.id}/courses`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const coursesData = await coursesResponse.json();
          setCourses(Array.isArray(coursesData) ? coursesData : []);
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !profile) return;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      // Backend: PUT /api/employees/auth/uploadPhoto/{userId}
      const response = await fetch(`http://localhost:8081/api/employees/auth/uploadPhoto/${profile.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        alert('Photo uploaded successfully!');
        window.location.reload();
      } else {
        setError('Failed to upload photo');
      }
    } catch (err) {
      setError('Error uploading photo');
      console.error(err);
    }
  };

  if (loading) return <div className="profile-container"><p>Loading...</p></div>;

  return (
    <div className="profile-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      
      <div className="profile-card">
        <h1>My Profile</h1>
        
        {error && <div className="error-message">{error}</div>}

        {profile && (
          <div className="profile-content">
            {/* Photo Section */}
            <div className="photo-section">
              {profile.photographPath && (
                <img src={profile.photographPath} alt="Profile" className="profile-photo" />
              )}
              <label className="upload-photo-btn">
                Upload Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
              </label>
            </div>

            {/* Profile Info */}
            <div className="profile-info">
              <div className="info-field">
                <label>Name:</label>
                <p>{`${profile.firstName || ''} ${profile.lastName || ''}`}</p>
              </div>
              <div className="info-field">
                <label>Email:</label>
                <p>{profile.email}</p>
              </div>
              <div className="info-field">
                <label>Department:</label>
                <p>{profile.department || 'N/A'}</p>
              </div>
              <div className="info-field">
                <label>Title:</label>
                <p>{profile.title || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Courses Section */}
        <div className="courses-section">
          <h2>My Courses</h2>
          {courses.length > 0 ? (
            <ul className="courses-list">
              {courses.map((course) => (
                <li key={course.courseId}>
                  <strong>{course.courseCode}</strong> - {course.courseName || 'No name'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No courses assigned</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
