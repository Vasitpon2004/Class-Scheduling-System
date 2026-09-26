import { useState, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function ForgotPassPage(){
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false); // false = step 1 (form), true = step 2 (ตรวจสอบอีเมล)
    
    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: เรียก API ส่งลิงก์รีเซ็ตจริงตรงนี้ (fetch/axios ไป backend)
        // ตอนนี้จำลองด้วย setTimeout ไปก่อน
        setTimeout(() => {
            setIsSent(true); // สลับไป step 2 
        }, 1000);
    };
 
    const handleResend = () => {
        // TODO: เรียก API ส่งลิงก์ซ้ำ
        console.log("ส่งอีกครั้งไปที่", email);
    };

  return(
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <h1 className="mb-15 text-center text-4xl font-bold text-blue-800">Class Scheduling System</h1>
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-md">

            {!isSent ? (
                <>
                    <h2 className="text-center text-2xl font-bold text-gray-800">ลืมรหัสผ่าน</h2>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        กรอกอีเมลที่ใช้ลงทะเบียนไว้ เราจะส่งลิงก์สำหรับตั้งค่ารหัสผ่านใหม่ไปให้</p>
                    <form className="space-y-4" onSubmit={handleSubmit}>

                        <div>
                            <label htmlFor="email" className="mt-4 mb-1 block text-sm font-medium text-gray-700">อีเมล</label>
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

                        <button
                            type="submit"
                            className="w-full mt-2 rounded-md bg-black px-4 py-2 text-white transition hover:bg-green-700 font-medium">
                            ส่งลิงก์รีเซ็ต
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                    นึกรหัสผ่านได้แล้ว? <Link to="/login" className="text-blue-600 hover:underline">เข้าสู่ระบบ</Link>
                    </p>
                </>
            ):(


                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <Mail className="text-blue-600" size={28} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        ตรวจสอบอีเมลของคุณ
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        หากอีเมลนี้มีอยู่ในระบบ เราได้ส่งลิงก์สำหรับ
                        <br />
                        ตั้งรหัสผ่านใหม่ไปให้แล้ว ลิงก์มีอายุ 15 นาที
                    </p>

                    <p className="mt-4 text-sm text-gray-600">
                        ไม่ได้รับอีเมล?
                        <button
                            type="button"
                            onClick={handleResend}
                            className="ml-2 text-blue-600 hover:underline">
                            ส่งอีกครั้ง
                        </button>
                    </p>


                    <p className="mt-4 text-center text-sm text-gray-600">
                    เอาไว้ไปหน้าตั้งรหัสใหม่เฉยๆ <Link to="/resetPass" className="text-blue-600 hover:underline">ไปหน้าตั้งรหัสใหม่</Link>
                    </p>
                </div>
            )}
        </div>
    </div>
  );
}