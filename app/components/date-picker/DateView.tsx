"use client";

import { CalendarProps } from "./types";
import { useCalendar } from "./useCalendar";

export function DateView({
                           month,
                           selected,
                           onSelect,
                           onPrevMonth,
                           onNextMonth,
                         }: CalendarProps) {
  const days = useCalendar(month);

  return (
    <div className="w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={onPrevMonth} className="px-2">◀</button>
        <span className="font-medium">
          {month.format("YYYY.MM")}
        </span>
        <button type="button" onClick={onNextMonth} className="px-2">▶</button>
      </div>

      {/* Week */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
        {["일", "월", "화", "수", "목", "금", "토"].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map(day => {
          const isSelected = selected?.isSame(day, "day");
          const isCurrentMonth = day.month() === month.month();

          return (
            <button
              key={day.toString()}
              type="button"
              onClick={() => onSelect(day)}
              className={`
                h-8 rounded text-sm
                ${isSelected ? "bg-black text-white" : ""}
                ${!isCurrentMonth ? "text-gray-400" : "hover:bg-gray-100"}
              `}
            >
              {day.date()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
