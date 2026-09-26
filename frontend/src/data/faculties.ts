//ยังไม่ได้เพิ่มคณะกับสาขาเลย ToT

export interface Major {
  id: string;
  name: string;
}

export interface Faculty {
  id: string;
  name: string;
  majors: Major[];
}

// TODO: ข้อมูลจำลอง (mock) — เมื่อต่อ backend แล้วให้ดึงจาก GET /faculties แทน แล้วลบ FACULTIES ทิ้ง (เก็บ interface ไว้)
export const FACULTIES: Faculty[] = [
  {
    id: "engineering",
    name: "วิศวกรรมศาสตร์",
    majors: [
      { id: "cpe", name: "วิศวกรรมคอมพิวเตอร์" },
      { id: "ee", name: "วิศวกรรมไฟฟ้า" },
    ],
  },
  {
    id: "artandscience",
    name: "ศิลปศาสตร์และวิทยาศาสตร์",
    majors: [
      { id: "cs", name: "วิทยาการคอมพิวเตอร์" },
      { id: "math", name: "คณิตศาสตร์" },
    ],
  },
];
