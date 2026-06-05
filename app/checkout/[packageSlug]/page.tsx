import { createCheckoutSession } from '@/actions/checkout'

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ packageSlug: string }>
}) {
  const { packageSlug } = await params
  await createCheckoutSession(packageSlug)
}
