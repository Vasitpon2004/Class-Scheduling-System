import { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  History,
  Bell,
  ArrowUpRight,
} from "lucide-react";

type Feature = {
  code: string;
  title: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  href: string;
};

const FEATURES: Feature[] = [
  {
    code: "CAL",
    title: "My Calendar",
    description: "ภาพรวมเดือนนี้ นัดหมายและกิจกรรมทั้งหมดในที่เดียว",
    icon: Calendar,
    accent: "#D9A441",
    href: "#calendar",
  },
  {
    code: "TT",
    title: "Timetable",
    description: "ตารางประจำสัปดาห์ จัดเรียงตามช่วงเวลาแต่ละวัน",
    icon: Clock,
    accent: "#3E7C71",
    href: "#timetable",
  },
  {
    code: "APT",
    title: "Appointment Confirm",
    description: "ยืนยันหรือปฏิเสธคำขอนัดหมายที่รอดำเนินการ",
    icon: CheckCircle2,
    accent: "#C1584B",
    href: "#appointments",
  },
  {
    code: "HIST",
    title: "History",
    description: "ย้อนดูนัดหมายและกิจกรรมที่ผ่านมาแล้ว",
    icon: History,
    accent: "#5B6B8C",
    href: "#history",
  },
  {
    code: "NOTIF",
    title: "Notification Settings",
    description: "ตั้งค่าการแจ้งเตือนล่วงหน้าก่อนถึงนัดหมาย",
    icon: Bell,
    accent: "#7A5C74",
    href: "#notifications",
  },
];

const INK = "#1E2A44";
const PAPER = "#EAE6DC";
const RULE = "#C9C2B2";

export default function HomePage() {
  const [activeCode, setActiveCode] = useState<string>(FEATURES[0].code);

  const today = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: PAPER,
        backgroundImage: `radial-gradient(${RULE} 1px, transparent 1px)`,
        backgroundSize: "22px 22px",
        fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
        color: INK,
      }}
    >
      <div className="flex">
        {/* Binder spine — desktop only */}
        <nav
          className="hidden md:flex flex-col shrink-0 pt-24"
          aria-label="Section tabs"
        >
          {FEATURES.map((f) => {
            const isActive = activeCode === f.code;
            return (
              <a
                key={f.code}
                href={f.href}
                onMouseEnter={() => setActiveCode(f.code)}
                onFocus={() => setActiveCode(f.code)}
                className="flex items-center justify-center transition-all duration-200 ease-out"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  backgroundColor: f.accent,
                  color: PAPER,
                  width: isActive ? "44px" : "34px",
                  height: "96px",
                  marginBottom: "10px",
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  boxShadow: isActive
                    ? "2px 2px 0 rgba(30,42,68,0.25)"
                    : "1px 1px 0 rgba(30,42,68,0.15)",
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                }}
              >
                {f.code}
              </a>
            );
          })}
        </nav>

        {/* Main content */}
        <main className="flex-1 px-6 md:px-12 py-10 md:py-16 max-w-5xl">
          {/* Mobile tab chips */}
          <div className="flex md:hidden gap-2 overflow-x-auto pb-4 -mx-6 px-6 mb-4">
            {FEATURES.map((f) => (
              <a
                key={f.code}
                href={f.href}
                className="shrink-0 px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: f.accent,
                  color: PAPER,
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                  letterSpacing: "0.06em",
                }}
              >
                {f.code}
              </a>
            ))}
          </div>

          {/* Header */}
          <header className="mb-10 md:mb-14">
            <p
              className="text-xs mb-2"
              style={{
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                letterSpacing: "0.12em",
                color: "#6B7280",
                textTransform: "uppercase",
              }}
            >
              {today}
            </p>
            <h1
              className="text-3xl md:text-4xl"
              style={{
                fontFamily: "'Fraunces', ui-serif, Georgia, serif",
                fontWeight: 600,
                color: INK,
              }}
            >
              สวัสดี, Kim Jong Un
            </h1>
            <p className="mt-2 text-sm md:text-base" style={{ color: "#5B5548" }}>
              นี่คือสมุดตารางของคุณวันนี้ — เลือกหัวข้อด้านล่างเพื่อเริ่มต้น
            </p>
          </header>

          {/* Feature grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const isWide = i === FEATURES.length - 1 && FEATURES.length % 2 !== 0;
              return (
                <a
                  key={f.code}
                  href={f.href}
                  className={`group relative rounded-xl p-5 md:p-6 transition-all duration-200 ease-out hover:-translate-y-0.5 ${
                    isWide ? "sm:col-span-2" : ""
                  }`}
                  style={{
                    backgroundColor: "#F5F3EC",
                    border: `1px solid ${RULE}`,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex items-center justify-center rounded-lg mb-4"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: f.accent,
                      }}
                    >
                      <Icon size={20} color={PAPER} strokeWidth={2} />
                    </div>
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{
                        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                        color: f.accent,
                        border: `1px solid ${f.accent}`,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {f.code}
                    </span>
                  </div>

                  <h2
                    className="text-lg mb-1.5"
                    style={{
                      fontFamily: "'Fraunces', ui-serif, Georgia, serif",
                      fontWeight: 600,
                      color: INK,
                    }}
                  >
                    {f.title}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6558" }}>
                    {f.description}
                  </p>

                  <div
                    className="mt-4 flex items-center gap-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: f.accent }}
                  >
                    เปิดดู
                    <ArrowUpRight size={14} />
                  </div>
                </a>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
}