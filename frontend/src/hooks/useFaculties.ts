import { useEffect, useState } from "react";
import { fetchFaculties } from "../data/faculties";
import type { Faculty } from "../data/faculties";

//hook สำหรับการดึงข้อมูลรายชื่อคณะและเก็บสถานะต่าง ๆ
export function useFaculties(){
    //เก็บข้อมูลรายชื่อคณะ เริ่มต้นด้วย array ว่าง
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    //สถานะกำลังโหลดข้อมูลอยู่หรือไม่
    const [loading, setLoading] = useState(true);
    //สถานะการเกิดข้อผิดพลาดหากดึงไม่สำเร็จ
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        //ใช้บอกระบบว่า ผลลัพธ์ที่กำลังจะมา ไม่มีใครรออยู่แล้ว
        let ignore = false;

        fetchFaculties()
        .then((data) => {
            if(!ignore) setFaculties(data);
        })
        .catch(() => {
            if(!ignore) setError("โหลดรายชื่อคณะไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        })
        .finally(() => {
            if(!ignore) setLoading(false);
        });
        //React เรียกฟังก์ชันนี้ตอน component ถูกถอดออกจากหน้าจอ
        return () => {
            ignore = true;
        };
    }, []);
    //ส่งตัวแปลทั้ง 3 ออกมา เพื่อให้ Component อื่นนำไปใช้ต่อได้
    return { faculties, loading, error };
}