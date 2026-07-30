import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectRoute';

// Import หน้าจอที่เราสร้างไว้จากโฟลเดอร์ pages
import Login from './pages/Login';
import RoleSelection from './pages/Register/RoleSelection';
import AvatarSelection from './pages/Register/AvatarSelection';
import ScheduleSelection from './pages/Register/ScheduleSelecton';
import VerifyEmail from './pages/Register/VerifyEmail';
import RegisterSuccessful from './pages/Register/RegisterSuccessful';
// Import หน้าจอสำหรับ Nisit และ Professor
import NisitRegister from './pages/Register/Nisit/NisitRegister';
import NisitInfo from './pages/Register/Nisit/NisitInfo';
// Import หน้าจอสำหรับ Professor
import ProfessorRegister from './pages/Register/Professer/ProfessorRegister';
import ProfessorInfo from './pages/Register/Professer/ProfessorInfo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ให้หน้าแรก (/) ใครเข้าก็ได้ */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
        {/* เลือกบทบาท */}
        <Route path="/role-selection" element={<RoleSelection />} />

        {/*Nisit Routes*/}
        <Route path="/register/nisit" element={<NisitRegister />} />
        <Route path="/register/nisit/info" element={<NisitInfo />} />

        {/*Professor Routes*/}
        <Route path="/register/professor" element={<ProfessorRegister />} />
        <Route path="/register/professor/info" element={<ProfessorInfo />} />

        {/* เลือก Avatar */}
        <Route path="/avatar-selection" element={<AvatarSelection />} />
        {/* เลือกตารางเรียน */}
        <Route path="/schedule-selection" element={<ScheduleSelection />} />

        {/* Verify Email */}
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Register Successful */}
        <Route path="/register-successful" element={<RegisterSuccessful />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;