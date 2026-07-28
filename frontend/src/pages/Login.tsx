import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleTestLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('isAuth', 'true'); // บันทึกสถานะการเข้าสู่ระบบใน localStorage
    navigate('/role-selection'); // เปลี่ยนหน้าไปยัง /role-selection
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      {/* ส่วน Header ระบบ */}
      <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
        Class Scheduling System
      </h1>

      {/* ส่วน Card ของ Form */}
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-black mb-1">Login</h2>
          <p className="text-gray-400 text-sm font-medium">Welcome Back!</p>
        </div>

        <form onSubmit={handleTestLogin} className="space-y-4">
          {/* Input: อีเมล */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Input: รหัสผ่าน */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่าน
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Checkbox: แสดงรหัสผ่าน */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-password"
              className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label htmlFor="show-password" className="ml-2 text-sm text-gray-600">
              แสดงรหัสผ่าน
            </label>
          </div>

          {/* Button: เข้าสู่ระบบ */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium mt-4"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* Link: สมัครสมาชิก */}
        <p className="text-center text-sm text-gray-600 mt-6">
          ยังไม่มีบัญชีใช่ไหม?{' '}
          <Link to="/role-selection" className="text-blue-500 hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;