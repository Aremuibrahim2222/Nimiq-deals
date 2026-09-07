export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-8 py-16 text-center">
      <h3 className="font-display text-base font-semibold text-ink-950">{title}</h3>
      {description && <p className="text-sm text-ink-950/55">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
