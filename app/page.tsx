"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Users, Clock, Sparkles, TrendingUp } from "lucide-react"
import { CreateEventDialog } from "@/components/create-event-dialog"
import { NotificationSystem } from "@/components/notification-system"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  time_unit: "day" | "time"
  max_participants: number
  created_at: string
  creator_name: string
  creator_color: string
}

interface Notification {
  id: string
  type: "new_participant" | "availability_update" | "event_complete" | "reminder"
  title: string
  message: string
  eventId: string
  eventTitle: string
  timestamp: Date
  read: boolean
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "new_participant",
      title: "새로운 참가자",
      message: "이영희님이 약속에 참가했습니다",
      eventId: "1",
      eventTitle: "주말 모임",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
      read: false,
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleEventCreated = (newEvent: Event) => {
    setEvents((prev) => [newEvent, ...prev])
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Calendar className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-secondary animate-bounce" />
            </div>
          </div>
          <p className="text-muted-foreground text-lg">약속 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link className="flex items-center gap-3"  href="/">
              <div className="relative">
                <Calendar className="h-8 w-8 text-primary" />
                <TrendingUp className="h-4 w-4 text-secondary absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">약속 잡기</h1>
                <p className="text-sm text-muted-foreground">스마트한 일정 조율</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <NotificationSystem
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onDismiss={handleDismissNotification}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">내 약속들</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            친구들과 함께 날짜를 정하고 일정을 조율해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link key={event.id} href={`/event/${event.id}`}>
              <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer relative overflow-hidden border-0 bg-card/80 backdrop-blur-sm hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-card m-[1px] rounded-[calc(var(--radius)-1px)]">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-card-foreground group-hover:text-primary transition-colors duration-300">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-base leading-relaxed">
                          {event.description}
                        </CardDescription>
                      </div>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-3 py-1 rounded-full">
                        활성
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center gap-6 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          <span className="font-medium">최대 {event.max_participants}명</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-secondary" />
                          <span className="font-medium">{event.time_unit === "day" ? "일 단위" : "시간 단위"}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        생성일: {new Date(event.created_at).toLocaleDateString("ko-KR")}
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                        <div
                          className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm"
                          style={{ backgroundColor: event.creator_color }}
                        />
                        <span className="text-sm font-medium text-muted-foreground">by {event.creator_name}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}

          {events.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-primary" />
                </div>
                <Sparkles className="h-6 w-6 text-secondary absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">아직 약속이 없어요</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md text-pretty">
                첫 번째 약속을 만들어서 친구들과 함께 일정을 조율해보세요!
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 rounded-xl text-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                약속 만들기
              </Button>
            </div>
          )}
        </div>
      </main>

      <CreateEventDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onEventCreated={handleEventCreated}
      />
    </div>
  )
}
