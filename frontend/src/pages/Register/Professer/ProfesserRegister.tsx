import React from 'react';
import { Link } from 'react-router-dom';

const ProfessorRegister = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      {/* ส่วน Header ระบบ */}
      <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
        Class Scheduling System
      </h1>

      {/* ส่วน Card ของ Form */}
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-black mb-1">Register</h2>
          <p className="text-gray-400 text-sm font-medium">Hi! Welcome</p>
        </div>

        <form className="space-y-4">
          {/* แถวที่ 1: ชื่อ และ นามสกุล (แบ่งครึ่งซ้ายขวา) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                นามสกุล
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Input: รหัสประจำตัวอาจารย์ (จุดที่ต่างจากฝั่งนิสิต) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสประจำตัวอาจารย์
            </label>
            <input
              type="text"
              placeholder="Q1234"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 placeholder-gray-300"
            />
          </div>

          {/* Input: อีเมล */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              placeholder="example@ku.th"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 placeholder-gray-300"
            />
          </div>

          {/* Input: รหัสผ่าน */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่าน
            </label>
            <input
              type="password"
              placeholder="********"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 placeholder-gray-300"
            />
          </div>

          {/* Button: ยืนยัน */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors duration-200 font-medium mt-6"
          >
            ยืนยัน
          </button>
        </form>

        {/* Link: กลับไปหน้า Login */}
        <p className="text-center text-sm text-gray-600 mt-6">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ProfessorRegister;