import AppointmentCard, {
  type Appointment,
} from "./AppointmentCard";

interface AppointmentListProps {
  appointments: Appointment[];
  renderActions?: (appointment: Appointment) => React.ReactNode;
}

export default function AppointmentList({
  appointments,
  renderActions,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <p className="py-10 text-center text-gray-500">
        ไม่มีรายการนัดหมาย
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          {...appointment}
          actions={renderActions?.(appointment)}
        />
      ))}
    </div>
  );
}