import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  listing_url: z.string().url(),
})

// Detect which platform the URL belongs to
function detectSource(url: string): string {
  if (/zillow\.com/i.test(url)) return 'zillow'
  if (/redfin\.com/i.test(url)) return 'redfin'
  if (/realtor\.com/i.test(url)) return 'realtor'
  if (/trulia\.com/i.test(url)) return 'trulia'
  if (/homes\.com/i.test(url)) return 'homes'
  if (/compass\.com/i.test(url)) return 'compass'
  if (/mlslistings|mls\./i.test(url)) return 'mls'
  return 'other'
}

// Extract all JSON-LD blocks from HTML
function extractJsonLd(html: string): unknown[] {
  const results: unknown[] = []
  const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    try {
      results.push(JSON.parse(match[1]))
    } catch {
      // skip malformed blocks
    }
  }
  return results
}

// Extract Open Graph and standard meta tags
function extractMeta(html: string): Record<string, string> {
  const meta: Record<string, string> = {}
  const metaRegex = /<meta[^>]+>/gi
  let match
  while ((match = metaRegex.exec(html)) !== null) {
    const tag = match[0]
    const prop = /(?:property|name)=["']([^"']+)["']/i.exec(tag)?.[1]
    const content = /content=["']([^"']*?)["']/i.exec(tag)?.[1]
    if (prop && content) meta[prop] = content
  }
  const title = /<title[^>]*>([^<]+)<\/title>/i.exec(html)?.[1]
  if (title) meta['title'] = title.trim()
  return meta
}

// Pull a field from JSON-LD objects (handles array of schemas)
function fromJsonLd(schemas: unknown[], ...keys: string[]): string | null {
  for (const schema of schemas) {
    if (typeof schema !== 'object' || schema === null) continue
    const obj = schema as Record<string, unknown>
    // unwrap @graph arrays
    if (Array.isArray(obj['@graph'])) {
      const sub = fromJsonLd(obj['@graph'] as unknown[], ...keys)
      if (sub) return sub
    }
    for (const key of keys) {
      const val = obj[key]
      if (typeof val === 'string' && val.trim()) return val.trim()
      if (typeof val === 'number') return String(val)
    }
  }
  return null
}

function fromJsonLdArray(schemas: unknown[], ...keys: string[]): string[] {
  for (const schema of schemas) {
    if (typeof schema !== 'object' || schema === null) continue
    const obj = schema as Record<string, unknown>
    if (Array.isArray(obj['@graph'])) {
      const sub = fromJsonLdArray(obj['@graph'] as unknown[], ...keys)
      if (sub.length) return sub
    }
    for (const key of keys) {
      const val = obj[key]
      if (Array.isArray(val)) return val.filter((v) => typeof v === 'string') as string[]
    }
  }
  return []
}

// Clean price strings: "$485,000" → "$485,000" (keep as display string)
function cleanPrice(raw: string | null): string | null {
  if (!raw) return null
  const m = raw.match(/\$[\d,]+(?:\.\d+)?(?:\s*[kKmM])?/)
  return m ? m[0] : raw.replace(/[^\d$.,kKmM\s]/g, '').trim() || null
}

function parseNum(raw: string | null): number | null {
  if (!raw) return null
  const n = parseFloat(raw.replace(/[^0-9.]/g, ''))
  return isNaN(n) ? null : n
}

export async function POST(req: NextRequest) {
  // Must be authenticated — we don't fetch arbitrary URLs for anonymous callers
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

  const { listing_url } = body.data
  const source = detectSource(listing_url)

  let html = ''
  try {
    const res = await fetch(listing_url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; 3BMediaBot/1.0; +https://3bmediagroup.com)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    // Only read up to 500KB to avoid memory issues
    const reader = res.body?.getReader()
    const chunks: Uint8Array[] = []
    let total = 0
    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done || total > 512_000) break
        if (value) { chunks.push(value); total += value.length }
      }
    }
    html = new TextDecoder().decode(
      chunks.reduce((acc, c) => {
        const merged = new Uint8Array(acc.length + c.length)
        merged.set(acc); merged.set(c, acc.length)
        return merged
      }, new Uint8Array(0))
    )
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: 'Could not fetch listing page. Paste the URL directly in the MLS Link field and fill in the details manually.',
      source_url: listing_url,
      imported_from: source,
      needs_client_permission: true,
    })
  }

  const meta = extractMeta(html)
  const schemas = extractJsonLd(html)

  // ── Address ──────────────────────────────────────────────────
  const address =
    fromJsonLd(schemas, 'address', 'streetAddress', 'name') ??
    meta['og:title'] ??
    meta['twitter:title'] ??
    null

  // ── Price ─────────────────────────────────────────────────────
  const rawPrice =
    fromJsonLd(schemas, 'price', 'offers') ??
    meta['product:price:amount'] ??
    (() => {
      const m = html.match(/\$[\d,]{5,}/)
      return m ? m[0] : null
    })()
  const price = cleanPrice(rawPrice ? String(rawPrice) : null)

  // ── Beds / Baths / Sqft ───────────────────────────────────────
  const beds = parseNum(
    fromJsonLd(schemas, 'numberOfBedrooms', 'bedrooms') ??
    (() => { const m = html.match(/(\d+)\s*(?:bed(?:room)?s?)/i); return m ? m[1] : null })()
  )
  const baths = parseNum(
    fromJsonLd(schemas, 'numberOfBathroomsTotal', 'numberOfFullBathrooms', 'bathrooms') ??
    (() => { const m = html.match(/(\d+(?:\.\d)?)\s*(?:bath(?:room)?s?)/i); return m ? m[1] : null })()
  )
  const sqft = parseNum(
    fromJsonLd(schemas, 'floorSize', 'livingArea') ??
    (() => { const m = html.match(/([\d,]+)\s*(?:sq\.?\s*ft|square\s*feet)/i); return m ? m[1].replace(/,/g, '') : null })()
  )
  const lotSize =
    fromJsonLd(schemas, 'lotSize', 'lotSizeArea') ??
    (() => { const m = html.match(/([\d,]+(?:\.\d+)?)\s*(?:acre|sq\.?\s*ft\s*lot)/i); return m ? m[0] : null })() ??
    null

  // ── Description ───────────────────────────────────────────────
  const description =
    fromJsonLd(schemas, 'description') ??
    meta['og:description'] ??
    meta['description'] ??
    null

  // ── Features ─────────────────────────────────────────────────
  const features = fromJsonLdArray(schemas, 'amenityFeature', 'amenities')
    .slice(0, 12)

  // ── Image URLs (reference only — do not store or display as owned) ─
  const detectedImages: string[] = []
  const ogImage = meta['og:image']
  if (ogImage) detectedImages.push(ogImage)
  const ldImages = fromJsonLdArray(schemas, 'image', 'photo', 'photos')
  ldImages.slice(0, 8).forEach((img) => {
    if (img && !detectedImages.includes(img)) detectedImages.push(img)
  })

  const extracted = {
    extracted_address: address,
    extracted_price: price,
    extracted_beds: beds,
    extracted_baths: baths,
    extracted_sqft: sqft,
    extracted_lot_size: lotSize,
    extracted_description: description,
    extracted_features: features,
    detected_images: detectedImages,
    source_url: listing_url,
    imported_from: source,
    needs_client_permission: true,
  }

  return NextResponse.json({ success: true, ...extracted })
}
