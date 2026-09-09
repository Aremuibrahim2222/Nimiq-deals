/**
 * ProductVisual
 * -------------
 * Renders a small, original line-icon illustration for a product instead of
 * a photo.
 *
 * Why this exists: the previous product images came from picsum.photos —
 * real photography, but picked by a random seed string, so it had no actual
 * relationship to the product name (a "Mechanical Keyboard" could render a
 * photo of literally anything). Swapping in accurate *photos* would mean
 * either (a) hot-linking real product photography from retailer/brand
 * sites, which is both a copyright/trademark risk and exactly the kind of
 * "unreliable external image URL" the original request asked to move away
 * from, or (b) an image-hosting pipeline this project doesn't have.
 *
 * Instead, every product gets a purpose-drawn icon that actually matches
 * what it is, rendered as inline SVG — no network request, nothing that can
 * 404 or hotlink-break on Vercel, no licensing question. It reuses the same
 * stroke-icon style already used in BottomNav.tsx for visual consistency.
 */

const CATEGORY_TINT: Record<string, { bg: string; fg: string }> = {
  electronics: { bg: '#161A33', fg: '#FFDD85' },
  fashion: { bg: '#FFEDBD', fg: '#0F1222' },
  gaming: { bg: '#0F1222', fg: '#2FD599' },
  home: { bg: '#E9FBF4', fg: '#0F1222' },
  accessories: { bg: '#FFF8E6', fg: '#0F1222' },
  gifts: { bg: '#C7F5E2', fg: '#0F1222' },
}

function Icon({ id }: { id: string }) {
  const p = { stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }
  switch (id) {
    case 'headphones':
      return (
        <g {...p}>
          <path d="M6 30v-6a18 18 0 0 1 36 0v6" />
          <rect x="3" y="28" width="9" height="16" rx="3.5" />
          <rect x="36" y="28" width="9" height="16" rx="3.5" />
        </g>
      )
    case 'keyboard':
      return (
        <g {...p}>
          <rect x="4" y="16" width="40" height="20" rx="3" />
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3, 4, 5, 6].map((col) => (
              <rect key={`${row}-${col}`} x={8 + col * 5} y={20 + row * 5} width="3.2" height="3.2" rx="0.8" fill="currentColor" stroke="none" />
            ))
          )}
        </g>
      )
    case 'ssd':
      return (
        <g {...p}>
          <rect x="9" y="12" width="30" height="24" rx="4" />
          <circle cx="24" cy="24" r="1.6" fill="currentColor" stroke="none" />
          <path d="M15 30h4M15 34h8" />
        </g>
      )
    case 'fitness-band':
      return (
        <g {...p}>
          <path d="M16 8c-4 4-4 32 0 36M32 8c4 4 4 32 0 36" />
          <rect x="16" y="15" width="16" height="18" rx="4" />
        </g>
      )
    case 'webcam':
      return (
        <g {...p}>
          <circle cx="24" cy="20" r="10" />
          <circle cx="24" cy="20" r="4" fill="currentColor" stroke="none" />
          <path d="M14 34h20M24 30v4" />
        </g>
      )
    case 'charger':
      return (
        <g {...p}>
          <path d="M12 40 30 8h6L24 22h12L18 40h-6l8-14H12Z" />
        </g>
      )
    case 'hoodie':
      return (
        <g {...p}>
          <path d="M14 10c3-3 17-3 20 0l6 6-4 6-4-3v23H16V19l-4 3-4-6 6-6Z" />
          <path d="M18 10a6 6 0 0 0 12 0" />
        </g>
      )
    case 'sneaker':
      return (
        <g {...p}>
          <path d="M5 32c0-5 3-8 8-9l6-6 5 4 9-1 9 6c2 1 3 3 3 6H5Z" />
          <path d="M13 23v9M20 21l3 11" />
        </g>
      )
    case 'shirt':
      return (
        <g {...p}>
          <path d="M17 8 9 14l3 6 4-2v22h16V18l4 2 3-6-8-6-3 3h-5l-3-3Z" />
        </g>
      )
    case 'jacket':
      return (
        <g {...p}>
          <path d="M16 8 8 13l3 6 5-3v24h16V16l5 3 3-6-8-5-3 2v0h-10Z" />
          <path d="M24 15v25" />
        </g>
      )
    case 'beanie':
      return (
        <g {...p}>
          <path d="M9 28a15 15 0 0 1 30 0Z" />
          <path d="M8 28h32M24 13v-5" />
        </g>
      )
    case 'controller':
      return (
        <g {...p}>
          <path d="M12 18h24l4 12a5 5 0 0 1-9 3l-3-4H20l-3 4a5 5 0 0 1-9-3l4-12Z" />
          <path d="M18 24h-4m2-2v4" />
          <circle cx="33" cy="22" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="37" cy="26" r="1.4" fill="currentColor" stroke="none" />
        </g>
      )
    case 'mouse':
      return (
        <g {...p}>
          <path d="M24 8c8 0 12 6 12 16s-4 16-12 16-12-6-12-16 4-16 12-16Z" />
          <path d="M24 8v14M18 12h12" />
        </g>
      )
    case 'headset':
      return (
        <g {...p}>
          <path d="M8 26v-4a16 16 0 0 1 32 0v4" />
          <rect x="6" y="24" width="7" height="13" rx="3" />
          <rect x="35" y="24" width="7" height="13" rx="3" />
          <path d="M13 34c4 6 12 6 12 6" />
        </g>
      )
    case 'monitor-arm':
      return (
        <g {...p}>
          <path d="M10 38V18a4 4 0 0 1 4-4h6" />
          <rect x="20" y="6" width="20" height="14" rx="2" />
          <path d="M10 38h8" />
        </g>
      )
    case 'console':
      return (
        <g {...p}>
          <rect x="8" y="14" width="32" height="20" rx="3" />
          <circle cx="32" cy="24" r="3" />
          <path d="M14 20v8M10 24h8" />
        </g>
      )
    case 'pour-over':
      return (
        <g {...p}>
          <path d="M16 10h16l-6 14v6h-4v-6z" />
          <path d="M12 32h24l-3 8H15z" />
        </g>
      )
    case 'diffuser':
      return (
        <g {...p}>
          <path d="M18 44h12V26c3-4 3-10 0-14H18c-3 4-3 10 0 14Z" />
          <path d="M20 6c1 2-1 3 0 5M24 4c1 2-1 3 0 5M28 6c1 2-1 3 0 5" />
        </g>
      )
    case 'blanket':
      return (
        <g {...p}>
          <rect x="7" y="12" width="34" height="24" rx="2" />
          <path d="M7 19h34M7 26h34M7 33h34" />
        </g>
      )
    case 'skillet':
      return (
        <g {...p}>
          <circle cx="20" cy="24" r="12" />
          <path d="M31 22h13" />
        </g>
      )
    case 'led-strip':
      return (
        <g {...p}>
          <path d="M6 30c6-14 30-14 36 0" />
          <circle cx="12" cy="26" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="20" cy="19" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="28" cy="19" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="36" cy="26" r="1.4" fill="currentColor" stroke="none" />
        </g>
      )
    case 'wallet':
      return (
        <g {...p}>
          <rect x="7" y="14" width="34" height="22" rx="3" />
          <path d="M7 22h34" />
          <rect x="27" y="24" width="10" height="7" rx="1.5" fill="currentColor" stroke="none" />
        </g>
      )
    case 'watch':
      return (
        <g {...p}>
          <circle cx="24" cy="24" r="11" />
          <path d="M24 18v6l4 3M19 6h10l-2 7h-6zM19 42h10l-2-7h-6z" />
        </g>
      )
    case 'sunglasses':
      return (
        <g {...p}>
          <circle cx="14" cy="24" r="8" />
          <circle cx="34" cy="24" r="8" />
          <path d="M22 22h4M6 22l3-4h5M43 22l-3-4h-5" />
        </g>
      )
    case 'candle':
      return (
        <g {...p}>
          <rect x="9" y="20" width="9" height="18" rx="1.5" />
          <rect x="20" y="14" width="9" height="24" rx="1.5" />
          <rect x="31" y="22" width="9" height="16" rx="1.5" />
          <path d="M13.5 20c-1-2 1-3 0-5M24.5 14c-1-2 1-3 0-5M35.5 22c-1-2 1-3 0-5" />
        </g>
      )
    case 'board-game':
      return (
        <g {...p}>
          <rect x="7" y="10" width="34" height="28" rx="3" />
          <circle cx="16" cy="20" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="16" cy="28" r="1.6" fill="currentColor" stroke="none" />
          <rect x="26" y="17" width="10" height="10" rx="2" />
        </g>
      )
    case 'journal':
      return (
        <g {...p}>
          <rect x="9" y="8" width="24" height="32" rx="2" />
          <path d="M9 14h24M15 8v32" />
          <path d="M31 30l9-16 3 2-9 16-4 1z" />
        </g>
      )
    case 'spoon':
      return (
        <g {...p}>
          <ellipse cx="24" cy="13" rx="8" ry="10" />
          <path d="M24 23v20" />
        </g>
      )
    case 'phone-charger':
      return (
        <g {...p}>
          <rect x="8" y="6" width="10" height="14" rx="2" />
          <path d="M13 20v10c0 4 4 4 4 8s-4 4-4 4" />
          <rect x="10" y="34" width="7" height="6" rx="1.5" fill="currentColor" stroke="none" />
        </g>
      )
    case 'earphones':
      return (
        <g {...p}>
          <circle cx="14" cy="16" r="5" />
          <circle cx="34" cy="16" r="5" />
          <path d="M14 21v6c0 6 6 6 10 6s10 0 10-6v-6" />
        </g>
      )
    default:
      return (
        <g {...p}>
          <rect x="10" y="10" width="28" height="28" rx="4" />
          <path d="M17 31l6-8 5 6 4-5 5 7" />
        </g>
      )
  }
}

export default function ProductVisual({
  icon,
  category,
  className = '',
}: {
  icon: string
  category: string
  className?: string
}) {
  const tint = CATEGORY_TINT[category] ?? { bg: '#F3F1E9', fg: '#0F1222' }
  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{ backgroundColor: tint.bg }}
    >
      <svg width="56%" height="56%" viewBox="0 0 48 48" style={{ color: tint.fg }}>
        <Icon id={icon} />
      </svg>
    </div>
  )
}

/** Parses the `visual:<category>:<icon>` convention stored in product.image_url. */
export function parseVisualUrl(imageUrl: string): { category: string; icon: string } | null {
  if (!imageUrl?.startsWith('visual:')) return null
  const [, category, icon] = imageUrl.split(':')
  if (!category || !icon) return null
  return { category, icon }
}
