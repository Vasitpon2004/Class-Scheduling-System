import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ForgotPassPage from './pages/ForgotPassPage';
import ResetPassPage from './pages/ResetPassPage';

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        {/* เข้ามาหน้าแรก เด้งไปหน้า login อัตโนมัติ */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* เส้นทาง URL ให้แต่ละหน้า */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgotPass" element={<ForgotPassPage />} />
        <Route path="/resetPass" element={<ResetPassPage />} />

      </Routes>
    </BrowserRouter>
  )
}

