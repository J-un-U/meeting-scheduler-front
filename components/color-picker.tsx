"use client"

import { cn } from "@/lib/utils"

interface ColorPickerProps {
  colors: string[]
  selectedColor: string
  onColorChange: (color: string) => void
}

export function ColorPicker({ colors, selectedColor, onColorChange }: ColorPickerProps) {
  const colorOptions = colors || [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f59e0b",
  ]

  return (
    <div className="grid grid-cols-5 gap-2">
      {colorOptions.map((color) => (
        <button
          key={color}
          className={cn(
            "w-10 h-10 rounded-full border-2 transition-all hover:scale-110",
            selectedColor === color ? "border-foreground shadow-md" : "border-border hover:border-muted-foreground",
          )}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
          aria-label={`색상 ${color} 선택`}
        />
      ))}
    </div>
  )
}
