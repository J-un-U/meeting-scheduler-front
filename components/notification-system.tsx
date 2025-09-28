"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, Calendar, Users, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface NotificationSystemProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onDismiss: (id: string) => void
}

export function NotificationSystem({ notifications, onMarkAsRead, onDismiss }: NotificationSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "new_participant":
        return <Users className="h-4 w-4 text-blue-600" />
      case "availability_update":
        return <Calendar className="h-4 w-4 text-green-600" />
      case "event_complete":
        return <Clock className="h-4 w-4 text-purple-600" />
      case "reminder":
        return <Bell className="h-4 w-4 text-orange-600" />
    }
  }

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "new_participant":
        return "bg-blue-50 border-blue-200"
      case "availability_update":
        return "bg-green-50 border-green-200"
      case "event_complete":
        return "bg-purple-50 border-purple-200"
      case "reminder":
        return "bg-orange-50 border-orange-200"
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "방금 전"
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return timestamp.toLocaleDateString("ko-KR")
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">알림</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">새로운 알림이 없습니다</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 hover:bg-muted/50 cursor-pointer transition-colors",
                      !notification.read && "bg-muted/30",
                    )}
                    onClick={() => {
                      if (!notification.read) {
                        onMarkAsRead(notification.id)
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.eventTitle}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDismiss(notification.id)
                            }}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {!notification.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  notifications.forEach((n) => {
                    if (!n.read) onMarkAsRead(n.id)
                  })
                }}
              >
                모두 읽음으로 표시
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
