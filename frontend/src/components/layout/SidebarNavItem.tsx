import type { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function SidebarNavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: SidebarNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`
        flex w-full items-center gap-3
        rounded-xl px-3 py-3
        text-sm font-medium
        transition-colors duration-200
        ${
          active
            ? "bg-[#E5EFFD] text-[#3978D4]"
            : "text-gray-600 hover:bg-gray-100"
        }
      `}
    >
      <Icon
        size={20}
        strokeWidth={active ? 2 : 1.8}
        className="shrink-0"
      />

      <span>{label}</span>
    </button>
  );
}