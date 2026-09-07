export function formatNim(amount: number) {
  return `${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} NIM`
}

export function discountPercent(original: number, deal: number) {
  if (original <= 0) return 0
  return Math.round(((original - deal) / original) * 100)
}

export default function PriceBlock({
  original,
  deal,
  size = 'sm',
}: {
  original: number
  deal: number
  size?: 'sm' | 'lg'
}) {
  const pct = discountPercent(original, deal)
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={size === 'lg' ? 'font-display text-2xl font-semibold' : 'font-display text-sm font-semibold'}>
        {formatNim(deal)}
      </span>
      {pct > 0 && (
        <>
          <span className="text-xs text-ink-950/40 line-through">{formatNim(original)}</span>
          <span className="rounded-sq bg-mint-50 px-1.5 py-0.5 text-[11px] font-semibold text-mint-600">
            -{pct}%
          </span>
        </>
      )}
    </div>
  )
}
