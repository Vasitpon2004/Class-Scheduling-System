import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const ScheduleSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State สำหรับเก็บไฟล์ตารางเรียนที่ผู้ใช้เลือก
  const [schedule, setSchedule] = React.useState<File | null>(null);

  // สมมติว่าดึงข้อมูลที่กรอกมาจากหน้าก่อนๆ (เช่น ชื่อ, รหัสนิสิต, รูป Avatar)
  const previousData = location.state || {};

  // ฟังก์ชันสำหรับตอนกดปุ่ม "สมัครสมาชิก"
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ตรงนี้ในอนาคตจะเป็นจุดที่คุณใช้รวบรวมข้อมูลทั้งหมด (previousData + Schedule)
    // แล้วยิง API ไปบันทึกลง Database
    console.log("Data to submit:", previousData);
    
    // สมมติว่าสมัครเสร็จแล้ว ให้เด้งไปหน้า Dashboard ของนิสิต
    navigate('/verify-email', { replace: true });
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
        <p className="text-sm text-gray-400 mb-6">Input your Schedule</p>

        {/* Schedule Input Box (ทำเป็นปุ่มเพื่อให้กดได้) */}
        <label 
          htmlFor="schedule-upload" 
          className="w-32 h-32 bg-[#eaddfa] rounded-[2rem] flex items-center justify-center cursor-pointer hover:bg-purple-200 transition duration-200 mb-2 overflow-hidden"
        >
          {/* ไอคอนหนังสือ (Book Icon) */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-black" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={1.2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
            />
          </svg>
          {/*Input สำหรับเลือกไฟล์ตารางเรียน */}
          <input 
            id="schedule-upload"
            type="file" 
            accept=".pdf,.doc,.docx,.jpg,.png,.csv,.xlsx" 
            className="hidden"
            onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                    setSchedule(e.target.files[0]);
                    console.log("Selected schedule file:", e.target.files[0]);
                }
            }}
          />
        </label>
        
        <p className="text-xs text-gray-400 mb-8">Click to input your Schedule</p>

        {/* Register Button */}
        <button 
          onClick={handleSubmit}
          className="w-full bg-[#1db954] text-white font-medium py-2.5 rounded-md hover:bg-green-600 transition duration-200 mb-4"
        >
          สมัครสมาชิก
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

export default ScheduleSelection;