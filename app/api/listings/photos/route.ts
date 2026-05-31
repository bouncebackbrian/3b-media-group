import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const listingId = formData.get('listing_id') as string
  const file = formData.get('file') as File | null
  const category = (formData.get('category') as string) || 'other'

  if (!listingId || !file) {
    return NextResponse.json({ error: 'listing_id and file are required' }, { status: 400 })
  }

  const admin = createServiceRoleClient()

  // Verify the listing belongs to this user
  const { data: listing } = await admin
    .from('media_property_listings')
    .select('id, media_clients!inner(email)')
    .eq('id', listingId)
    .single()

  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

  const clientEmail = (listing.media_clients as unknown as { email: string }).email
  if (clientEmail !== user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const storagePath = `${listingId}/${Date.now()}.${ext}`

  const { error: uploadError } = await admin.storage
    .from('listing-photos')
    .upload(storagePath, file, { contentType: file.type, upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: urlData } = admin.storage.from('listing-photos').getPublicUrl(storagePath)

  // Count existing photos for sort_order
  const { count } = await admin
    .from('media_listing_photos')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', listingId)

  const { data: photo, error: dbErr } = await admin
    .from('media_listing_photos')
    .insert({
      listing_id: listingId,
      storage_path: storagePath,
      public_url: urlData.publicUrl,
      category,
      sort_order: count ?? 0,
      uploaded_by: user.id,
    })
    .select('id, public_url')
    .single()

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

  return NextResponse.json({ success: true, photo })
}
