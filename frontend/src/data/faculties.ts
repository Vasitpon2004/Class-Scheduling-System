//กำหนดว่าข้อมูลของ 1 สาขาจะต้องมีอะไร
export interface Major {
  id: number;
  major_name: string;
}

//กำหนดว่าข้อมูลของ 1 คณะจะต้องมีอะไร
export interface Faculty {
  id: number;
  faculty_name: string;
  majors: Major[];
}

//ดึงค่า Enivironment ที่เราตั้งค่าเอาไว้ใน .env เอามาเก็บไว้ที่ API_URL เพราะถ้าเราจะเปลี่ยน URL ของ server ก็ไปแก้ที่ .env พอ
const API_URL = import.meta.env.VITE_API_URL;

//Function สำหรับดึงข้อมูลคณะ โดยผลลัพธ์จะระบุถึง Array ที่คณะอยู่
export async function fetchFaculties(): Promise<Faculty[]>{
  //ยิง Request ไปยัง api faculties เพื่อขอข้อมูล
  const res = await fetch(`${API_URL}/faculties`);

  //เช็คว่าการตอบกลับสำเร็จไหม
  if(!res.ok){
    throw new Error(`โหลดรายชื่อคณะไม่สำเร็จ (${res.status})`);
  }
  //แปลงข้อมูลที่ได้มาเป็น obj (JSON) แล้วส่งข้อมูลไปใช้งานต่อ
  return res.json();
}
