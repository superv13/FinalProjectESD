import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/auth/Login';
import FooterComponent from './components/common/Footer';
import Dashboard from './components/pages/Dashboard';
import MyProfile from './components/pages/MyProfile';
import UpdateUser from './components/pages/UpdateUser';
import UserManagementPage from './components/pages/UserManagement';
import EmployeeDetails from './components/pages/EmployeeDetails';

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<MyProfile />} />
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