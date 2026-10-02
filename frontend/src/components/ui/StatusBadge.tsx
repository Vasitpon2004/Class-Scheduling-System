interface StatusBadgeProps {
  label: string;
  variant: "exam" | "makeup" | "pending" | "confirmed";
}

const variantStyles: Record<
  StatusBadgeProps["variant"],
  string
> = {
  exam: "bg-blue-100 text-blue-700",
  makeup: "bg-purple-100 text-purple-700",
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-700",
};

export default function StatusBadge({
  label,
  variant,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}