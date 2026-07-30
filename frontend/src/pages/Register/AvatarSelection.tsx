import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const AvatarSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // สมมติว่าเราดึงข้อมูลที่กรอกมาจากหน้าก่อนๆ ผ่าน state
  const previousData = location.state || {};
  
  // สร้าง state สำหรับเก็บรูปที่เลือก (ตอนนี้จำลองเป็น null ไปก่อน)
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ตรวจสอบว่าผู้ใช้มาจาก path ไหน เพื่อให้กด "ยืนยัน" แล้วไปถูกที่
    const isNisit = location.pathname.includes('nisit');
    const nextPath = isNisit ? '/schedule-selection' : '/schedule-selection';

    // ส่งข้อมูลทั้งหมด (ข้อมูลเดิม + รูป) ไปหน้าต่อไป
    navigate(nextPath, { 
      state: { ...previousData, avatar: avatar } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-16 font-sans">
      {/* Header */}
      <h1 className="text-3xl font-bold text-blue-900 mb-8">
        Class Scheduling System
      </h1>

      {/* Card Container */}
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-sm flex flex-col items-center">
        <h2 className="text-2xl font-bold text-black mb-1">Register</h2>
        <p className="text-sm text-gray-400 mb-6">Choose your Avatar</p>

        {/* Avatar Upload Box */}
        <label 
          htmlFor="avatar-upload" 
          className="w-32 h-32 bg-[#eaddfa] rounded-[2rem] flex items-center justify-center cursor-pointer hover:bg-purple-200 transition duration-200 mb-2 overflow-hidden"
        >
          {/* จำลองไอคอนคน (ถ้ามีรูปจริงให้แสดงรูปแทน) */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-black" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </label>
        
        {/* Input สำหรับเลือกไฟล์ซ่อนไว้ */}
        <input 
          id="avatar-upload" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setAvatar(e.target.files[0]);
              console.log("Selected avatar file:", e.target.files[0]);
            }
          }} 
        />
        
        <p className="text-xs text-gray-400 mb-8">Click to pick your Avatar</p>

        {/* Confirm Button */}
        <button 
          onClick={handleSubmit}
          className="w-full bg-[#1db954] text-white font-medium py-2.5 rounded-md hover:bg-green-600 transition duration-200 mb-4"
        >
          ยืนยัน
        </button>

        {/* Login Link */}
        <p className="text-sm text-gray-600">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AvatarSelection;