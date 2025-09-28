"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock, UserPlus, Palette } from "lucide-react"
import { ColorPicker } from "@/components/color-picker"

interface Event {
  id: string
  title: string
  description: string
  participantCount: number
  maxParticipants: number
  timeUnit: "day" | "hour"
  status: "active" | "completed" | "pending"
  createdAt: Date
  createdBy: string
}

const PRESET_COLORS = [
  "#A5D8E6",
  "#FBCFE8",
  "#BBF7D0",
  "#FEF3C7",
  "#DBEAFE",
  "#E0E7FF",
  "#F3E8FF",
  "#FCE7F3",
  "#ECFDF5",
  "#FEF7CD",
]

export default function JoinEventPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [nickname, setNickname] = useState("")
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Mock data - 실제로는 API에서 가져올 데이터
    const mockEvent: Event = {
      id: eventId,
      title: "주말 모임",
      description: "친구들과 함께하는 주말 모임 날짜를 정해요",
      participantCount: 3,
      maxParticipants: 5,
      timeUnit: "day",
      status: "active",
      createdAt: new Date("2024-01-15"),
      createdBy: "김철수",
    }

    setEvent(mockEvent)

    // 랜덤 색상 선택
    const randomColor = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]
    setSelectedColor(randomColor)
  }, [eventId])

  const handleJoin = async () => {
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요")
      return
    }

    if (!event) return

    if (event.participantCount >= event.maxParticipants) {
      setError("참가 인원이 가득 찼습니다")
      return
    }

    setIsJoining(true)
    setError("")

    try {
      // 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 성공 시 이벤트 페이지로 이동
      router.push(`/event/${eventId}`)
    } catch (err) {
      setError("참가 중 오류가 발생했습니다")
    } finally {
      setIsJoining(false)
    }
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">약속을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  const isEventFull = event.participantCount >= event.maxParticipants
  const isEventClosed = event.status === "completed"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">약속 참가</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="space-y-6">
          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.participantCount}/{event.maxParticipants}명 참가
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{event.timeUnit === "day" ? "일 단위" : "시간 단위"}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  생성자: {event.createdBy} • {event.createdAt.toLocaleDateString("ko-KR")}
                </div>

                {event.status === "active" && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">참가 가능</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Join Form */}
          {!isEventFull && !isEventClosed ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  약속에 참가하기
                </CardTitle>
                <CardDescription>닉네임과 색상을 선택해서 약속에 참가해보세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname">닉네임</Label>
                  <Input
                    id="nickname"
                    placeholder="다른 사람들이 볼 수 있는 이름"
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value)
                      setError("")
                    }}
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground">최대 20자까지 입력 가능합니다</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />내 색상
                  </Label>
                  <ColorPicker colors={PRESET_COLORS} selectedColor={selectedColor} onColorChange={setSelectedColor} />
                  <p className="text-xs text-muted-foreground">달력에서 내 일정을 구분할 때 사용됩니다</p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleJoin}
                  disabled={isJoining || !nickname.trim()}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isJoining ? "참가 중..." : "약속에 참가하기"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="space-y-4">
                  {isEventFull && (
                    <>
                      <Users className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <h3 className="font-medium text-foreground mb-2">참가 인원이 가득 찼습니다</h3>
                        <p className="text-sm text-muted-foreground">이미 {event.maxParticipants}명이 참가했습니다</p>
                      </div>
                    </>
                  )}

                  {isEventClosed && (
                    <>
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <h3 className="font-medium text-foreground mb-2">종료된 약속입니다</h3>
                        <p className="text-sm text-muted-foreground">이 약속은 이미 완료되었습니다</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">미리보기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: selectedColor }}
                >
                  {nickname.charAt(0) || "?"}
                </div>
                <div>
                  <div className="font-medium">{nickname || "닉네임"}</div>
                  <div className="text-sm text-muted-foreground">방금 참가함</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
