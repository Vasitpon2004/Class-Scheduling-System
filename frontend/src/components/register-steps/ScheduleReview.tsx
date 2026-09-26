import { useState } from "react";

export interface MatchedSubject {
  id: string;
  code: string;
  section: string;
  name: string;
  day: string;
  time: string;
  room: string;
}

export interface UnmatchedSubject {
  id: string;
  code: string;
  section: string | null;
  day: string;
  time: string;
}

interface ScheduleReviewProps {
  matched?: MatchedSubject[];
  unmatched?: UnmatchedSubject[];
  onConfirm: (selectedIds: string[]) => void;
}

/**
 * แสดงผลตรวจสอบข้อมูลจาก AI parse (เชื่อมกับ endpoint POST /schedule/parse ของระบบเดิม)
 * matched: วิชาที่พบในฐานข้อมูล — ให้ user เลือกยืนยัน
 * unmatched: วิชาที่ไม่พบ — ต้องกดยืนยันข้ามทีละวิชา ก่อนจะกด submit ทั้งหมดได้
 */

export default function ScheduleReview({
  matched = [],
  unmatched = [],
  onConfirm,
}: ScheduleReviewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(matched.map((m) => m.id)); // ตั้งค่าเริ่มต้นให้ "เลือกไว้ทุกวิชาที่ match" — user ไม่ต้องกดเลือกเองถ้าไม่อยากตัดอะไรออก
  const [confirmedSkip, setConfirmedSkip] = useState<Record<string, boolean>>({}); // เก็บว่าวิชา unmatched ตัวไหนถูกกด "ยืนยันข้าม" แล้วบ้าง

  const toggleSelect = (id: string) => // เลือก/ไม่เลือกวิชา กดซ้ำที่เลือกไว้แล้ว = เอาออก, กดที่ยังไม่เลือก = เพิ่มเข้า
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const allUnmatchedHandled = unmatched.every((u) => confirmedSkip[u.id]); // เช็คทุกวิชาที่ยังไม่พบ ถูกกดยืนยันข้ามครบแล้วหรือยัง

  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-gray-800">Register</h2>
      <p className="mt-1 text-center text-sm text-gray-400">ผลการตรวจสอบข้อมูล</p>

      {matched.length > 0 && (
        <>
          <p className="mt-4 text-sm font-medium text-green-600">
            ✓ พบในฐานข้อมูล ({matched.length} วิชา) — เลือกวิชาที่ต้องการ
          </p>
          <div className="mt-2 space-y-2">
            {matched.map((subject) => (
              <button
                key={subject.id}
                type="button"
                onClick={() => toggleSelect(subject.id)}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                  selectedIds.includes(subject.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="font-medium text-gray-800">
                  {subject.code} หมู่ {subject.section} — {subject.name}
                </div>
                <div className="text-gray-500">
                  {subject.day} {subject.time} · {subject.room}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {unmatched.length > 0 && (
        <>
          <p className="mt-4 text-sm font-medium text-orange-500">
            ⚠ ไม่พบในฐานข้อมูล ({unmatched.length} วิชา) — ต้องดำเนินการก่อนยืนยัน
          </p>
          <div className="mt-2 space-y-2">
            {unmatched.map((subject) => (
              <div key={subject.id} className="rounded-lg border border-gray-200 p-4">
                <div className="text-gray-400 line-through">
                  {subject.code} หมู่ {subject.section ?? "??"} (อ่านไม่ชัดเจน)
                </div>
                <div className="text-sm text-gray-400">
                  {subject.day} {subject.time} · ห้องไม่ชัดเจน
                </div>

                {confirmedSkip[subject.id] ? (
                  <p className="mt-2 text-xs text-gray-400">
                    ข้ามวิชานี้แล้ว — จะไม่ถูกบันทึก
                  </p>
                ) : (
                  <div className="mt-3 rounded-md bg-orange-50 p-3 text-xs text-orange-700">
                    วิชานี้จะไม่ถูกบันทึกเข้าตารางเรียน อาจส่งผลต่อความแม่นยำ
                    ในการวิเคราะห์เวลาว่างของคุณ ต้องการข้ามจริงหรือไม่?
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmedSkip((prev) => ({ ...prev, [subject.id]: true }))
                      }
                      className="mt-2 block rounded-md bg-orange-500 px-3 py-1.5 font-medium text-white hover:bg-orange-600"
                    >
                      ยืนยันข้าม
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <button
        type="button"
        disabled={!allUnmatchedHandled}
        onClick={() => onConfirm(selectedIds)}
        className="mt-6 w-full rounded-md bg-black px-4 py-2 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
      >
        ยืนยันและเพิ่มเข้าตารางเรียน
      </button>
    </div>
  );
}