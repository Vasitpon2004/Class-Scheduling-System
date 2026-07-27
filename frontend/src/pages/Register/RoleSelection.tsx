import React from 'react';
import { useNavigate } from 'react-router-dom';


const RoleSelection = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      {/* ส่วน Header ระบบ */}
      <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
        Class Scheduling System
      </h1>

      {/* ส่วน Card หลัก */}
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md border border-gray-200">
        <h2 className="text-xl md:text-2xl font-bold text-black mb-6 text-center">
          Pick your Role
        </h2>

        {/* ส่วนปุ่มเลือก Role */}
        <div className="flex gap-4 mb-8">
          {/* ปุ่ม NISIT (นักศึกษา) */}
          <button 
            className="flex-1 h-56 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center"
            onClick={() => navigate('/register/nisit')}
          >
            NISIT
          </button>

          {/* ปุ่ม PROFESSOR (อาจารย์) */}
          <button 
            className="flex-1 h-56 bg-violet-500 hover:bg-violet-600 text-white font-bold text-lg rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center"
            onClick={() => navigate('/register/professor')}
          >
            PROFESSOR
          </button>
        </div>

        {/* Link: สมัครสมาชิก */}
        <p className="text-center text-xs text-gray-500 font-medium mt-4">
          มีบัญชีอยู่เเล้ว?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            เข้าสู่ระบบ
          </a>
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;