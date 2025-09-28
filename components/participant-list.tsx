"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus, Copy, Check } from "lucide-react"

interface Participant {
  id: string
  nickname: string
  color: string
  availability: { [key: string]: "available" | "unavailable" | "maybe" }
  joinedAt: Date
}

interface ParticipantListProps {
  participants: Participant[]
  maxParticipants: number
  eventId: string
}

export function ParticipantList({ participants, maxParticipants, eventId }: ParticipantListProps) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const inviteLink = `${typeof window !== "undefined" ? window.location.origin : ""}/event/${eventId}/join`

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const getAvailabilityStats = (participant: Participant) => {
    const availability = participant.availability
    const total = Object.keys(availability).length
    const available = Object.values(availability).filter((v) => v === "available").length
    const unavailable = Object.values(availability).filter((v) => v === "unavailable").length
    const maybe = Object.values(availability).filter((v) => v === "maybe").length

    return { total, available, unavailable, maybe }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">참가자 목록</h3>
          <p className="text-sm text-muted-foreground">
            {participants.length}/{maxParticipants}명이 참가했습니다
          </p>
        </div>

        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <UserPlus className="h-4 w-4 mr-2" />
              초대하기
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>친구 초대하기</DialogTitle>
              <DialogDescription>아래 링크를 복사해서 친구들에게 공유해보세요</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input value={inviteLink} readOnly className="flex-1" />
                <Button variant="outline" size="sm" onClick={copyInviteLink} className="shrink-0 bg-transparent">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                링크를 통해 최대 {maxParticipants - participants.length}명이 더 참가할 수 있습니다
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {participants.map((participant) => {
          const stats = getAvailabilityStats(participant)

          return (
            <Card key={participant.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10" style={{ backgroundColor: participant.color }}>
                    <AvatarFallback className="text-white font-medium">{participant.nickname.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-base">{participant.nickname}</CardTitle>
                    <CardDescription className="text-sm">
                      {participant.joinedAt.toLocaleDateString("ko-KR")}에 참가
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {stats.total > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-green-700 border-green-200">
                      가능 {stats.available}일
                    </Badge>
                    <Badge variant="outline" className="text-red-700 border-red-200">
                      불가능 {stats.unavailable}일
                    </Badge>
                    {stats.maybe > 0 && (
                      <Badge variant="outline" className="text-yellow-700 border-yellow-200">
                        애매함 {stats.maybe}일
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">아직 일정을 입력하지 않았습니다</p>
                )}
              </CardContent>
            </Card>
          )
        })}

        {participants.length < maxParticipants && (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <UserPlus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  {maxParticipants - participants.length}명이 더 참가할 수 있습니다
                </p>
                <Button variant="outline" size="sm" onClick={() => setInviteDialogOpen(true)}>
                  초대 링크 복사
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
