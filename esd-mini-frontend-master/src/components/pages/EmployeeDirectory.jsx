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
    <div className="flex h-screen">

      {/* LEFT PANEL — EMPLOYEE LIST */}
      <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
        <h2 className="text-xl font-semibold p-4 border-b">Faculty List</h2>

        {employees.map((emp) => (
          <div
            key={emp.employeeId}
            className={`p-4 cursor-pointer hover:bg-gray-200 transition ${selectedEmployee?.employeeId === emp.employeeId ? "bg-gray-200" : ""
              }`}
            onClick={() => loadEmployeeDetails(emp.id)}
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

            {isAdmin && (
              <button
                onClick={() => navigate(`/auth/update/${selectedEmployee.id}`)}
                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Edit Employee
              </button>
            )}
          </>
        ) : (
          <p>Select an employee from the list.</p>
        )}
      </div>

    </div>
  );
}

export default EmployeeDirectory;
