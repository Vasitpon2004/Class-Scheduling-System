import { Link } from "react-router-dom";
import { GraduationCap, Laptop } from "lucide-react";

export type Role = "นิสิต" | "อาจารย์";

interface RoleSelectProps {
  onSelect: (role: Role) => void;
}

const ROLES: { id: Role; label: string; icon: typeof GraduationCap }[] = [ // เป็น "ตารางข้อมูล" ของตัวเลือก role แค่ loop มาแสดงผลตามข้อมูล
  { id: "นิสิต", label: "นิสิต", icon: GraduationCap },
  { id: "อาจารย์", label: "อาจารย์", icon: Laptop },
];

export default function RoleSelect({ onSelect }: RoleSelectProps) {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-gray-800">
        สมัครสมาชิก
      </h2>
      <p className="mt-2 text-center text-sm text-gray-500">
        เลือกประเภทผู้ใช้งานของคุณ
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {ROLES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-300 py-8 transition hover:border-blue-500 hover:bg-blue-50"
          >
            <Icon className="text-blue-600" size={28} />
            <span className="font-medium text-gray-800">{label}</span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        มีบัญชีอยู่แล้ว?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  );
}