import { useState, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage(){
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const EX_EMAIL = "admin@ku.th";
    const EX_PASS = "123456789"

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        if(email == EX_EMAIL && password == EX_PASS){
            setError('');
            navigate('/home');
        }else{
            setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
        
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <h1 className="mb-15 text-center text-4xl font-bold text-blue-800">Class Scheduling System</h1>
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
            <h2 className="text-center text-2xl font-bold text-gray-800">Login</h2>
            <p className="mt-2 text-center text-sm text-gray-500">Welcome Back!</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">อีเมล</label>
                <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="example@ku.th"
                />
            </div>

            <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">รหัสผ่าน</label>
                <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
                />
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="showPassword"
                            type="checkbox"
                            className="mr-2 h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        />
                        <label htmlFor="showPassword" className="text-sm text-gray-700">แสดงรหัสผ่าน</label>
                    </div>    
                    <Link to="/forgotPass" className="text-sm text-blue-600 hover:underline">ลืมรหัสผ่าน?</Link>
                </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
                type="submit"
                className="w-full rounded-md bg-black px-4 py-2 text-white transition hover:bg-green-700 font-medium"
            >
                เข้าสู่ระบบ
            </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
            ยังไม่มีบัญชีใช่ไหม? <Link to="/register" className="text-blue-600 hover:underline">สมัครสมาชิก</Link>
            </p>
        </div>
        </div>
    );
}
