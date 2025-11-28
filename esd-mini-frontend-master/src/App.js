import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/auth/Login';
import FooterComponent from './components/common/Footer';
import Dashboard from './components/pages/Dashboard';
import MyProfile from './components/pages/MyProfile';
import UpdateUser from './components/pages/UpdateUser';
import UserManagementPage from './components/pages/UserManagement';
import EmployeeDetails from './components/pages/EmployeeDetails';
import EmployeeDirectory from "./components/pages/EmployeeDirectory";
import CourseList from "./components/pages/CourseList";


import OAuth2Redirect from "./components/auth/Oauth2redirect";

function App() {

  return (
    <BrowserRouter>
      <div className="App flex flex-col min-h-screen">
        <div className="content flex-grow">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<MyProfile />} />
            <Route path="/employees" element={<EmployeeDirectory />} />
            <Route path="/dashboard/courses" element={<CourseList />} />
            <Route path="/employees" element={<EmployeeDirectory />} />
            <Route path="/employees/:employeeId" element={<EmployeeDetails />} />
            <Route path="/auth/user-management" element={<UserManagementPage />} />
            <Route path="/auth/employee/:employeeId" element={<EmployeeDetails />} />
            <Route path="/auth/update/:employeeId" element={<UpdateUser />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;