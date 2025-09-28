"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, TrendingUp } from "lucide-react"

interface Participant {
  id: string
  nickname: string
  color: string
  availability: { [key: string]: "available" | "unavailable" | "maybe" }
}

interface ResultsAnalysisProps {
  participants: Participant[]
  timeUnit: "day" | "hour"
}

export function ResultsAnalysis({ participants, timeUnit }: ResultsAnalysisProps) {
  const analyzeAvailability = () => {
    const dateAvailability: { [key: string]: { available: string[]; unavailable: string[]; maybe: string[] } } = {}

    // 모든 참가자의 가용성 데이터를 수집
    participants.forEach((participant) => {
      Object.entries(participant.availability).forEach(([date, status]) => {
        if (!dateAvailability[date]) {
          dateAvailability[date] = { available: [], unavailable: [], maybe: [] }
        }
        dateAvailability[date][status].push(participant.nickname)
      })
    })

    // 날짜별로 분석
    const results = Object.entries(dateAvailability).map(([date, availability]) => {
      const totalParticipants = participants.length
      const availableCount = availability.available.length
      const unavailableCount = availability.unavailable.length
      const maybeCount = availability.maybe.length
      const respondedCount = availableCount + unavailableCount + maybeCount

      return {
        date,
        availableCount,
        unavailableCount,
        maybeCount,
        respondedCount,
        totalParticipants,
        availableParticipants: availability.available,
        unavailableParticipants: availability.unavailable,
        maybeParticipants: availability.maybe,
        score: availableCount + maybeCount * 0.5, // 가중치 점수
      }
    })

    // 점수순으로 정렬
    results.sort((a, b) => b.score - a.score)

    return results
  }

  const results = analyzeAvailability()
  const bestDates = results.filter((r) => r.availableCount === Math.max(...results.map((r) => r.availableCount)))
  const allAvailableDates = results.filter((r) => r.availableCount === participants.length)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "short",
    })
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              전체 참가자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participants.length}명</div>
            <p className="text-xs text-muted-foreground">일정 조율 중</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              모두 가능한 날
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{allAvailableDates.length}일</div>
            <p className="text-xs text-muted-foreground">전원 참석 가능</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              최적 날짜
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{bestDates.length}일</div>
            <p className="text-xs text-muted-foreground">가장 많은 인원 가능</p>
          </CardContent>
        </Card>
      </div>

      {/* All Available Dates */}
      {allAvailableDates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-600">모두 가능한 날짜</CardTitle>
            <CardDescription>전체 참가자가 모두 참석 가능한 날짜입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {allAvailableDates.map((result) => (
                <div key={result.date} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">{formatDate(result.date)}</div>
                    <div className="text-sm text-muted-foreground">{result.availableParticipants.join(", ")}</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    {result.availableCount}명 가능
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Best Dates (if no all-available dates) */}
      {allAvailableDates.length === 0 && bestDates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-600">최적 날짜</CardTitle>
            <CardDescription>가장 많은 인원이 참석 가능한 날짜입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {bestDates.slice(0, 5).map((result) => (
                <div key={result.date} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium">{formatDate(result.date)}</div>
                    <div className="text-sm text-muted-foreground">
                      가능: {result.availableParticipants.join(", ")}
                      {result.maybeParticipants.length > 0 && (
                        <span className="text-yellow-600"> / 애매함: {result.maybeParticipants.join(", ")}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {result.availableCount}명 가능
                    </Badge>
                    {result.maybeCount > 0 && (
                      <Badge variant="outline" className="ml-1 text-yellow-700 border-yellow-200">
                        {result.maybeCount}명 애매함
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">전체 결과</CardTitle>
          <CardDescription>모든 날짜별 참가 가능 현황입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result) => (
              <div key={result.date} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                <div className="flex-1">
                  <div className="font-medium text-sm">{formatDate(result.date)}</div>
                  <div className="text-xs text-muted-foreground">
                    응답: {result.respondedCount}/{result.totalParticipants}명
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {result.availableCount > 0 && (
                    <Badge variant="outline" className="text-green-700 border-green-200 text-xs">
                      {result.availableCount}
                    </Badge>
                  )}
                  {result.maybeCount > 0 && (
                    <Badge variant="outline" className="text-yellow-700 border-yellow-200 text-xs">
                      {result.maybeCount}
                    </Badge>
                  )}
                  {result.unavailableCount > 0 && (
                    <Badge variant="outline" className="text-red-700 border-red-200 text-xs">
                      {result.unavailableCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
