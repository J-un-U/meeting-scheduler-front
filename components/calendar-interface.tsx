"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Save, RotateCcw, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarInterfaceProps {
  event: {
    id: string
    timeUnit: "day" | "hour"
  }
  currentUser: {
    id: string
    nickname: string
    color: string
    availability: { [key: string]: "available" | "unavailable" | "maybe" }
  } | null
  participants: Array<{
    id: string
    nickname: string
    color: string
    availability: { [key: string]: "available" | "unavailable" | "maybe" }
  }>
  onAvailabilityChange: (availability: { [key: string]: "available" | "unavailable" | "maybe" }) => void
  onSaveComplete?: () => void
}

export function CalendarInterface({
  event,
  currentUser,
  participants,
  onAvailabilityChange,
  onSaveComplete,
}: CalendarInterfaceProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [selectionMode, setSelectionMode] = useState<"available" | "unavailable" | "maybe">("available")
  const [isSelecting, setIsSelecting] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<Set<string>>(new Set())

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 22; hour++) {
      const timeSlot = `${hour.toString().padStart(2, "0")}:00-${(hour + 1).toString().padStart(2, "0")}:00`
      slots.push({ value: timeSlot, label: `${hour}시 - ${hour + 1}시` })
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  useEffect(() => {
    if (currentUser) {
      if (event.timeUnit === "day") {
        const userAvailability = new Set(
          Object.keys(currentUser.availability).filter((date) => currentUser.availability[date] === selectionMode),
        )
        setSelectedDates(userAvailability)
      } else {
        if (selectedDate) {
          const dateKey = formatDateKey(selectedDate)
          const timeSlotKeys = Object.keys(currentUser.availability).filter(
            (key) => key.startsWith(dateKey) && currentUser.availability[key] === selectionMode,
          )
          const slots = new Set(timeSlotKeys.map((key) => key.split("T")[1]))
          setSelectedTimeSlots(slots)
        }
      }
    }
  }, [currentUser, selectionMode, selectedDate, event.timeUnit])

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const formatTimeSlotKey = (date: Date, timeSlot: string) => {
    return `${formatDateKey(date)}T${timeSlot}`
  }

  const handleDateClick = (date: Date) => {
    if (event.timeUnit === "hour") {
      setSelectedDate(date)
      const dateKey = formatDateKey(date)
      if (currentUser) {
        const timeSlotKeys = Object.keys(currentUser.availability).filter(
          (key) => key.startsWith(dateKey) && currentUser.availability[key] === selectionMode,
        )
        const slots = new Set(timeSlotKeys.map((key) => key.split("T")[1]))
        setSelectedTimeSlots(slots)
      }
      return
    }

    const dateKey = formatDateKey(date)
    const newSelectedDates = new Set(selectedDates)

    if (newSelectedDates.has(dateKey)) {
      newSelectedDates.delete(dateKey)
    } else {
      newSelectedDates.add(dateKey)
    }

    setSelectedDates(newSelectedDates)
    setHasUnsavedChanges(true)
  }

  const handleTimeSlotClick = (timeSlot: string) => {
    if (!selectedDate) return

    const newSelectedTimeSlots = new Set(selectedTimeSlots)

    if (newSelectedTimeSlots.has(timeSlot)) {
      newSelectedTimeSlots.delete(timeSlot)
    } else {
      newSelectedTimeSlots.add(timeSlot)
    }

    setSelectedTimeSlots(newSelectedTimeSlots)
    setHasUnsavedChanges(true)
  }

  const getDateStatus = (date: Date) => {
    const dateKey = formatDateKey(date)

    if (event.timeUnit === "hour") {
      const dateTimeSlots = timeSlots.map((slot) => `${dateKey}T${slot.value}`)
      const participantStatuses = participants.flatMap((p) =>
        dateTimeSlots.map((slot) => p.availability[slot]).filter(Boolean),
      )

      if (participantStatuses.length === 0) return null

      const availableCount = participantStatuses.filter((s) => s === "available").length
      const totalCount = participantStatuses.length

      if (availableCount === totalCount) return "all-available"
      if (availableCount > totalCount / 2) return "most-available"
      if (availableCount > 0) return "some-available"
      return "none-available"
    } else {
      const participantStatuses = participants.map((p) => p.availability[dateKey]).filter(Boolean)

      if (participantStatuses.length === 0) return null

      const availableCount = participantStatuses.filter((s) => s === "available").length
      const totalCount = participantStatuses.length

      if (availableCount === totalCount) return "all-available"
      if (availableCount > totalCount / 2) return "most-available"
      if (availableCount > 0) return "some-available"
      return "none-available"
    }
  }

  const saveChanges = () => {
    if (!currentUser) return

    const newAvailability = { ...currentUser.availability }

    if (event.timeUnit === "day") {
      Object.keys(newAvailability).forEach((dateKey) => {
        if (newAvailability[dateKey] === selectionMode) {
          delete newAvailability[dateKey]
        }
      })

      selectedDates.forEach((dateKey) => {
        newAvailability[dateKey] = selectionMode
      })
    } else {
      if (selectedDate) {
        const dateKey = formatDateKey(selectedDate)

        Object.keys(newAvailability).forEach((key) => {
          if (key.startsWith(dateKey) && newAvailability[key] === selectionMode) {
            delete newAvailability[key]
          }
        })

        selectedTimeSlots.forEach((timeSlot) => {
          const timeSlotKey = formatTimeSlotKey(selectedDate, timeSlot)
          newAvailability[timeSlotKey] = selectionMode
        })
      }
    }

    onAvailabilityChange(newAvailability)
    setHasUnsavedChanges(false)

    if (onSaveComplete) {
      onSaveComplete()
    }
  }

  const resetChanges = () => {
    if (currentUser) {
      if (event.timeUnit === "day") {
        const userAvailability = new Set(
          Object.keys(currentUser.availability).filter((date) => currentUser.availability[date] === selectionMode),
        )
        setSelectedDates(userAvailability)
      } else {
        if (selectedDate) {
          const dateKey = formatDateKey(selectedDate)
          const timeSlotKeys = Object.keys(currentUser.availability).filter(
            (key) => key.startsWith(dateKey) && currentUser.availability[key] === selectionMode,
          )
          const slots = new Set(timeSlotKeys.map((key) => key.split("T")[1]))
          setSelectedTimeSlots(slots)
        }
      }
      setHasUnsavedChanges(false)
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"]

  const handleMouseUp = () => {
    setIsSelecting(false)
  }

  const handleMouseDown = (date: Date) => {
    setIsSelecting(true)
    handleDateClick(date)
  }

  const handleMouseEnter = (date: Date) => {
    if (isSelecting) {
      handleDateClick(date)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={selectionMode} onValueChange={(value: any) => setSelectionMode(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available" className="text-green-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-200"></div>
              가능한 {event.timeUnit === "hour" ? "시간" : "날짜"}
            </div>
          </TabsTrigger>
          <TabsTrigger value="unavailable" className="text-red-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-200"></div>
              불가능한 {event.timeUnit === "hour" ? "시간" : "날짜"}
            </div>
          </TabsTrigger>
          <TabsTrigger value="maybe" className="text-yellow-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-200"></div>
              애매한 {event.timeUnit === "hour" ? "시간" : "날짜"}
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectionMode} className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                  {event.timeUnit === "hour" && selectedDate && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      - {selectedDate.getDate()}일 시간 선택
                    </span>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {event.timeUnit === "hour" && selectedDate && (
                    <Button variant="outline" size="sm" onClick={() => setSelectedDate(null)}>
                      날짜 선택으로
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {event.timeUnit === "hour" && selectedDate ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일의 시간을 선택하세요
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedTimeSlots.has(slot.value)
                      return (
                        <button
                          key={slot.value}
                          className={cn(
                            "p-3 text-sm rounded-lg border transition-colors",
                            "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring",
                            isSelected &&
                              selectionMode === "available" &&
                              "bg-green-200 text-green-800 border-green-300",
                            isSelected && selectionMode === "unavailable" && "bg-red-200 text-red-800 border-red-300",
                            isSelected &&
                              selectionMode === "maybe" &&
                              "bg-yellow-200 text-yellow-800 border-yellow-300",
                            !isSelected && "bg-background border-border",
                          )}
                          onClick={() => handleTimeSlotClick(slot.value)}
                        >
                          {slot.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {weekDays.map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                    {days.map((date, index) => {
                      if (!date) {
                        return <div key={index} className="p-2"></div>
                      }

                      const dateKey = formatDateKey(date)
                      const isSelected = event.timeUnit === "day" ? selectedDates.has(dateKey) : false
                      const dateStatus = getDateStatus(date)
                      const isToday = date.toDateString() === new Date().toDateString()

                      return (
                        <button
                          key={dateKey}
                          className={cn(
                            "p-2 text-sm rounded-md transition-colors relative select-none",
                            "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring",
                            isSelected && selectionMode === "available" && "bg-green-200 text-green-800",
                            isSelected && selectionMode === "unavailable" && "bg-red-200 text-red-800",
                            isSelected && selectionMode === "maybe" && "bg-yellow-200 text-yellow-800",
                            isToday && "font-bold border-2 border-primary",
                            dateStatus === "all-available" && "ring-2 ring-green-300",
                            dateStatus === "most-available" && "ring-2 ring-green-200",
                            dateStatus === "some-available" && "ring-2 ring-yellow-200",
                            dateStatus === "none-available" && "ring-2 ring-red-200",
                            event.timeUnit === "hour" && "cursor-pointer",
                          )}
                          onMouseDown={() => event.timeUnit === "day" && handleMouseDown(date)}
                          onMouseEnter={() => event.timeUnit === "day" && handleMouseEnter(date)}
                          onClick={() => handleDateClick(date)}
                        >
                          {date.getDate()}
                          {dateStatus && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary"></div>
                          )}
                          {event.timeUnit === "hour" && (
                            <Clock className="absolute -bottom-1 -right-1 w-3 h-3 text-muted-foreground" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {hasUnsavedChanges && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">변경사항이 있습니다. 저장하시겠습니까?</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={resetChanges}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  취소
                </Button>
                <Button
                  size="sm"
                  onClick={saveChanges}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">범례</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-green-300"></div>
              <span>모두 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-green-200"></div>
              <span>대부분 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-yellow-200"></div>
              <span>일부 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-red-200"></div>
              <span>모두 불가능</span>
            </div>
          </div>
          {event.timeUnit === "hour" && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Clock className="h-4 w-4" />
                <span>시간 단위 선택: 날짜를 클릭한 후 원하는 시간대를 선택하세요</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getDaysInMonth(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days = []

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }

  return days
}
