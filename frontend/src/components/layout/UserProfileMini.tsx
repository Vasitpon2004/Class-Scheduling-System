import { CircleUserRound } from "lucide-react";

interface UserProfileMiniProps {
  userName: string;
}

export default function UserProfileMini({
  userName,
}: UserProfileMiniProps) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-200 pb-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D1D8E8]">
        <CircleUserRound
          size={32}
          strokeWidth={1.5}
          className="text-gray-500"
          aria-hidden="true"
        />
      </div>

      <span className="text-sm font-medium text-gray-800">
        {userName}
      </span>
    </div>
  );
}