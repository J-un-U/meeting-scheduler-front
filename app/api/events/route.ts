import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const { data: events, error } = await supabase.from("events").select("*").order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(events)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      title: body.title,
      description: body.description,
      time_unit: body.timeUnit,
      max_participants: body.maxParticipants,
      creator_name: body.creatorName,
      creator_color: body.creatorColor,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(event)
}
