import Link from 'next/link'

export default function SectionHeader({
  title,
  href,
}: {
  title: string
  href?: string
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="font-display text-lg font-semibold text-ink-950">{title}</h2>
      {href && (
        <Link href={href} className="text-xs font-semibold text-gold-600">
          See all
        </Link>
      )}
    </div>
  )
}
