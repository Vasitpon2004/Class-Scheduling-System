import { useState, useEffect, type SubmitEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check } from 'lucide-react';

type PageState = 'checking' | 'valid' | 'expired' | 'success';

// เงื่อนไขรหัสผ่านแต่ละข้อ
const passwordRules = [
  { label: 'ความยาวมากกว่า 8 ตัวอักษร', test: (v: string) => v.length > 8 },
  { label: 'มีทั้งตัวพิมพ์เล็กและพิมพ์ใหญ่', test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: 'มีตัวเลขอย่างน้อย 1 ตัว', test: (v: string) => /[0-9]/.test(v) },
  { label: 'มีสัญลักษณ์ !@#$%^&*_ อย่างน้อย 1 ตัว', test: (v: string) => /[!@#$%^&*_]/.test(v) },
];

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [pageState, setPageState] = useState<PageState>('checking'); // step ปัจจุบัน — checking/valid/expired/success
  const [password, setPassword] = useState(''); // ค่ารหัสผ่านใหม่ที่พิมพ์
  const [confirmPassword, setConfirmPassword] = useState(''); // ค่ารหัสผ่านที่พิมพ์ยืนยันซ้ำ
  const [isSubmitting, setIsSubmitting] = useState(false); // กำลังส่ง request อยู่ไหม (กันกดซ้ำ)
  const [error, setError] = useState(''); // 	ข้อความ error ถ้า submit ไม่สำเร็จ

  // เช็คว่า token ยัง valid อยู่ไหม ตอนหน้าโหลด
  useEffect(() => {
    // TODO: เปลี่ยนเป็นเรียก backend จริง เช่น GET /api/auth/reset-password/:token/verify
    /*ตัวอย่าง 
    const verifyToken = async () => {
        try {
            const res = await fetch(`/api/auth/reset-password/${token}/verify`);
            if (!res.ok) throw new Error('invalid');
            setPageState('valid');
        } catch {
            setPageState('expired');
        }
    };*/
    
    const verifyToken = async () => {
      try {
        // จำลองเช็ค token ไปก่อน (ยังไม่ต่อ backend จริง)
        setTimeout(() => {
          setPageState('valid'); // หรือ setPageState('expired') ถ้า token หมดอายุ/ไม่ถูกต้อง
        }, 800);
      } catch {
        setPageState('expired');
      }
    };
    verifyToken();
  }, [token]);

  const allRulesPassed = passwordRules.every((rule) => rule.test(password)); // เช็คว่า password ผ่าน 4 ข้อใน ถ้าผ่าน return true
  const passwordsMatch = password.length > 0 && password === confirmPassword; // เช็คว่าเหมือนกันไหม
  const canSubmit = allRulesPassed && passwordsMatch && !isSubmitting; // รวม 3 เงื่อนไขเป็นตัวเดียว

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => { // ฟังก์ชันที่ทำงานตอน form ถูก submit
    e.preventDefault(); // กันหน้า reload, , เคลียร์ของเก่า, และบอก user ว่ากำลังทำงานอยู่
    if (!canSubmit) return; // กันข้อมูลผิด

    setError(''); // กันข้อความ error เก่าจะค้างอยู่บนจอ 
    setIsSubmitting(true); // ทำให้ canSubmit กลายเป็น false ให้ปุ่มล็อก เพื่อกันยิง request ไป backend หลายรอบ

    try {
      // TODO: เรียก backend จริง เช่น POST /api/auth/reset-password
      // body: { token, newPassword: password }
      setTimeout(() => {
        setIsSubmitting(false); // set setIsSubmitting เป็น false ปลดล็อกปุ่ม
        setPageState('success'); // เปลี่ยน pageState เป็น success
      }, 1000);
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-15 text-center text-4xl font-bold text-blue-800">
        Class Scheduling System
      </h1>

      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-md">
        {pageState === 'checking' && (
          <p className="text-center text-sm text-gray-500">กำลังตรวจสอบลิงก์...</p>
        )}

        {pageState === 'expired' && (
          // ===== Step 3b: ลิงก์หมดอายุ =====
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">ลิงก์หมดอายุ</h2>
            <p className="mt-2 text-sm text-gray-500">
              ลิงก์นี้หมดอายุหรือถูกใช้ไปแล้ว กรุณาขอลิงก์ใหม่อีกครั้ง
            </p>
            <Link
              to="/forgot-password"
              className="mt-5 inline-block w-full rounded-md bg-black px-4 py-2 text-white transition hover:bg-gray-800 font-medium"
            >
              ขอลิงก์ใหม่
            </Link>
          </div>
        )}

        {pageState === 'valid' && (
          // ===== Step 3: ตั้งรหัสผ่านใหม่ =====
          <>
            <h2 className="text-center text-2xl font-bold text-gray-800">
              ตั้งรหัสผ่านใหม่
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              กรอกรหัสผ่านใหม่ของคุณ
            </p>

            <ul className="mt-4 space-y-1 rounded-lg bg-gray-50 p-4 text-sm">
              {passwordRules.map((rule) => {
                const passed = rule.test(password);
                return (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-2 ${
                      passed ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    <Check
                      size={14}
                      className={passed ? 'opacity-100' : 'opacity-30'}
                    />
                    {rule.label}
                  </li>
                );
              })}
            </ul>

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                  รหัสผ่านใหม่
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="mt-1 text-xs text-red-500">รหัสผ่านไม่ตรงกัน</p>
                )}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-md bg-black px-4 py-2 text-white transition hover:bg-gray-800 font-medium disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400 disabled:hover:bg-gray-300"
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
              </button>
            </form>
          </>
        )}

        {pageState === 'success' && (
          // ===== Step 4: สำเร็จ =====
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="text-green-600" size={28} strokeWidth={3} />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">ตั้งรหัสผ่านสำเร็จ</h2>
            <p className="mt-2 text-sm text-gray-500">
              คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว
            </p>

            <button
              onClick={() => navigate('/login')}
              className="mt-5 w-full rounded-md bg-black px-4 py-2 text-white transition hover:bg-gray-800 font-medium"
            >
              กลับสู่หน้าเข้าสู่ระบบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}