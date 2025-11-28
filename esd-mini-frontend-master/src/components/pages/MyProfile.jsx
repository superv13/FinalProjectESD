import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';

function MyProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [photo, setPhoto] = useState(null);

  // Gemini AI States
  const apiKey = ""; // Runtime provided key
  const [aiBio, setAiBio] = useState("");
  const [loadingBio, setLoadingBio] = useState(false);
  const [courseInsights, setCourseInsights] = useState({}); // Map: courseId -> text
  const [loadingCourseId, setLoadingCourseId] = useState(null);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       if (!token) {
  //         navigate('/');
  //         return;
  //       }
  //       // Backend: GET /api/employees/profile
  //       const response = await fetch('http://localhost:8081/api/employees/profile', {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       const data = await response.json();

  //       if (data && data.id) {
  //         setProfile(data);
  //         // Fetch courses for this employee
  //         const coursesResponse = await fetch(`http://localhost:8081/api/employees/${data.id}/courses`, {
  //           headers: { Authorization: `Bearer ${token}` }
  //         });
  //         const coursesData = await coursesResponse.json();
  //         setCourses(Array.isArray(coursesData) ? coursesData : []);
  //       }
  //     } catch (err) {
  //       setError('Failed to load profile');
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProfile();
  // }, [navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        // FIX: Use backend /me endpoint through UserService
        const data = await UserService.getCurrentUser(token);
        setProfile(data);

        // Fetch courses
        const coursesData = await UserService.getCoursesByEmployeeId(data.employeeId, token);
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (err) {
        setError("Failed to load profile");
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

  // --- Gemini AI Functions ---

  const callGemini = async (prompt) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate content.";
    } catch (e) {
      console.error("Gemini API Error:", e);
      return "Error connecting to AI service.";
    }
  };

  const handleGenerateBio = async () => {
    if (!profile) return;
    setLoadingBio(true);
    const role = profile.title === 'ROLE_ADMIN' ? 'Administrator' : 'Professor';
    const prompt = `Write a professional, welcoming biography (approx 80 words) for a university faculty member named ${profile.firstName} ${profile.lastName}. They are a ${role} in the ${profile.departmentName} department. Focus on their dedication to education.`;

    const text = await callGemini(prompt);
    setAiBio(text);
    setLoadingBio(false);
  };

  const handleGenerateSyllabus = async (courseId, courseCode, courseName) => {
    setLoadingCourseId(courseId);
    const prompt = `Generate 3 brief, engaging bullet points summarizing the key learning outcomes for a university course titled "${courseName}" (${courseCode}). Format with plain text bullets.`;

    const text = await callGemini(prompt);
    setCourseInsights(prev => ({ ...prev, [courseId]: text }));
    setLoadingCourseId(null);
  };

  // --- End Gemini AI Functions ---

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  return (
    <>
      <style>{`
        /* MyProfile.css embedded */
        :root {
          --primary-color: #4f46e5;
          --primary-hover: #4338ca;
          --bg-color: #f3f4f6;
          --card-bg: #ffffff;
          --text-main: #111827;
          --text-muted: #6b7280;
          --border-color: #e5e7eb;
        }

        .profile-container {
          min-height: 100vh;
          background-color: var(--bg-color);
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .back-btn {
          align-self: flex-start;
          margin-bottom: 20px;
          margin-left: max(0px, calc(50% - 400px));
          background: none;
          border: none;
          color: var(--text-muted);
          font-weight: 600;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background-color: white;
          color: var(--primary-color);
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .profile-card {
          width: 100%;
          max-width: 800px;
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          padding: 40px;
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h1 {
          margin-top: 0;
          font-size: 24px;
          color: var(--text-main);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .profile-content {
          display: flex;
          gap: 40px;
          margin-bottom: 40px;
        }

        @media (max-width: 640px) {
          .profile-content {
            flex-direction: column;
            align-items: center;
          }
        }

        .photo-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          min-width: 160px;
        }

        .profile-photo {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          background-color: #e5e7eb;
        }

        .upload-photo-btn {
          font-size: 13px;
          color: var(--primary-color);
          font-weight: 500;
          cursor: pointer;
          padding: 8px 16px;
          border: 1px solid #e0e7ff;
          border-radius: 20px;
          background-color: #eef2ff;
          transition: all 0.2s;
        }

        .upload-photo-btn:hover {
          background-color: #e0e7ff;
        }

        .profile-info {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .info-field {
          background-color: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .info-field label {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 4px;
          font-weight: 600;
        }

        .info-field p {
          margin: 0;
          color: var(--text-main);
          font-weight: 500;
          font-size: 16px;
        }

        .courses-section {
          margin-top: 40px;
        }

        .courses-section h2 {
          font-size: 18px;
          color: var(--text-main);
          margin-bottom: 16px;
        }

        .courses-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 12px;
        }

        .courses-list li {
          background-color: white;
          border: 1px solid var(--border-color);
          padding: 16px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          border-left: 4px solid var(--primary-color);
          transition: transform 0.1s;
        }

        .courses-list li:hover {
          transform: translateX(4px);
          border-color: #cbd5e1;
        }

        .course-header {
            display: flex;
            align-items: center;
            width: 100%;
        }

        .courses-list strong {
          margin-right: 10px;
          color: var(--primary-color);
          font-family: monospace;
          font-size: 14px;
          background: #eef2ff;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .spacer { flex: 1; }

        .error-message {
          background-color: #fef2f2;
          color: #991b1b;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #fecaca;
          text-align: center;
        }

        /* AI Feature Styles */
        .ai-btn {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
        }
        .ai-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .ai-btn:disabled { opacity: 0.7; cursor: wait; transform: none; }
        
        .ai-btn-sm {
            padding: 4px 10px;
            font-size: 11px;
        }

        .ai-result-box {
          margin-top: 15px;
          padding: 15px;
          background-color: #f0fdfa; /* Teal-50 */
          border: 1px solid #ccfbf1;
          border-radius: 8px;
          font-size: 14px;
          color: #115e59;
          line-height: 1.6;
          animation: fadeIn 0.5s;
          width: 100%;
        }

        .ai-course-box {
          margin-top: 10px;
          padding: 12px;
          background-color: #f5f3ff; /* Violet-50 */
          border-left: 3px solid #8b5cf6;
          font-size: 13px;
          color: #4c1d95;
          white-space: pre-wrap;
          width: 100%;
          border-radius: 0 4px 4px 0;
          animation: fadeIn 0.3s;
        }
      `}</style>

      <div className="profile-container">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>

        <div className="profile-card">
          <h1>My Profile</h1>

          {error && <div className="error-message">{error}</div>}

          {profile && (
            <div className="profile-content">
              {/* Photo Section */}
              <div className="photo-section">
                {profile.photographPath ? (
                  <img src={profile.photographPath} alt="Profile" className="profile-photo" />
                ) : (
                  <div className="profile-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>No Photo</div>
                )}
                <label className="upload-photo-btn">
                  Change Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
                </label>
              </div>

              {/* Profile Info */}
              <div className="profile-info">
                <div className="info-field">
                  <label>Name</label>
                  <p>{`${profile.firstName || ''} ${profile.lastName || ''}`}</p>
                </div>
                <div className="info-field">
                  <label>Email</label>
                  <p>{profile.email}</p>
                </div>
                <div className="info-field">
                  <label>Department</label>
                  <p>{profile.departmentName || 'N/A'}</p>
                </div>
                <div className="info-field">
                  <label>Title</label>
                  <p>
                    {profile.title === 'ROLE_ADMIN' ? 'Administrator' : 'Professor'}
                  </p>
                </div>

                {/* AI Bio Generator Feature */}
                <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                  {!aiBio ? (
                    <button
                      onClick={handleGenerateBio}
                      disabled={loadingBio}
                      className="ai-btn"
                    >
                      {loadingBio ? '✨ Drafting...' : '✨ Generate Professional Bio'}
                    </button>
                  ) : (
                    <div className="ai-result-box">
                      <strong>Professional Bio (AI Generated):</strong><br />
                      {aiBio}
                      <div style={{ marginTop: '8px', fontSize: '11px', textAlign: 'right' }}>
                        <button onClick={() => setAiBio('')} style={{ background: 'none', border: 'none', color: '#0f766e', cursor: 'pointer', textDecoration: 'underline' }}>Clear</button>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '20px', textAlign: 'center' }}>
                  <button
                    onClick={() => navigate(`/auth/update/${profile.id}`, { state: { from: 'profile' } })}
                    className="ai-btn"
                    style={{ fontSize: '14px', padding: '10px 20px' }}
                  >
                    ✏️ Edit Profile
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Courses Section */}
          <div className="courses-section">
            <h2>Assigned Courses</h2>
            {courses.length > 0 ? (
              <ul className="courses-list">
                {courses.map((course) => (
                  <li key={course.id}>
                    <div className="course-header">
                      <strong>{course.courseCode}</strong>
                      <span>{course.name || 'No name'}</span>
                      <div className="spacer"></div>
                      <button
                        onClick={() => handleGenerateSyllabus(course.id, course.courseCode, course.name)}
                        className="ai-btn ai-btn-sm"
                        disabled={loadingCourseId === course.id}
                      >
                        {loadingCourseId === course.id ? '✨ Thinking...' : '✨ Syllabus Insight'}
                      </button>
                    </div>

                    {/* AI Course Insight Result */}
                    {courseInsights[course.id] && (
                      <div className="ai-course-box">
                        <strong>AI Suggested Learning Outcomes:</strong>
                        <div style={{ marginTop: '4px' }}>{courseInsights[course.id]}</div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No courses currently assigned.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MyProfile;