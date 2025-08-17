import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      customerId?: string | null
      waiterId?: string | null
      items: Array<{ menuItemId?: string | null; quantity: number; unitPrice: number }>
      notes?: string | null
      paymentStatus?: string
    }

    if (!body?.items || body.items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const subtotal = body.items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0)
    const tax = 0
    const service = 0
    const discount = 0
    const delivery = 0
    const total = subtotal + tax + service - discount + delivery

    const orderNumber = `SO-${Date.now()}`

    const { data: order, error: orderError } = await supabase
      .from('sales_orders')
      .insert({
        order_number: orderNumber,
        order_date: new Date().toISOString(),
        customer_id: body.customerId ?? null,
        waiter_id: body.waiterId ?? null,
        subtotal,
        tax_amount: tax,
        service_charge: service,
        discount_amount: discount,
        delivery_charges: delivery,
        total_amount: total,
        payment_status: body.paymentStatus ?? 'paid',
        order_status: 'completed',
        kitchen_status: 'ready',
        special_instructions: body.notes ?? null,
      })
      .select('*')
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 })
    }

    const itemsToInsert = body.items.map(it => ({
      sales_order_id: order!.id,
      menu_item_id: it.menuItemId ?? null,
      quantity: it.quantity,
      unit_price: it.unitPrice,
      total_price: it.quantity * it.unitPrice,
    }))

    const { error: itemsError } = await supabase
      .from('sales_order_items')
      .insert(itemsToInsert)

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 400 })
    }

    return NextResponse.json({ id: order!.id, orderNumber })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}


