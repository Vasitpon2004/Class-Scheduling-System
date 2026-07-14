import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function RegisterPage() {
  const navigate = useNavigate();
  //1. สร้าง state สำหรับเก็บค่าข้อมูลที่พิมพ์เข้ามา
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  //2. Function update state เมื่อมีการพิมพ์ข้อมูล
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //3. Funtion ส่งข้อมูลไปยัง backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //ป้องกันหน้าเว็บรีเฟรช
    console.log('Submitting form data:', formData); // Debug: ตรวจสอบค่าที่ส่งไป
    setErrorMessage(''); // ล้างข้อความแสดงข้อผิดพลาดก่อนส่งข้อมูล
    try {
      //ใช้ axios ส่งข้อมูลไปยัง backend
      await axios.post('http://localhost:3000/auth/register', formData);
      // ถ้าสำเร็จให้เปลี่ยนหน้าไปยังหน้า login
      alert('สมัครสมาชิกสำเร็จ!');
      navigate('/login');
    } catch (error: any) {
      // ถ้าเกิดข้อผิดพลาดให้แสดงข้อความ
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }
    }
  };
return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-15 text-center text-4xl font-bold text-blue-800">Class Scheduling System</h1>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-800">Register</h2>
        <p className="mt-2 text-center text-sm text-gray-300">Hi! Welcome</p>
        
        {/* การแสดง Error Message ตรงนี้ ถ้ามี Error จะได้เห็นชัดๆ */}
        {errorMessage && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        {/* 🛠️ จุดแก้ไขที่ 1: เติม onSubmit={handleSubmit} */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="mb-1 block text-sm font-medium text-gray-700">ชื่อ</label>
              <input 
                type="text" 
                name="firstName" // 🛠️ จุดแก้ไขที่ 2: เติม name, value, onChange
                value={formData.firstName}
                onChange={handleChange}
                required // บังคับกรอก
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label className="mb-1 block text-sm font-medium text-gray-700">นามสกุล</label>
              <input 
                type="text" 
                name="lastName" // 🛠️ จุดแก้ไขที่ 2: เติม name, value, onChange
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">รหัสนักศึกษา / รหัสประจำตัวอาจารย์</label>
            <input 
              type="text" 
              // ช่องนี้ยังไม่ได้ผูกกับ Backend เลยเว้น name/value/onChange ไว้ก่อนได้ครับ
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="b6621600XXX or Q1XXX"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">อีเมล</label>
            <input 
              type="email" 
              name="email" // 🛠️ จุดแก้ไขที่ 2: เติม name, value, onChange
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
              name="password" // 🛠️ จุดแก้ไขที่ 2: เติม name, value, onChange
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
            className="w-full rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 font-medium"
          >
            สร้างบัญชี
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          มีบัญชีอยู่แล้ว? <a href="/login" className="text-blue-600 hover:underline">เข้าสู่ระบบ</a>
        </p>
      </div>
    </div>
  );
}