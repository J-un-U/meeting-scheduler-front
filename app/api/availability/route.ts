import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  // 기존 가용성 데이터 삭제
  await supabase.from("availability").delete().eq("participant_id", body.participantId)

  // 새로운 가용성 데이터 삽입
  const availabilityData = body.availability.map((item: any) => ({
    participant_id: body.participantId,
    date_time: item.dateTime,
    status: item.status,
  }))

  const { data, error } = await supabase.from("availability").insert(availabilityData).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
