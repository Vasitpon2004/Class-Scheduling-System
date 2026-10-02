interface FilterTabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function FilterTabs({
  tabs,
  activeTab,
  onChange,
}: FilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="ตัวกรองนัดหมาย"
      className="flex flex-wrap gap-2"
    >
      {tabs.map((tab) => {
        const active = tab === activeTab;

        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab)}
            className={`
              rounded-full border px-5 py-2.5 text-sm
              transition-colors
              ${
                active
                  ? "border-blue-400 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }
            `}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}