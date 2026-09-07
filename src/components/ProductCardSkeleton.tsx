export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card bg-white shadow-card ring-1 ring-ink-950/[0.04]">
      <div className="skeleton aspect-square w-full" />
      <div className="flex flex-col gap-2 p-2.5">
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
    </div>
  )
}
