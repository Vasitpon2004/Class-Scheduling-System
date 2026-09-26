import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export default function RegisterDone() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <Check className="text-green-600" size={28} strokeWidth={3} />
      </div>

      <h2 className="text-2xl font-bold text-gray-800">สมัครสมาชิกเสร็จสิ้น</h2>
      <p className="mt-2 text-sm text-gray-500">บัญชีของคุณพร้อมใช้งานแล้ว</p>

      <Link
        to="/login"
        className="mt-5 block w-full rounded-md bg-black px-4 py-2 font-medium text-white transition hover:bg-gray-800"
      >
        กลับสู่หน้าเข้าสู่ระบบ
      </Link>
    </div>
  );
}