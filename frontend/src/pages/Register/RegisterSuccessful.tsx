import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterSuccessful = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    // เมื่อกดยืนยัน ให้พากลับไปที่หน้า Login
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-16 font-sans p-4">
      {/* Header */}
      <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">
        Class Scheduling System
      </h1>

      {/* Card Container */}
      <div className="bg-white px-8 py-10 rounded-lg shadow-sm w-full max-w-md flex flex-col items-center border border-gray-100">
        
        <h2 className="text-2xl font-bold text-black mb-2">Successful</h2>
        
        {/* ข้อความอธิบาย */}
        <p className="text-sm text-gray-400 text-center mb-10">
          โปรดกดยืนยันเพื่อกลับไปยังหน้าล็อกอิน
        </p>

        {/* ปุ่มยืนยัน */}
        <button 
          onClick={handleConfirm}
          className="w-full bg-[#1db954] text-white font-medium py-2.5 rounded-md hover:bg-green-600 transition duration-200"
        >
          ยืนยัน
        </button>
        
      </div>
    </div>
  );
};

export default RegisterSuccessful;