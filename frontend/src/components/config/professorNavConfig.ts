import {
  CalendarDays,
  PanelsTopLeft,
  CirclePlus,
  Monitor,
  History,
  Sun,
} from "lucide-react";

import type { SidebarNavItemConfig } from "../layout/Sidebar";

export const professorNavItems: SidebarNavItemConfig[] = [
  {
    id: "my-appointments",
    label: "นัดหมายของฉัน",
    icon: CalendarDays,
  },
  {
    id: "my-schedule",
    label: "ตารางสอนของฉัน",
    icon: PanelsTopLeft,
  },
  {
    id: "create-appointment",
    label: "สร้างนัดหมาย",
    icon: CirclePlus,
  },
  {
    id: "classrooms",
    label: "ห้องเรียน",
    icon: Monitor,
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