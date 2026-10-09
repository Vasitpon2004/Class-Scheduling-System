import { useState } from "react";
import { useFaculties } from "../../hooks/useFaculties";
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
  studyPlan: string;
}

interface RegisterFormProps {
  role: Role | null; 
  onNext: (data: RegisterFormData) => void;
  submitting?: boolean;
  error?: string | null;
}

// ฟิลด์ร่วมกันทุก role
const baseFields = [
  { name: "firstName", label: "ชื่อ", type: "text" },
  { name: "lastName", label: "นามสกุล", type: "text" },
] as const;

export default function RegisterForm({ role, onNext, submitting, error }: RegisterFormProps) {
  const [form, setForm] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    idCode: "",
    email: "",
    password: "",
    faculty: "",
    major: "",
    year: "",
    studyPlan: "",
  });
  //ดึงรายชื่อคณะ+สาขา จาก /faculties
  const { faculties, loading, error: facultiesError } = useFaculties();

  const isNisit = role === "นิสิต";

  const idLabel = isNisit ? "รหัสนิสิต":"รหัสอาจารย์";
  const majorLabel = isNisit ? "สาขา":"สาขาที่สังกัด"
  // ฟังก์ชันกลางสำหรับ field ทั่วไปที่ไม่มี logic พิเศษ (ไม่ต้อง reset ฟิลด์อื่น)
  const handleChange =
    (field: keyof RegisterFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  //ตรวจสอบข้อมูลพื้นฐานที่ผู้ใช้ต้องกรอก
  const baseFilled = Boolean(
    form.firstName && form.lastName && form.idCode && form.email && form.password
  );
  //ตรวจสอบข้อมูลเฉพาะของนิสิต
  const nisitFilled = Boolean( form.year && form.studyPlan );
    //เช็คข้อมูลก่อนส่งข้อมูล ถ้าเป็นนิสิตต้องกรอกข้อมูลพื้นฐานครบทั้งสองส่วน แต่ถ้าไม่ใช่ก็กรอกแค่ข้อมูลพื้นฐาน
  const canSubmit = isNisit ? baseFilled && nisitFilled: baseFilled;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    onNext(form); // ส่งข้อมูลฟอร์มกลับไปให้ RegisterPage เก็บไว้ แล้วไป step(4 OTP) ถัดไป
  };

  const handleFacultyChange = (e : React.ChangeEvent<HTMLSelectElement>) => { // handler เฉพาะของ "คณะ" ต้อง reset สาขาตลอดเมื่อมีการเปลี่ยนคณะ
    setForm((prev) => ({
      ...prev, faculty: e.target.value, major: "" // เคลียร์ major ทุกครั้งที่เปลี่ยนคณะ
    }))
  }

  const majors = faculties.find((f) => String(f.id) === form.faculty)?.majors ?? []; // หาสาขาของคณะที่เลือก

  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-gray-800">
        Register — {role}
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
          {/* นิสิตเห็นตัวอย่างรหัส 10 หลัก ส่วนอาจารย์เห็นรูปแบบ Qxxxx */}
          <input
            type="text"
            required
            maxLength={20}
            pattern={isNisit ? undefined: "[A-Za-z][0-9]{4}"}
            title={isNisit ? undefined : "ตัวอักษรอังกฤษ 1 ตัว ตามด้วยเลข 4 หลัก เช่น Q1234"}
            placeholder={isNisit ? "6621600437":"Q1234"}
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
            minLength={8}
            maxLength={16}
            value={form.password}
            onChange={handleChange("password")}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* คณะ + สาขา — ทุก role ต้องกรอก */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">คณะ</label>
            <select
              required
              value={form.faculty}
              onChange={handleFacultyChange}
              disabled={loading || !!facultiesError}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">
                {loading ? "— กำลังโหลด —" : facultiesError ? "— โหลดไม่สำเร็จ —" : "— เลือกคณะ —"}
              </option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>{f.faculty_name}</option>
              ))}
            </select>
            {facultiesError && <p className="mt-1 text-sm text-red-600">{facultiesError}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{majorLabel}</label>
            <select
              required
              value={form.major}
              onChange={handleChange("major")}
              disabled={!form.faculty}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">
                {form.faculty ? "— เลือกสาขา —" : "— เลือกคณะก่อน —"}
              </option>
              {majors.map((m) => (
                <option key={m.id} value={m.id}>{m.major_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ชั้นปี + แผนการเรียน — เฉพาะนิสิต เพราะ chk_nisit_fields ในฐานข้อมูล
            บังคับให้สองคอลัมน์นี้เป็น NULL เมื่อ role ไม่ใช่ 'นิสิต' */}
        {isNisit && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">ชั้นปี</label>
              <select
                required
                value={form.year}
                onChange={handleChange("year")}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">— เลือกชั้นปี —</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">แผนการเรียน</label>
              <select
                required
                value={form.studyPlan}
                onChange={handleChange("studyPlan")}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">— เลือกแผนการเรียน —</option>
                <option value="ภาคปกติ">ภาคปกติ</option>
                <option value="ภาคพิเศษ">ภาคพิเศษ</option>
              </select>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3">
            <p className="whitespace-pre-line text-sm text-red-700">{error}</p>
          </div>
        )}
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full rounded-md bg-black px-4 py-2 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
          >
            {submitting? "กำลังดำเนินการ":"ถัดไป"}
          </button>
      </form>
    </div>
  );
}