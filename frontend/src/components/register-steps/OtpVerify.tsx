import { useRef, useState } from "react";

interface OtpVerifyProps {
  email?: string;
  onNext: () => void; // ไม่ต้องรับ argument เพราะแค่ "บอก parent ว่ายืนยันผ่านแล้ว"
}

export default function OtpVerify({ email, onNext }: OtpVerifyProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill("")); // เก็บรหัส OTP เป็น array 6 ช่อง
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]); // เก็บ reference ของ input แต่ละช่อง ไว้สั่ง .focus() ข้ามช่องเอง
  const [isSubmitting, setIsSubmitting] = useState(false);

  const code = digits.join(""); // รวม array กลับเป็น string เดียว เช่น "123456"
  const canSubmit = code.length === 6 && !isSubmitting; // ครบ 6 หลักและไม่ได้กำลังส่งอยู่

  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(-1); // เอาแค่ตัวเลข 1 หลัก
    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < 5) inputsRef.current[index + 1]?.focus(); // พิมพ์แล้วเลื่อนไปช่องถัดไปอัตโนมัติ
  };

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) { // พิมพ์ OTP ทั่วไปที่ backspace ไล่ถอยหลังได้ต่อเนื่อง
      inputsRef.current[index - 1]?.focus(); // ลบตอนช่องว่าง ให้ย้อนกลับไปช่องก่อนหน้า
    }
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return; // กันเคสกด Enter ทั้งที่กรอกไม่ครบ 6 หลัก
    setIsSubmitting(true);
    // TODO: เรียก backend จริง เช่น POST /api/auth/verify-otp { email, code }
    setTimeout(() => {
      setIsSubmitting(false);
      onNext(); // แจ้ง parent (RegisterPage) ว่ายืนยันผ่านแล้ว ไป step ถัดไป
    }, 800);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800">Verify email</h2>
      <p className="mt-2 text-sm text-gray-500">
        เราได้ส่งรหัสยืนยัน 6 หลักไปที่อีเมลของคุณ
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mt-6 flex justify-center gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {inputsRef.current[index] = el}}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={handleChange(index)}
              onKeyDown={handleKeyDown(index)}
              className="h-14 w-12 rounded-md border border-gray-300 text-center text-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-6 w-full rounded-md bg-black px-4 py-2 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
        >
          {isSubmitting ? "กำลังยืนยัน..." : "ยืนยันรหัส"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        ไม่ได้รับรหัส?{" "}
        <button type="button" className="text-blue-600 hover:underline">
          ส่งอีกครั้ง
        </button>
      </p>
    </div>
  );
}