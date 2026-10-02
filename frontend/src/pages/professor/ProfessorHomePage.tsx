import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/layout/Sidebar";
import FilterTabs from "../../components/ui/FilterTabs";
import { professorNavItems } from "../../components/config/professorNavConfig";

type AppointmentStatus = "open" | "finished" | "cancelled";

interface ProfessorAppointment {
  id: number;
  title: string;
  type: string;
  group: number;
  date: string;
  time: string;
  confirmed: number;
  rejected: number;
  unanswered: number;
  status: AppointmentStatus;
}

const initialAppointments: ProfessorAppointment[] = [
  {
    id: 1,
    title: "โครงสร้างข้อมูล",
    type: "เรียนชดเชย",
    group: 2,
    date: "ศุกร์ 9 ต.ค. 2569",
    time: "16:00–18:00",
    confirmed: 32,
    rejected: 6,
    unanswered: 12,
    status: "open",
  },
  {
    id: 2,
    title: "โครงสร้างข้อมูล",
    type: "สอบ",
    group: 2,
    date: "พุธ 30 ก.ย. 2569",
    time: "13:00–15:00",
    confirmed: 47,
    rejected: 1,
    unanswered: 2,
    status: "finished",
  },
  {
    id: 3,
    title: "ฐานข้อมูล",
    type: "เรียนชดเชย",
    group: 1,
    date: "จันทร์ 14 ก.ย. 2569",
    time: "16:30–18:30",
    confirmed: 0,
    rejected: 0,
    unanswered: 52,
    status: "cancelled",
  },
];

const filters = [
  "ทั้งหมด",
  "เปิดรับตอบกลับ",
  "สิ้นสุดแล้ว",
];

function ResponseSummary({
  confirmed,
  rejected,
  unanswered,
}: {
  confirmed: number;
  rejected: number;
  unanswered: number;
}) {
  const total = confirmed + rejected + unanswered;

  const percent = (value: number) =>
    total > 0 ? `${(value / total) * 100}%` : "0%";

  return (
    <div className="min-w-0 flex-1">
      <div className="flex h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="bg-green-600"
          style={{ width: percent(confirmed) }}
        />
        <div
          className="bg-red-500"
          style={{ width: percent(rejected) }}
        />
        <div
          className="bg-amber-600"
          style={{ width: percent(unanswered) }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-600">
        ยืนยัน {confirmed} · ปฏิเสธ {rejected} · ยังไม่ตอบ {unanswered}
      </p>
    </div>
  );
}

function AppointmentStatusBadge({
  status,
}: {
  status: AppointmentStatus;
}) {
  const styles: Record<AppointmentStatus, string> = {
    open: "bg-blue-100 text-blue-700",
    finished: "bg-slate-100 text-slate-600",
    cancelled: "bg-red-100 text-red-600",
  };

  const labels: Record<AppointmentStatus, string> = {
    open: "เปิดรับตอบกลับ",
    finished: "สิ้นสุดแล้ว",
    cancelled: "ยกเลิกแล้ว",
  };

  return (
    <span
      className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function AppointmentItem({
  appointment,
  onViewResponses,
}: {
  appointment: ProfessorAppointment;
  onViewResponses: (id: number) => void;
}) {
  const typeStyle =
    appointment.type === "สอบ"
      ? "bg-blue-100 text-blue-700"
      : "bg-purple-100 text-purple-700";

  return (
    <article className="grid grid-cols-1 items-center gap-4 rounded-2xl border border-slate-200 px-5 py-5 md:grid-cols-[1.15fr_1fr_auto_auto]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-900">
            {appointment.title}
          </h2>

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${typeStyle}`}
          >
            {appointment.type}
          </span>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          กลุ่ม {appointment.group} · {appointment.date} · {appointment.time}
        </p>
      </div>

      <ResponseSummary
        confirmed={appointment.confirmed}
        rejected={appointment.rejected}
        unanswered={appointment.unanswered}
      />

      <div className="flex justify-start md:justify-center">
        <AppointmentStatusBadge status={appointment.status} />
      </div>

      <button
        type="button"
        onClick={() => onViewResponses(appointment.id)}
        className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-800 transition hover:bg-slate-50"
      >
        ดูการตอบกลับ
      </button>
    </article>
  );
}

export default function ProfessorHomePage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("ทั้งหมด");

  const filteredAppointments = initialAppointments.filter((appointment) => {
    if (activeTab === "เปิดรับตอบกลับ") {
      return appointment.status === "open";
    }

    if (activeTab === "สิ้นสุดแล้ว") {
      return appointment.status === "finished";
    }

    return true;
  });

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        navItems={professorNavItems}
        userName="อาจารย์ [ชื่อ-นามสกุล]"
        activeItem="my-appointments"
      />

      <main className="min-w-0 flex-1 px-6 py-8 md:px-10">
        <h1 className="mb-8 text-center text-3xl font-bold text-slate-900">
          นัดหมายของฉัน
        </h1>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <FilterTabs
            tabs={filters}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <button
            type="button"
            onClick={() => navigate("")}
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            + สร้างนัดหมาย
          </button>
        </div>

        <section className="flex flex-col gap-3">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <AppointmentItem
                key={appointment.id}
                appointment={appointment}
                onViewResponses={(id) =>
                  navigate(`/professor/appointments/${id}/responses`)
                }
              />
            ))
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