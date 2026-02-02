"use client";

import { MonthPickerProps } from "./types";

const MONTHS = [
  "1월","2월","3월","4월","5월","6월",
  "7월","8월","9월","10월","11월","12월"
];

export function MonthView({
                              year,
                              selected,
                              onSelect,
                            }: MonthPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2 w-64">
      {MONTHS.map((label, idx) => {
        const isSelected =
          selected &&
          selected.year() === year.year() &&
          selected.month() === idx;

        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelect(idx)}
            className={`
              py-2 rounded text-sm
              ${isSelected ? "bg-black text-white" : "hover:bg-gray-100"}
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
