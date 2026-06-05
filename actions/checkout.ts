'use server'

import { stripe } from '@/lib/stripe/client'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { redirect } from 'next/navigation'

export async function createCheckoutSession(packageSlug: string) {
  const supabase = createServiceRoleClient()

  const { data: pkg } = await supabase
    .from('media_service_packages')
    .select('*')
    .eq('slug', packageSlug)
    .eq('is_active', true)
    .single()

  if (!pkg) redirect('/packages')

  // If no Stripe price ID yet, redirect to start-project for quote
  if (!pkg.stripe_price_id) {
    redirect(`/start-project?package=${packageSlug}`)
  }

  const session = await stripe.checkout.sessions.create({
    mode: pkg.is_recurring ? 'subscription' : 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: pkg.stripe_price_id, quantity: 1 }],
    metadata: {
      package_slug: pkg.slug,
      package_name: pkg.name,
      order_type: pkg.order_type,
      package_id: pkg.id,
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/packages`,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  })

  if (session.url) redirect(session.url)
  redirect('/packages')
}
