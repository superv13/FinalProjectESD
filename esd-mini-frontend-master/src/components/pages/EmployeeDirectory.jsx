import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../presentation/EmployeeDetails.css"; // keep your existing CSS for styling photo/cards

function EmployeeDirectory() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load employees list on mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await fetch("http://localhost:8081/api/employees/all", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        setEmployees(data);

        // Auto-select the first employee
        if (data.length > 0) {
          loadEmployeeDetails(data[0].employeeId);
        }

      } catch (err) {
        console.error(err);
        setError("Unable to load employees.");
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [navigate]);

  // Load Employee Details + Courses
  const loadEmployeeDetails = async (employeeId) => {
    try {
      const token = localStorage.getItem("token");

      // Fetch employee
      const response = await fetch(`http://localhost:8081/api/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      setSelectedEmployee(data);

      // Fetch courses
      const courseRes = await fetch(
        `http://localhost:8081/api/employees/${employeeId}/courses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const courseData = await courseRes.json();
      setCourses(Array.isArray(courseData) ? courseData : []);

    } catch (err) {
      console.error(err);
      setError("Failed to load employee details.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="flex h-screen">

      {/* LEFT PANEL — EMPLOYEE LIST */}
      <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
        <h2 className="text-xl font-semibold p-4 border-b">Faculty List</h2>

        {employees.map((emp) => (
          <div
            key={emp.employeeId}
            className={`p-4 cursor-pointer hover:bg-gray-200 transition ${
              selectedEmployee?.employeeId === emp.employeeId ? "bg-gray-200" : ""
            }`}
            onClick={() => loadEmployeeDetails(emp.employeeId)}
          >
            <h3 className="font-medium">{emp.firstName} {emp.lastName}</h3>
            <p className="text-sm text-gray-600">{emp.title}</p>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL — EMPLOYEE DETAILS */}
      <div className="w-2/3 p-6 overflow-y-auto">
        {selectedEmployee ? (
          <>
            <div className="flex items-center gap-4 mb-6">
              {selectedEmployee.photographPath && (
                <img
                  src={
                    selectedEmployee.photographPath.startsWith("http")
                      ? selectedEmployee.photographPath
                      : `http://localhost:8081/images/${selectedEmployee.photographPath}`
                  }
                  className="w-24 h-24 rounded-full object-cover border"
                  alt="employee"
                />
              )}

              <div>
                <h1 className="text-2xl font-bold">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h1>
                <p className="text-gray-600">{selectedEmployee.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-gray-500">Email</label>
                <p>{selectedEmployee.email}</p>
              </div>

              <div>
                <label className="text-gray-500">Department</label>
                <p>{selectedEmployee.departmentName}</p>
              </div>

              <div>
                <label className="text-gray-500">Employee ID</label>
                <p>{selectedEmployee.employeeId}</p>
              </div>

              <div>
                <label className="text-gray-500">Role</label>
                <p>{selectedEmployee.role || "Faculty"}</p>
              </div>
            </div>

            {/* Courses */}
            <h2 className="text-xl font-semibold mb-3">Assigned Courses</h2>
            <div className="grid grid-cols-2 gap-4">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div key={course.courseId} className="p-4 border rounded-lg bg-gray-100">
                    <h3 className="font-semibold">{course.courseCode}</h3>
                    <p className="text-gray-700">{course.courseName}</p>
                  </div>
                ))
              ) : (
                <p>No courses assigned</p>
              )}
            </div>

            <button
              onClick={() => navigate(`/auth/update/${selectedEmployee.employeeId}`)}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Edit Employee
            </button>
          </>
        ) : (
          <p>Select an employee from the list.</p>
        )}
      </div>

    </div>
  );
}

export default EmployeeDirectory;
