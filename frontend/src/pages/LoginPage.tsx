import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  // 1. State เก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 2. ฟังก์ชันอัปเดตค่าเมื่อพิมพ์
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. ฟังก์ชันตรวจสอบการ Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรช
    setErrorMessage(''); 

    try {
      // ยิงข้อมูลไปที่ API หลังบ้าน (เดี๋ยวเราต้องไปสร้างตัวนี้ที่ NestJS กันครับ)
      const response = await axios.post('http://localhost:3000/auth/login', formData);
      
      // ถ้าสำเร็จ (รหัสผ่านถูกต้อง)
      alert('เข้าสู่ระบบสำเร็จ!');
      
      // ในอนาคตเราจะเอา Token (JWT) ที่ได้มาไปเก็บใน localStorage ตรงนี้ครับ
      // localStorage.setItem('token', response.data.accessToken);

      navigate('/home'); // สั่งย้ายไปหน้า Home
    } catch (error: any) {
      // ถ้า Error (เช่น รหัสผ่านผิด หรือไม่พบอีเมล)
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-15 text-center text-4xl font-bold text-blue-800">Class Scheduling System</h1>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-800">Login</h2>
        <p className="mt-2 text-center text-sm text-gray-300">Welcome Back!</p>
        
        {/* แสดงข้อความ Error ตรงนี้ถ้า Login ไม่ผ่าน */}
        {errorMessage && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
            {errorMessage}
          </div>
        )}

        {/* 🛠️ ผูก onSubmit ไว้กับ form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">อีเมล</label>
            <input 
              type="email" 
              name="email" // 🛠️ เติม name, value, onChange
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="example@ku.th"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">รหัสผ่าน</label>
            <input 
              type={showPassword ? "text" : "password"}
              name="password" // 🛠️ เติม name, value, onChange
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
            <div className="mt-2 flex items-center">
              <input 
                type="checkbox" 
                className="mr-2 h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label className="text-sm text-gray-700">แสดงรหัสผ่าน</label>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 font-medium"
          >
            เข้าสู่ระบบ
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          ยังไม่มีบัญชีใช่ไหม? <a href="/register" className="text-blue-600 hover:underline">สมัครสมาชิก</a>
        </p>
      </div>
    </div>
  );
}