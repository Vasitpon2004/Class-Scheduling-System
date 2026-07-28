import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectRoute';

// Import หน้าจอที่เราสร้างไว้จากโฟลเดอร์ pages
import Login from './pages/Login';
import RoleSelection from './pages/Register/RoleSelection';
import NisitRegister from './pages/Register/Nisit/NisitRegister';
import ProfessorRegister from './pages/Register/Professer/ProfesserRegister';
import NisitInfo from './pages/Register/Nisit/NisitInfo';

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

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;