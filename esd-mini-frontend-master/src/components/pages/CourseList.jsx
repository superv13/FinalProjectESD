import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';

function CourseList() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const response = await UserService.getAllCourses(token);
                // The backend returns a CourseReqRes object with a courseList field
                const courseList = response.courseList || [];
                setCourses(courseList);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError('Failed to load courses.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-red-600 font-semibold">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                                        {course.code || 'COURSE'}
                                    </span>
                                    <span className="text-gray-500 text-sm">{course.credits} Credits</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
                                <p className="text-gray-600 text-sm line-clamp-3">
                                    {course.description || 'No description available.'}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No courses found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseList;
