"use client";

import { YearPickerProps } from "./types";

export function YearView({
                             year,
                             selected,
                             onSelect,
                           }: YearPickerProps) {
  const startYear = Math.floor(year.year() / 12) * 12;
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);

  return (
    <div className="grid grid-cols-3 gap-2 w-64">
      {years.map(y => {
        const isSelected = selected?.year() === y;

        return (
          <button
            key={y}
            type="button"
            onClick={() => onSelect(y)}
            className={`
              py-2 rounded text-sm
              ${isSelected ? "bg-black text-white" : "hover:bg-gray-100"}
            `}
          >
            {y}
          </button>
        );
      })}
    </div>
  );
}
