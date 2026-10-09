import { postJson } from "./http";

//Function สำหรับยืนยัน OTP จะส่ง OTP ที่ผู้ใช้กรอกมาที่หน้าบ้านไปให้ server เช็คว่าตรงกันและหมดอายุหรือยัง
export async function verifyOtp(email: string, otp_code: string): Promise<void> {
  await postJson<{ message: string }>("/auth/verify-otp", { email, otp_code });
}

//Functuon สำหรับขอรหัส OTP ใหม่
export async function resendOtp(email: string): Promise<string> {
  const res = await postJson<{ message: string }>("/auth/resend-otp", { email });
  return res?.message ?? "ส่งรหัสใหม่แล้ว";
}