import { useEffect, useRef, useState } from "react";
import { verifyOtp, resendOtp } from "../../data/auth";

interface OtpVerifyProps {
  email: string;
  onNext: () => void;
}

//
export default function OtpVerify({ email, onNext }: OtpVerifyProps) {
  //เก็บรหัส OTP เป็น Array 6 ช่อง
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  //ใช้เพื่อให้เวลาผู้ใช้พิมพ์เลขเสร็จ แป้นพิมพ์จะกระโดดไปช่องถัดไปให้อัตโนมัติ
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  //ใช้เก็บสถานะ isSubmitting = กำลังยิง API, error = เก็บการแจ้งเตือนข้อผิดพลาด
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //ใช้เก็บข้อความแจ้งเตือนเมื่อขอส่งรหัส OTP อีกครั้งแล้วสำเร็จ
  const [info, setInfo] = useState<string | null>(null);
  //ใช้นับถอยหลัง เพื่อจำกัดเวลาไม่ให้ผู้ใช้กดขอรหัสใหม่ถี่เกินไป set ไว้เป็น 60วิ เมื่อกด
  const [cooldown, setCooldown] = useState(0);

  //เอาตัวเลขใน Array ทั้ง 6 ช่องมาต่อกันให้กลายเป็นก้อน ก่อนส่งให้ postJson 9i;0lv[]
  const code = digits.join("");
  //ตัวเก็บสถานะความพร้อมในการส่งform
  const canSubmit = code.length === 6 && !isSubmitting;

  // นับถอยหลังปุ่มขอรหัสใหม่ เพราะหลังบ้านจำกัด 1 ครั้งต่อ 60 วินาที
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
    //ทุกครั้งที่ cooldown เปลี่ยนค่า useEffect จะถูก Run ใหม่อีกครั้งจนกว่าจะถึง 0
  }, [cooldown]);

  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(-1); // เอาแค่ตัวเลข 1 หลัก
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError(null); // พอเริ่มพิมพ์ใหม่ ให้ข้อความผิดพลาดเดิมหายไป

    if (value && index < 5) inputsRef.current[index + 1]?.focus(); // เลื่อนไปช่องถัดไปอัตโนมัติ
  };

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus(); // ลบตอนช่องว่าง ให้ย้อนกลับไปช่องก่อนหน้า
    }
  };

  const clearDigits = () => {
    setDigits(Array(6).fill(""));
    inputsRef.current[0]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return; // กันเคสกด Enter ทั้งที่กรอกไม่ครบ 6 หลัก

    setIsSubmitting(true);
    setError(null);
    setInfo(null);

    try {
      await verifyOtp(email, code);
      onNext(); // แจ้ง parent ว่ายืนยันผ่านแล้ว ไป step 4
    } catch (err) {
      setError(err instanceof Error ? err.message : "ยืนยันรหัสไม่สำเร็จ");
      clearDigits(); // ล้างช่องให้พิมพ์ใหม่ได้ทันที
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    setError(null);
    setInfo(null);

    try {
      setInfo(await resendOtp(email)); // ใช้ข้อความจากหลังบ้านตรง ๆ
      setCooldown(60); // ตรงกับ ttl: 60000 ที่ @Throttle ของ resend-otp ตั้งไว้
      clearDigits(); // รหัสเก่าถูกปิดไปแล้วที่หลังบ้าน จึงล้างช่องด้วย
    } catch (err) {
      setError(err instanceof Error ? err.message : "ขอรหัสใหม่ไม่สำเร็จ");
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800">Verify email</h2>
      <p className="mt-2 text-sm text-gray-500">
        เราได้ส่งรหัสยืนยัน 6 หลักไปที่ <span className="font-medium text-gray-700">{email}</span>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mt-6 flex justify-center gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputsRef.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={handleChange(index)}
              onKeyDown={handleKeyDown(index)}
              disabled={isSubmitting}
              className="h-14 w-12 rounded-md border border-gray-300 text-center text-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
            />
          ))}
        </div>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
            <p className="whitespace-pre-line text-sm text-red-700">{error}</p>
          </div>
        )}

        {info && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3">
            <p className="text-sm text-green-700">{info}</p>
          </div>
        )}

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
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className="text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
        >
          {cooldown > 0 ? `ขอรหัสใหม่ได้ในอีก ${cooldown} วินาที` : "ส่งอีกครั้ง"}
        </button>
      </p>
    </div>
  );
}