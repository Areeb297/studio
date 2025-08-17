import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      itemName?: string
      quantity: number
      totalCost: number
      notes?: string
    }

    if (!body?.quantity || !body?.totalCost) {
      return NextResponse.json({ error: 'quantity and totalCost are required' }, { status: 400 })
    }

    const unitCost = body.totalCost / body.quantity
    const supabase = createAdminClient()

    const movementNumber = `PO-${Date.now()}`

    const { error } = await supabase
      .from('stock_movements')
      .insert({
        movement_number: movementNumber,
        item_id: null, // Optional: wire to actual inventory item when UI provides it
        movement_type: 'purchase',
        quantity: body.quantity,
        unit_cost: unitCost,
        total_value: body.totalCost,
        reference_type: 'purchase',
        notes: body.notes ?? body.itemName ?? null,
      } as any)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, movementNumber })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}


