export default function RatingStars({
  rating,
  count,
  size = 'sm',
}: {
  rating: number
  count?: number
  size?: 'sm' | 'md'
}) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'
  return (
    <div className={`flex items-center gap-1 ${textSize}`}>
      <span className="text-gold-500" aria-hidden>
        ★
      </span>
      <span className="font-medium text-ink-950">{rating.toFixed(1)}</span>
      {typeof count === 'number' && <span className="text-ink-950/45">({count})</span>}
    </div>
  )
}
