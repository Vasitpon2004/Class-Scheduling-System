import { useReducer } from "react";
import StepNav from "../components/StepNav";
import RoleSelect from "../components/register-steps/RoleSelect";
import RegisterForm from "../components/register-steps/RegisterForm";
import OtpVerify from "../components/register-steps/OtpVerify";
import ScheduleUpload from "../components/register-steps/ScheduleUpload";
import ScheduleReview from "../components/register-steps/ScheduleReview";
import RegisterDone from "../components/register-steps/RegisterDone";

import type { RegisterFormData } from "../components/register-steps/RegisterForm";
import type { MatchedSubject, UnmatchedSubject } from "../components/register-steps/ScheduleReview";
import type{ Role } from "../components/register-steps/RoleSelect"

interface RegisterState {
  step: number;
  role: Role | null;
  formData: RegisterFormData | null; // import type จาก RegisterForm.tsx
  scheduleFile: File | null;
  scheduleSubStep: "upload" | "review";
  scheduleResult: {
    matched: MatchedSubject[];
    unmatched: UnmatchedSubject[];
  } | null;
}

type RegisterAction =
  | { type: "SELECT_ROLE"; role: Role }
  | { type: "SUBMIT_FORM"; data: RegisterFormData }
  | { type: "OTP_VERIFIED" }
  | { type: "SCHEDULE_UPLOADED"; file: File; result: RegisterState["scheduleResult"] }
  | { type: "SCHEDULE_CONFIRMED" };
//  | { type: "GO_BACK" };

// step ทั้งหมดของ flow สมัครสมาชิก ใช้ป้อนให้ StepNav
const STEPS = [
  { step: 1 },
  { step: 2 },
  { step: 3 },
  { step: 4 },
  { step: 5 },
];

// step 4 มี 2 หน้าจอย่อย (อัปโหลด → ตรวจสอบผล) สลับกันโดยไม่ขยับ step หลัก
const initialState: RegisterState = {
  step: 1,
  role: null, // "student" | "professor"
  formData: null, // ข้อมูลจาก RegisterForm (step 2)
  scheduleFile: null, // ไฟล์ screenshot ตารางเรียน (step 4a)
  scheduleSubStep: "upload", // "upload" | "review" — sub-state ของ step 4b
  scheduleResult: null, // ผลตรวจสอบจาก AI parse (matched/unmatched) — จะได้จาก backend จริง
};

function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case "SELECT_ROLE":
      return { ...state, role: action.role, step: 2 };

    case "SUBMIT_FORM":
      return { ...state, formData: action.data, step: 3 };

    case "OTP_VERIFIED":
      return { ...state, step: 4 };

    case "SCHEDULE_UPLOADED":
      // ในของจริง: ยิงไฟล์ไป POST /schedule/parse แล้วเอาผลมาใส่ scheduleResult
      return {
        ...state,
        scheduleFile: action.file,
        scheduleSubStep: "review",
        scheduleResult: action.result, // { matched: [...], unmatched: [...] }
      };

    case "SCHEDULE_CONFIRMED":
      // ในของจริง: ยิง POST /schedule/confirm พร้อม selectedIds ก่อนค่อยไป step 5
      return { ...state, step: 5 };

    //case "GO_BACK":
      //return { ...state, step: Math.max(1, state.step - 1) };

    default:
      return state;
  }
}

export default function RegisterPage() {
  const [state, dispatch] = useReducer(registerReducer, initialState);
  const { step, role, formData, scheduleSubStep, scheduleResult } = state;

  // จำลองเรียก backend ตรงจุดที่ยังไม่ได้ต่อจริง (มี TODO กำกับไว้ในแต่ละจุด)
  const handleScheduleUpload = async (file: File) => {
    // TODO: เปลี่ยนเป็นเรียกจริง เช่น
    // const form = new FormData(); form.append("file", file);
    // const res = await fetch("/schedule/parse", { method: "POST", body: form });
    // const result = await res.json();
    const mockResult = {
      matched: [
        { id: "1", code: "CS201", section: "700", name: "โครงสร้างข้อมูล", day: "จันทร์", time: "09:00-12:00", room: "LH2-204" },
        { id: "2", code: "CS301", section: "450", name: "ระบบฐานข้อมูล", day: "อังคาร", time: "13:00-16:00", room: "SC9-402" },
      ],
      unmatched: [
        { id: "3", code: "CS4XX", section: null, day: "พุธ", time: "09:00-12:00" },
      ],
    };
    dispatch({ type: "SCHEDULE_UPLOADED", file, result: mockResult });
  };

  const handleScheduleConfirm = async (_selectedIds: string[]) => {
    // TODO: POST /schedule/confirm { ownerId, subjectIds: selectedIds }
    dispatch({ type: "SCHEDULE_CONFIRMED" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-12">
      <h1 className="mb-15 text-center text-4xl font-bold text-blue-800">
        Class Scheduling System
      </h1>

      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-md">
        <StepNav steps={STEPS} currentStep={step} />

        {step === 1 && (
          <RoleSelect onSelect={(role) => dispatch({ type: "SELECT_ROLE", role })} />
        )}

        {step === 2 && (
          <RegisterForm
            role={role}
            onNext={(data) => dispatch({ type: "SUBMIT_FORM", data })}
          />
        )}

        {step === 3 && (
          <OtpVerify
            email={formData?.email}
            onNext={() => dispatch({ type: "OTP_VERIFIED" })}
          />
        )}

        {step === 4 && scheduleSubStep === "upload" && (
          <ScheduleUpload onNext={handleScheduleUpload} />
        )}

        {step === 4 && scheduleSubStep === "review" && (
          <ScheduleReview
            matched={scheduleResult?.matched}
            unmatched={scheduleResult?.unmatched}
            onConfirm={handleScheduleConfirm}
          />
        )}

        {step === 5 && <RegisterDone />}
      </div>
    </div>
  );
}