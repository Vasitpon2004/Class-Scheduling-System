import React, { useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // รับข้อมูล state ที่ส่งมาจากหน้าก่อนหน้า (เช่น อีเมลที่เพิ่งกรอกไป)
  const previousData = location.state || {};
  // ถ้าไม่มีอีเมลส่งมา จะแสดงเป็น [email.temp] ตามในภาพ
  const userEmail = previousData.email || '[email.temp]'; 

  // สร้าง State เก็บค่า OTP 6 ตัว
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  // ใช้ useRef เพื่ออ้างอิงถึงช่อง input แต่ละช่องสำหรับทำ Auto-focus
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ฟังก์ชันจัดการตอนพิมพ์ตัวเลข
  const handleChange = (element: HTMLInputElement, index: number) => {
    // ป้องกันไม่ให้พิมพ์ตัวอักษร (รับเฉพาะตัวเลข)
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // ถ้าพิมพ์แล้วช่องไม่ว่าง ให้เลื่อนโฟกัสไปช่องถัดไปอัตโนมัติ
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ฟังก์ชันจัดการตอนกดปุ่มลบ (Backspace)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      // ถ้าช่องปัจจุบันว่างอยู่แล้วกดลบ ให้ถอยโฟกัสกลับไปช่องก่อนหน้า
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    // ตรวจสอบว่ากรอกครบ 6 หลักหรือไม่
    if (otpValue.length < 6) {
      alert('กรุณากรอกรหัส OTP ให้ครบ 6 หลัก');
      return;
    }

    console.log("OTP ที่กรอก:", otpValue);
    console.log("ข้อมูลเก่าทั้งหมด:", previousData);


    // ส่งข้อมูลรหัสผ่านไปกับ State เผื่อต้องใช้ต่อ
    navigate('/register-successful', { 
      state: { ...previousData, otp: otpValue } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-16 font-sans p-4">
      {/* Header */}
      <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">
        Class Scheduling System
      </h1>

      {/* Card Container */}
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md flex flex-col items-center border border-gray-100">
        <h2 className="text-2xl font-bold text-black mb-2">Verify Email</h2>
        
        {/* ข้อความแจ้งเตือน */}
        <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
          เราได้ส่งรหัสยืนยัน 6 หลักไปที่อีเมล:<br/>
          <span className="font-medium text-gray-600">{userEmail}</span><br/>
          โปรดตรวจสอบและกรอกรหัสด้านล่างเพื่อดำเนินการต่อ
        </p>

        {/* ช่องกรอก OTP 6 ช่อง */}
        <div className="flex gap-2 md:gap-3 justify-center mb-6 w-full">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              name="otp"
              maxLength={1}
              className="w-10 h-12 md:w-12 md:h-14 border border-gray-400 rounded-lg text-center text-xl font-semibold text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              value={data}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              ref={el => {
                inputRefs.current[index] = el;
              }}
            />
          ))}
        </div>

        {/* ลิงก์ส่งรหัสใหม่ */}
        <p className="text-sm text-gray-600 mb-8 flex gap-1">
          ยังไม่ได้รับรหัส?
          <button 
            onClick={() => alert('ส่งรหัสใหม่ไปยังอีเมลแล้ว!')}
            className="text-blue-500 hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            resend
          </button>
        </p>

        {/* ปุ่มยืนยันรหัส */}
        <button 
          onClick={handleSubmit}
          className="w-full bg-[#1db954] text-white font-medium py-2.5 rounded-md hover:bg-green-600 transition duration-200 mb-4"
        >
          ยืนยันรหัส
        </button>

        {/* ลิงก์เข้าสู่ระบบ */}
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

export default VerifyEmail;