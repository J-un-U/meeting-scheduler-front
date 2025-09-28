"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Users, Clock, Settings, Share2 } from "lucide-react"
import { CalendarInterface } from "@/components/calendar-interface"
import { ParticipantList } from "@/components/participant-list"
import { ResultsAnalysis } from "@/components/results-analysis"

interface Event {
  id: string
  title: string
  description: string
  participantCount: number
  maxParticipants: number
  timeUnit: "day" | "hour"
  status: "active" | "completed" | "pending"
  createdAt: Date
  hasUpdates: boolean
  createdBy: string
}

interface Participant {
  id: string
  nickname: string
  color: string
  availability: { [key: string]: "available" | "unavailable" | "maybe" }
  joinedAt: Date
}

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [currentUser, setCurrentUser] = useState<Participant | null>(null)
  const [activeTab, setActiveTab] = useState("calendar")

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
      hasUpdates: true,
      createdBy: "김철수",
    }

    const mockParticipants: Participant[] = [
      {
        id: "1",
        nickname: "김철수",
        color: "#A5D8E6",
        availability: {
          "2024-01-20": "available",
          "2024-01-21": "available",
          "2024-01-22": "unavailable",
        },
        joinedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        nickname: "이영희",
        color: "#FBCFE8",
        availability: {
          "2024-01-20": "maybe",
          "2024-01-21": "available",
          "2024-01-22": "available",
        },
        joinedAt: new Date("2024-01-16"),
      },
    ]

    setEvent(mockEvent)
    setParticipants(mockParticipants)
    setCurrentUser(mockParticipants[0]) // 현재 사용자를 첫 번째 참가자로 설정
  }, [eventId])

  const getStatusBadge = (status: Event["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">진행중</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">완료</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">대기중</Badge>
    }
  }

  const handleSaveComplete = () => {
    setActiveTab("results")
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                돌아가기
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-semibold text-foreground">{event.title}</h1>
                {getStatusBadge(event.status)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                공유
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                설정
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Event Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <CardDescription>{event.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
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
              <div>생성자: {event.createdBy}</div>
              <div>생성일: {event.createdAt.toLocaleDateString("ko-KR")}</div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar">달력</TabsTrigger>
            <TabsTrigger value="participants">참가자</TabsTrigger>
            <TabsTrigger value="results">결과</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <CalendarInterface
              event={event}
              currentUser={currentUser}
              participants={participants}
              onAvailabilityChange={(availability) => {
                if (currentUser) {
                  setParticipants((prev) => prev.map((p) => (p.id === currentUser.id ? { ...p, availability } : p)))
                }
              }}
              onSaveComplete={handleSaveComplete}
            />
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <ParticipantList participants={participants} maxParticipants={event.maxParticipants} eventId={event.id} />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <ResultsAnalysis participants={participants} timeUnit={event.timeUnit} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
