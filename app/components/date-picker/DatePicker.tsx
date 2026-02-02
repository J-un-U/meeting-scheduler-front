"use client";

import { Popover } from "@headlessui/react";
import dayjs from "dayjs";
import { useState } from "react";
import { DateView } from "./DateView";
import { MonthView } from "./MonthView";
import { YearView } from "./YearView";
import { DatePickerProps } from "./types";

export function DatePicker({
                             value = null,
                             mode = "date",
                             onChange,
                           }: DatePickerProps) {
  const [selected, setSelected] = useState<dayjs.Dayjs | null>(value);
  const [view, setView] = useState(value ?? dayjs());

  const handleChange = (date: dayjs.Dayjs) => {
    setSelected(date);
    onChange?.(date);
  };

  const displayValue = () => {
    if (!selected) return "선택";
    if (mode === "year") return selected.format("YYYY");
    if (mode === "month") return selected.format("YYYY-MM");
    return selected.format("YYYY-MM-DD");
  };

  return (
    <Popover className="relative inline-block">
      {({ close }) => (
        <>
          <Popover.Button className="border px-3 py-2 rounded w-40 text-left">
            {displayValue()}
          </Popover.Button>

          <Popover.Panel className="absolute z-10 mt-2 bg-white border rounded shadow p-3">
            {mode === "date" && (
              <DateView
                month={view}
                selected={selected}
                onSelect={(d) => {
                  handleChange(d);
                  close();
                }}
                onPrevMonth={() => setView(view.subtract(1, "month"))}
                onNextMonth={() => setView(view.add(1, "month"))}
              />
            )}

            {mode === "month" && (
              <MonthView
                year={view}
                selected={selected}
                onSelect={(m) => {
                  handleChange(view.month(m).startOf("month"));
                  close();
                }}
              />
            )}

            {mode === "year" && (
              <YearView
                year={view}
                selected={selected}
                onSelect={(y) => {
                  handleChange(view.year(y).startOf("year"));
                  close();
                }}
              />
            )}
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}
