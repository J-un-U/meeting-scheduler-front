import dayjs from "dayjs";

export type PickerMode = "date" | "month" | "year";

export interface DatePickerProps {
  value?: dayjs.Dayjs | null;
  mode?: PickerMode;
  onChange?: (date: dayjs.Dayjs) => void;
}

export interface CalendarProps {
  month: dayjs.Dayjs;
  selected: dayjs.Dayjs | null;
  onSelect: (date: dayjs.Dayjs) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export interface MonthPickerProps {
  year: dayjs.Dayjs;
  selected: dayjs.Dayjs | null;
  onSelect: (month: number) => void;
}

export interface YearPickerProps {
  year: dayjs.Dayjs;
  selected: dayjs.Dayjs | null;
  onSelect: (year: number) => void;
}