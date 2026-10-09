import type { Role } from "../components/register-steps/RoleSelect";
import type { RegisterFormData } from "../components/register-steps/RegisterForm";
import { postJson } from "./http";

export async function registerUser(form: RegisterFormData, role: Role): Promise<void> {
  const isNisit = role === "นิสิต";

  await postJson("/users", {
    first_name: form.firstName,
    last_name: form.lastName,
    user_code: form.idCode,
    email: form.email,
    password: form.password,
    role: role,
    // คณะ/สาขา เป็นของทุก role แล้ว
    major_id: Number(form.major),
    // สองตัวนี้ยังผูกกับ role เพราะ chk_nisit_fields ห้ามอาจารย์มีค่า
    // undefined จะถูก JSON.stringify ตัด key ทิ้ง ทำให้ @ValidateIf ข้ามการตรวจ
    year: isNisit ? Number(form.year) : undefined,
    study_plan: isNisit ? form.studyPlan : undefined,
  });
}