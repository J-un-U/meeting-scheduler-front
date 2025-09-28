"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users } from "lucide-react"
import { ColorPicker } from "@/components/color-picker"
import { useRouter } from "next/navigation"

interface CreateEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEventCreated: (event: any) => void
}

export function CreateEventDialog({ open, onOpenChange, onEventCreated }: CreateEventDialogProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    nickname: "",
    maxParticipants: "5",
    timeUnit: "day" as "day" | "time",
    availabilityType: "available" as "available" | "unavailable",
    creatorColor: "#8B5CF6",
  })
  const router = useRouter()

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleCreate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          timeUnit: formData.timeUnit,
          maxParticipants: Number.parseInt(formData.maxParticipants),
          creatorName: formData.nickname,
          creatorColor: formData.creatorColor,
        }),
      })

      if (response.ok) {
        const newEvent = await response.json()
        onEventCreated(newEvent)
        onOpenChange(false)

        // 이벤트 생성 후 해당 이벤트의 참가 페이지로 이동
        router.push(`/event/${newEvent.id}/join`)

        // 폼 초기화
        setStep(1)
        setFormData({
          title: "",
          description: "",
          nickname: "",
          maxParticipants: "5",
          timeUnit: "day",
          availabilityType: "available",
          creatorColor: "#8B5CF6",
        })
      } else {
        console.error("Failed to create event")
      }
    } catch (error) {
      console.error("Error creating event:", error)
    } finally {
      setLoading(false)
    }
  }

  const isStep1Valid = formData.title.trim() && formData.description.trim()
  const isStep2Valid = formData.nickname.trim() && formData.maxParticipants

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />새 약속 만들기
          </DialogTitle>
          <DialogDescription>
            단계 {step}/3: {step === 1 ? "기본 정보" : step === 2 ? "참가자 설정" : "날짜 선택 방식"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">약속 제목</Label>
                <Input
                  id="title"
                  placeholder="예: 주말 모임, 스터디 그룹"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">약속 설명</Label>
                <Textarea
                  id="description"
                  placeholder="약속에 대한 간단한 설명을 입력해주세요"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 2: Participant Settings */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">내 닉네임</Label>
                <Input
                  id="nickname"
                  placeholder="다른 사람들이 볼 수 있는 이름"
                  value={formData.nickname}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">최대 참가자 수</Label>
                <Select
                  value={formData.maxParticipants}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, maxParticipants: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {num}명
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>내 색상</Label>
                <ColorPicker
                  colors={[
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
                  ]}
                  selectedColor={formData.creatorColor}
                  onColorChange={(color) => setFormData((prev) => ({ ...prev, creatorColor: color }))}
                />
              </div>
            </div>
          )}

          {/* Step 3: Time Unit & Availability Type */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>시간 단위 선택</Label>
                <RadioGroup
                  value={formData.timeUnit}
                  onValueChange={(value: "day" | "time") => setFormData((prev) => ({ ...prev, timeUnit: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="day" id="day" />
                    <Label htmlFor="day" className="flex items-center gap-2 cursor-pointer">
                      <Calendar className="h-4 w-4" />일 단위 (날짜만)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="time" id="time" />
                    <Label htmlFor="time" className="flex items-center gap-2 cursor-pointer">
                      <Clock className="h-4 w-4" />
                      시간 단위 (시간 포함)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>선택 방식</Label>
                <RadioGroup
                  value={formData.availabilityType}
                  onValueChange={(value: "available" | "unavailable") =>
                    setFormData((prev) => ({ ...prev, availabilityType: value }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="available" id="available" />
                    <Label htmlFor="available" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-200"></div>
                        가능한 날짜 선택
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unavailable" id="unavailable" />
                    <Label htmlFor="unavailable" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-200"></div>
                        불가능한 날짜 선택
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack} disabled={step === 1}>
              이전
            </Button>

            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                다음
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "생성 중..." : "약속 만들기"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
