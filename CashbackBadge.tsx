export default function CashbackBadge({ percent }: { percent: number }) {
  if (!percent) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-sq bg-gold-50 px-1.5 py-0.5 text-[11px] font-semibold text-gold-600">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7v10M9 9.5c0-1.4 1.3-2.5 3-2.5s3 1 3 2.2c0 2.8-6 1.4-6 4.2 0 1.3 1.3 2.4 3 2.4s3-1 3-2.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {percent}% back
    </span>
  )
}
