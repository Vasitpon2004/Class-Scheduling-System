interface DateBadgeProps {
  day: number;
  month: string;
}

export default function DateBadge({
  day,
  month,
}: DateBadgeProps) {
  return (
    <div className="flex h-[70px] w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-50">
      <span className="text-2xl font-bold leading-tight text-blue-700">
        {String(day).padStart(2, "0")}
      </span>

      <span className="mt-1 text-xs text-blue-600">
        {month}
      </span>
    </div>
  );
}