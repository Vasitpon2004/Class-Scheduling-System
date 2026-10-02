import type { ReactNode } from "react";
import DateBadge from "../ui/DateBadge";
import StatusBadge from "../ui/StatusBadge";

export interface Appointment {
  id: string;
  day: number;
  month: string;
  title: string;
  time: string;
  room: string;
  professor: string;
  statuses: {
    label: string;
    variant: "exam" | "makeup" | "pending" | "confirmed";
  }[];
}

interface AppointmentCardProps extends Appointment {
  actions?: ReactNode;
}

export default function AppointmentCard({
  day,
  month,
  title,
  time,
  room,
  professor,
  statuses,
  actions,
}: AppointmentCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex min-w-0 items-center gap-4">
        <DateBadge day={day} month={month} />

        <div className="min-w-0">
          <h3 className="font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">
            {time} · ห้อง {room} · อาจารย์ {professor}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="flex flex-wrap justify-end gap-2">
          {statuses.map((status) => (
            <StatusBadge
              key={`${status.label}-${status.variant}`}
              {...status}
            />
          ))}
        </div>

        {actions}
      </div>
    </div>
  );
}