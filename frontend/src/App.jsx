import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* เมื่อเข้ามาหน้าแรก ให้เด้งไปหน้า login อัตโนมัติ */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* กำหนดเส้นทาง URL ให้แต่ละหน้า */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;