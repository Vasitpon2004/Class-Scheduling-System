import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import หน้าจอที่เราสร้างไว้จากโฟลเดอร์ pages
import Login from './pages/Login';
import RoleSelection from './pages/Register/RoleSelection';
import NisitRegister from './pages/Register/Nisit/NisitRegister';
import ProfessorRegister from './pages/Register/Professer/ProfesserRegister';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ให้หน้าแรก (/) เด้งไปที่หน้า /login อัตโนมัติ */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* กำหนดเส้นทาง URL ให้แต่ละหน้า */}
        <Route path="/login" element={<Login />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/register/nisit" element={<NisitRegister />} />
        <Route path="/register/professor" element={<ProfessorRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;