import { useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import FilterTabs from "../../components/ui/FilterTabs";
import AppointmentList from "../../components/appointment/AppointmentList";
import type { Appointment } from "../../components/appointment/AppointmentCard";

import { studentNavItems } from "../../components/config/studentNavConfig";

const appointments: Appointment[] = [
  {
    id: "apt-1",
    day: 5,
    month: "ต.ค.",
    title: "การเขียนโปรแกรมเบื้องต้น",
    time: "จันทร์ 13:00–15:00",
    room: "[ห้อง]",
    professor: "[ชื่ออาจารย์]",
    statuses: [
      { label: "สอบ", variant: "exam" },
      { label: "รอการตอบกลับ", variant: "pending" },
    ],
  },
  {
    id: "apt-2",
    day: 7,
    month: "ต.ค.",
    title: "โครงสร้างข้อมูล",
    time: "พุธ 09:30–11:30",
    room: "[ห้อง]",
    professor: "[ชื่ออาจารย์]",
    statuses: [
      { label: "เรียนชดเชย", variant: "makeup" },
      { label: "รอการตอบกลับ", variant: "pending" },
    ],
  },
  {
    id: "apt-3",
    day: 12,
    month: "ต.ค.",
    title: "ระบบปฏิบัติการ",
    time: "จันทร์ 16:30–18:30",
    room: "[ห้อง]",
    professor: "[ชื่ออาจารย์]",
    statuses: [
      { label: "เรียนชดเชย", variant: "makeup" },
      { label: "ยืนยันแล้ว", variant: "confirmed" },
    ],
  },
  {
    id: "apt-4",
    day: 19,
    month: "ต.ค.",
    title: "ฐานข้อมูล",
    time: "จันทร์ 13:00–15:00",
    room: "[ห้อง]",
    professor: "[ชื่ออาจารย์]",
    statuses: [
      { label: "สอบ", variant: "exam" },
      { label: "ยืนยันแล้ว", variant: "confirmed" },
    ],
  },
];

const tabs = [
  "ทั้งหมด",
  "สอบ",
  "เรียนชดเชย",
  "รอการตอบกลับ",
];

export default function StudentHomePage() {
  const [activeTab, setActiveTab] = useState("ทั้งหมด");

  const filteredAppointments = appointments.filter((appointment) => {
    if (activeTab === "ทั้งหมด") return true;

    return appointment.statuses.some(
      (status) => status.label === activeTab,
    );
  });

  const handleReply = (appointment: Appointment) => {
    // TODO: เปิดหน้าต่างตอบกลับ หรือเรียก API
    alert(`ตอบกลับนัดหมาย: ${appointment.title}`);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar ใช้ร่วมกับหน้า Professor */}
      <Sidebar
        navItems={studentNavItems}
        userName="นิสิต [ชื่อ-นามสกุล]"
        activeItem="appointments"
      />

      {/* Main content ใช้ Layout แบบเดียวกับ Professor */}
      <main className="min-w-0 flex-1 px-6 py-8 md:px-10">
        <h1 className="mb-8 text-center text-3xl font-bold text-slate-900">
          ตารางนัดหมาย
        </h1>

        {/* FilterTabs ใช้ Component กลางตัวเดิม */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <FilterTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* รายการนัดหมายยังใช้ Component ของ Student */}
        <section className="mt-5 flex flex-col gap-3">
          {filteredAppointments.length > 0 ? (
            <AppointmentList
              appointments={filteredAppointments}
              renderActions={(appointment) => {
                const isPending = appointment.statuses.some(
                  (status) => status.variant === "pending",
                );

                if (!isPending) return null;

                return (
                  <button
                    type="button"
                    onClick={() => handleReply(appointment)}
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    ตอบกลับ
                  </button>
                );
              }}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500">
              ไม่มีรายการนัดหมายในหมวดนี้
            </div>
          )}
        </section>
      </main>
    </div>
  );
}