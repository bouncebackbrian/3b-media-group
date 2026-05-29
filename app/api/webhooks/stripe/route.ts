import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return new NextResponse('Missing signature', { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new NextResponse('Webhook signature verification failed', { status: 400 })
  }

  const supabase = createServiceRoleClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session, supabase)
        break
      }
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        await supabase
          .from('media_orders')
          .update({ payment_status: 'paid', updated_at: new Date().toISOString() })
          .eq('stripe_payment_intent_id', pi.id)
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        await supabase
          .from('media_orders')
          .update({ payment_status: 'failed', updated_at: new Date().toISOString() })
          .eq('stripe_payment_intent_id', pi.id)
        break
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        if (charge.payment_intent) {
          await supabase
            .from('media_orders')
            .update({ payment_status: 'refunded', updated_at: new Date().toISOString() })
            .eq('stripe_payment_intent_id', charge.payment_intent)
        }
        break
      }
      case 'customer.subscription.deleted': {
        // Match by stripe_subscription_id (sub_...), not stripe_session_id (cs_...)
        const sub = event.data.object as Stripe.Subscription
        await supabase
          .from('media_orders')
          .update({ fulfillment_status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', sub.id)
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return new NextResponse('Handler error', { status: 500 })
  }

  return new NextResponse('OK', { status: 200 })
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
) {
  const email = session.customer_details?.email
  const name = session.customer_details?.name
  if (!email) return

  // Upsert customer
  const { data: customer } = await supabase
    .from('media_customers')
    .upsert(
      {
        email,
        full_name: name ?? null,
        stripe_customer_id: session.customer ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email', ignoreDuplicates: false }
    )
    .select('id')
    .single()

  if (!customer) return

  // Create order — store subscription id when present so cancellation webhook can match
  const { data: order } = await supabase
    .from('media_orders')
    .insert({
      customer_id: customer.id,
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent ?? null,
      stripe_subscription_id: session.subscription ?? null,
      stripe_customer_id: session.customer ?? null,
      amount: session.amount_total ?? 0,
      currency: session.currency ?? 'usd',
      payment_status: 'paid',
      fulfillment_status: 'intake_sent',
      metadata: session.metadata ?? {},
    })
    .select('id')
    .single()

  if (!order) return

  // Log activity
  await supabase.from('media_activity_log').insert({
    entity_type: 'order',
    entity_id: order.id,
    action: 'order_created',
    actor: 'webhook',
    details: {
      package_name: session.metadata?.package_name,
      amount: session.amount_total,
      email,
    },
  })
}
