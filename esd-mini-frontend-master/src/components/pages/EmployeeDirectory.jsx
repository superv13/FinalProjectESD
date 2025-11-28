import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../presentation/EmployeeDetails.css"; // keep your existing CSS for styling photo/cards
import { jwtDecode } from "jwt-decode";

function EmployeeDirectory() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Load employees list on mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) {
          navigate("/");
          return;
        }

        // Check for admin role
        try {
          const decoded = jwtDecode(token);
          const roles = decoded.roles || [];
          setIsAdmin(roles.includes("ROLE_ADMIN"));
        } catch (e) {
          console.error("Failed to decode token", e);
        }

        const response = await fetch("http://localhost:8081/api/employees/all", {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Response Status:", response.status);

        if (!response.ok) {
          console.error("Response not OK:", response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Data:", data);

        const employeeList = data.employeesList || [];
        console.log("Extracted Employee List:", employeeList);

        setEmployees(employeeList);

        // Auto-select the first employee
        if (employeeList.length > 0) {
          loadEmployeeDetails(employeeList[0].id);
        }

      } catch (err) {
        console.error("Error loading employees:", err);
        setError("Unable to load employees.");
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [navigate]);

  // Load Employee Details + Courses
  const loadEmployeeDetails = async (id) => {
    try {
      console.log("Loading details for Employee PK ID:", id);
      const token = localStorage.getItem("token");

      // 1. Fetch employee using Primary Key (id)
      const empUrl = `http://localhost:8081/api/employees/${id}`;
      console.log("Fetching Employee URL:", empUrl);

      const response = await fetch(empUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch employee: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Employee Details Data:", data);
      setSelectedEmployee(data);

      // 2. Fetch courses using Business Key (employeeId) from the response
      // The backend expects the 'employeeId' field (e.g. 12345), not the PK 'id' (e.g. 1)
      const businessId = data.employeeId;
      console.log("Using Business ID for courses:", businessId);

      const courseUrl = `http://localhost:8081/api/employees/${businessId}/courses`;
      console.log("Fetching Courses URL:", courseUrl);

      const courseRes = await fetch(courseUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!courseRes.ok) {
        throw new Error(`Failed to fetch courses: ${courseRes.status} ${courseRes.statusText}`);
      }

      const courseData = await courseRes.json();
      console.log("Courses Data:", courseData);
      setCourses(Array.isArray(courseData) ? courseData : []);

    } catch (err) {
      console.error("Error in loadEmployeeDetails:", err);
      alert("Failed to load details for this employee. Check console for errors.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">

      {/* LEFT PANEL — EMPLOYEE LIST */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-indigo-600">👥</span> Faculty List
          </h2>
          <p className="text-xs text-gray-500 mt-1">Select an employee to view details</p>
        </div>

        <div className="overflow-y-auto flex-1 p-3 space-y-1">
          {employees.map((emp) => {
            const isSelected = selectedEmployee?.employeeId === emp.employeeId;
            return (
              <div
                key={emp.employeeId}
                onClick={() => loadEmployeeDetails(emp.id)}
                className={`
                  group p-4 rounded-xl cursor-pointer transition-all duration-200 ease-in-out border
                  ${isSelected
                    ? "bg-indigo-50 border-indigo-200 shadow-sm"
                    : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                  }
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold text-sm ${isSelected ? "text-indigo-900" : "text-gray-700 group-hover:text-gray-900"}`}>
                    {emp.firstName} {emp.lastName}
                  </h3>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
                </div>
                <p className={`text-xs ${isSelected ? "text-indigo-600 font-medium" : "text-gray-500"}`}>
                  {emp.title || 'Faculty Member'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL — EMPLOYEE DETAILS */}
      <div className="flex-1 overflow-y-auto p-8">
        {selectedEmployee ? (
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header/Banner */}
              <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

              <div className="px-8 pb-8 relative">
                <div className="flex flex-col md:flex-row gap-6 items-start">

                  {/* Avatar - overlapping banner */}
                  <div className="-mt-16 relative">
                    <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-md bg-white overflow-hidden">
                      {selectedEmployee.photographPath ? (
                        <img
                          src={selectedEmployee.photographPath}
                          alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + selectedEmployee.firstName + "+" + selectedEmployee.lastName + "&background=random"; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-3xl font-bold">
                          {selectedEmployee.firstName?.charAt(0)}{selectedEmployee.lastName?.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div className="pt-4 flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                        {selectedEmployee.title || 'Faculty'}
                      </span>
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        🏢 {selectedEmployee.departmentName || 'Department N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Edit Button (Admin only) */}
                  {isAdmin && (
                    <button
                      onClick={() => navigate(`/auth/update/${selectedEmployee.id}`)}
                      className="mt-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm flex items-center gap-2"
                    >
                      ✏️ Edit Profile
                    </button>
                  )}
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-100">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                    <p className="text-gray-700 font-medium flex items-center gap-2">
                      ✉️ {selectedEmployee.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee ID</label>
                    <p className="text-gray-700 font-medium font-mono bg-gray-50 inline-block px-2 py-1 rounded">
                      #{selectedEmployee.employeeId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-purple-600">📚</span> Assigned Courses
              </h2>

              {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <div key={course.id} className="group p-5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded uppercase tracking-wide">
                          {course.courseCode}
                        </span>
                        {course.credits && (
                          <span className="text-xs text-gray-400 font-medium">{course.credits} Credits</span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                        {course.name}
                      </h3>
                      {course.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">No courses currently assigned.</p>
                </div>
              )}
            </div>

            {isAdmin && (
              <button
                onClick={() => navigate(`/auth/update/${selectedEmployee.id}`)}
                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Edit Employee
              </button>
            )}
          </div>
        ) : (
          <p>Select an employee from the list.</p>
        )}
      </div>

    </div>
  );
}

export default EmployeeDirectory;
