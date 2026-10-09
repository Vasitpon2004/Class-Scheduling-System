const API_URL = import.meta.env.VITE_API_URL;

//Functionนี้ทำหน้าทีแกะเอาเฉพาะข้อความที่ผิดที่ server ตอบกลับมา
function toMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const m = (body as { message?: unknown }).message;
  if (Array.isArray(m)) return m.join("\n");
  if (typeof m === "string") return m;
  return null;
}

//Function ตัวกลางสำหรับทุก Request แบบ POST ที่ส่ง JSON
export async function postJson<T>(path: string, payload: unknown): Promise<T> {
    //ส่ง Request แบบ POST พร้อมตั้ง Header เป็น application/json และแปลงข้อมูลก้อน payload ให้เป็น string แล้วส่งไปหา server
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  //เอาไว้เช็คว่า server ตอบกลับสำเร็จหรือไม่
  if (!res.ok) {
    // 429 มาจาก ThrottlerGuard ซึ่งส่งข้อความอังกฤษ จึงดักเปลี่ยนเป็นไทยก่อน
    if (res.status === 429) {
      throw new Error("คุณส่งคำขอถี่เกินไป กรุณารอสักครู่แล้วลองใหม่");
    }
    const body = await res.json().catch(() => null);
    throw new Error(toMessage(body) ?? `ดำเนินการไม่สำเร็จ (${res.status})`);
  }

  // บาง endpoint อาจไม่มี body ให้ parse จึงกัน catch ไว้
  return (await res.json().catch(() => null)) as T;
}