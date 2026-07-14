import { useState } from 'react';
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-15 text-center text-4xl font-bold text-blue-800">Class Scheduling System</h1>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-800">Login</h2>
        <p className="mt-2 text-center text-sm text-gray-300">Welcome Back!</p>
        <form className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">อีเมล</label>
            <input 
              type="email" 
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="example@ku.th"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">รหัสผ่าน</label>
            <input 
              type={showPassword ? "text" : "password"}
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
            <a href="/home">เข้าสู่ระบบ</a>
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          ยังไม่มีบัญชีใช่ไหม? <a href="/register" className="text-blue-600 hover:underline">สมัครสมาชิก</a>
        </p>
      </div>
    </div>
  );
}