import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassPage from './pages/ForgotPassPage';
import ResetPassPage from './pages/ResetPassPage';
import StudentHomePage from './pages/student/StudentHomePage';
import ProfessorHomePage from './pages/professor/ProfessorHomePage';

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        {/* เข้ามาหน้าแรก เด้งไปหน้า login อัตโนมัติ */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* เส้นทาง URL ให้แต่ละหน้า */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotPass" element={<ForgotPassPage />} />
        <Route path="/resetPass" element={<ResetPassPage />} />
        <Route path="/studentHome" element={<StudentHomePage />} />
        <Route path="/professorHome" element={<ProfessorHomePage />} />

      </Routes>
    </BrowserRouter>
  )
}

