import { useState } from "react";

import { FACULTIES } from "../../data/faculties";
import type { Role } from "./RoleSelect";

export interface RegisterFormData { // export ไว้เพื่อให้ RegisterPage.tsx import type นี้ไปใช้ตอนประกาศ RegisterState ได้
  firstName: string;
  lastName: string;
  idCode: string;
  email: string;
  password: string;
  faculty: string;
  major: string;
  year: string;
  sec: string;
}

interface RegisterFormProps {
  role: Role | null; 
  onNext: (data: RegisterFormData) => void;
}

// ฟิลด์ร่วมกันทุก role
const baseFields = [
  { name: "firstName", label: "ชื่อ", type: "text" },
  { name: "lastName", label: "นามสกุล", type: "text" },
] as const;

const YEARS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
const SECS = ["ปกติ", "พิเศษ"] as const;

export default function RegisterForm({ role, onNext }: RegisterFormProps) {
  const [form, setForm] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    idCode: "",
    email: "",
    password: "",
    faculty: "",
    major: "",
    year: "",
    sec: "",
  });

  const idLabel = role === "professor" ? "รหัสอาจารย์" : "รหัสนิสิต"; // เปลี่ยน label ตาม role ที่เลือกมาจาก step ก่อนหน้า (step 2)
  const roleLabel = role === "student";

  // ฟังก์ชันกลางสำหรับ field ทั่วไปที่ไม่มี logic พิเศษ (ไม่ต้อง reset ฟิลด์อื่น)
  const handleChange =
    (field: keyof RegisterFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ต้องกรอกทุก field ถึงกดถัดไปได้
  const canSubmit =
    form.firstName && form.lastName && form.idCode && form.email && form.password && form.faculty &&form.major && (!roleLabel || form.year);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    onNext(form); // ส่งข้อมูลฟอร์มกลับไปให้ RegisterPage เก็บไว้ แล้วไป step(4 OTP) ถัดไป
  };

  const handleFacultyChange = (e : React.ChangeEvent<HTMLSelectElement>) => { // handler เฉพาะของ "คณะ" ต้อง reset สาขาตลอดเมื่อมีการเปลี่ยนคณะ
    setForm((prev) => ({
      ...prev, faculty: e.target.value, major: "" // เคลียร์ major ทุกครั้งที่เปลี่ยนคณะ
    }))
  }

  const majors = FACULTIES.find((f) => f.id === form.faculty)?.majors ?? []; // หาสาขาของคณะที่เลือก

  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-gray-800">
        Register — {role === "professor" ? "อาจารย์" : "นิสิต"}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-500">
        กรอกข้อมูลเพื่อสมัครสมาชิก
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          {baseFields.map(({ name, label }) => (
            <div key={name}>
              <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                required
                value={form[name]}
                onChange={handleChange(name)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{idLabel}</label>
          <input
            type="text"
            required
            value={form.idCode}
            onChange={handleChange("idCode")}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">อีเมล</label>
          <input
            type="email"
            required
            placeholder="example@ku.th"
            value={form.email}
            onChange={handleChange("email")}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">รหัสผ่าน</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={handleChange("password")}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">คณะ</label>
            <select
              required
              value={form.faculty}
              onChange={handleFacultyChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">— เลือกคณะ —</option>
              {FACULTIES.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">สาขา</label>
            <select
              value={form.major}
              onChange={handleChange("major")}
              disabled={!form.faculty}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">
                {form.faculty ? "— เลือกสาขา —" : "— เลือกคณะก่อน —"}
              </option>
              {majors.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {roleLabel && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">ชั้นปี</label>
              <select 
                value={form.year}
                onChange={handleChange("year")}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">— เลือกชั้นปี —</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>ปี {y}</option>
                ))}
              </select>
            </div>           
          )}  

          {roleLabel && (
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">แผนการเรียน</label>
                <select 
                  value={form.sec}
                  onChange={handleChange("sec")}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">— เลือกแผนการเรียน —</option>
                  {SECS.map((s) => (
                    <option key={s} value={s}>ภาค{s}</option>
                  ))}
                </select>
              </div>
          )}    
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-md bg-black px-4 py-2 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
        >
          ถัดไป
        </button>
      </form>
    </div>
  );
}