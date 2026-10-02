import {
  CalendarDays,
  CalendarRange,
  Monitor,
  CircleCheck,
  History,
  Sun,
} from "lucide-react";

import type { SidebarNavItemConfig } from "../layout/Sidebar";

export const studentNavItems: SidebarNavItemConfig[] = [
  {
    id: "appointments",
    label: "ตารางนัดหมาย",
    icon: CalendarDays,
  },
  {
    id: "my-schedule",
    label: "ตารางของฉัน",
    icon: CalendarRange,
  },
  {
    id: "classrooms",
    label: "ห้องเรียน",
    icon: Monitor,
  },
  {
    id: "confirmations",
    label: "การยืนยันการนัดหมาย",
    icon: CircleCheck,
  },
  {
    id: "history",
    label: "ประวัติการนัดหมาย",
    icon: History,
  },
  {
    id: "notifications",
    label: "การตั้งค่าการแจ้งเตือน",
    icon: Sun,
  },
];