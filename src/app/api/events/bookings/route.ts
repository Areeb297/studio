import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      eventType: string
      eventDate: string
      hallId?: string | null
      persons: number
      priceQuoted?: number
      discount?: number
      advance?: number
      terms?: string
      notes?: string
    }

    if (!body?.eventType || !body?.eventDate || !body?.persons) {
      return NextResponse.json({ error: 'eventType, eventDate, persons are required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const bookingNumber = `EV-${Date.now()}`
    const totalAmount = Math.max((body.priceQuoted ?? 0) - (body.discount ?? 0), 0)

    const { error } = await supabase
      .from('event_bookings')
      .insert({
        booking_number: bookingNumber,
        customer_id: null,
        package_id: null,
        venue_id: null,
        event_date: body.eventDate,
        event_start_time: null,
        event_end_time: null,
        event_type: body.eventType,
        event_title: body.notes ?? body.eventType,
        guest_count: body.persons,
        special_requirements: body.terms ?? null,
        package_amount: body.priceQuoted ?? 0,
        additional_services_amount: 0,
        total_amount: totalAmount,
        advance_payment: body.advance ?? 0,
        remaining_balance: Math.max(totalAmount - (body.advance ?? 0), 0),
        security_deposit: 0,
        payment_status: 'pending',
        booking_status: 'confirmed',
        contact_person: null,
        contact_phone: null,
        event_coordinator_id: null,
        setup_instructions: null,
        cleanup_instructions: null,
      } as any)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, bookingNumber })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}


