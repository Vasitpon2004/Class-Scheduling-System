import { useState } from "react";
import { LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import SidebarNavItem from "./SidebarNavItem";
import UserProfileMini from "./UserProfileMini";

export interface SidebarNavItemConfig {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  navItems: SidebarNavItemConfig[];
  userName: string;
  activeItem?: string;
  //onNavigate?: (id: string) => void;
}

export default function Sidebar({
  navItems,
  userName,
  activeItem,
  //onNavigate,
}: SidebarProps) {
  const [selectedItem, setSelectedItem] = useState(
    activeItem ?? navItems[0]?.id ?? "",
  );

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    // TODO: เรียกฟังก์ชัน Logout จริงของระบบตรงนี้
    setShowLogoutModal(false);
  };

  return (
    <>
      <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-gray-100 bg-[#F6F8FC]">
        <div className="px-4 pt-5">
          <UserProfileMini userName={userName} />
        </div>

        <nav aria-label="เมนูหลัก" className="flex flex-col gap-1 px-2 py-4">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={selectedItem === item.id}
              onClick={() => setSelectedItem(item.id)}
            />
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto border-t border-slate-200 px-3 py-4">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="group flex w-full items-center gap-3 rounded-xl 
                    px-4 py-3 text-red-500 transition-colors duration-200 
                    hover:bg-red-50 hover:text-red-600"
          >
            <LogOut
              size={20}
              strokeWidth={1.8}
              className="text-red-500 transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            <span className="text-sm font-medium"> ออกจากระบบ </span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-2xl bg-white px-6 py-7 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Icon */}
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <LogOut
                  size={34}
                  strokeWidth={2}
                  className="text-red-500"
                />
              </div>
            </div>

            {/* Title */}
            <h2
              id="logout-title"
              className="text-xl font-semibold text-slate-900"
            >
              ออกจากระบบ
            </h2>

            {/* Description */}
            <p className="mt-2 text-sm leading-6 text-slate-500">
              คุณต้องการออกจากระบบใช่หรือไม่?
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-600 active:scale-[0.98]"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}