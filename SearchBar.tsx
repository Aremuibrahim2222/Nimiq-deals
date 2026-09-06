'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar({ placeholder = 'Search deals' }: { placeholder?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) params.set('q', value.trim())
    else params.delete('q')
    router.push(`/explore?${params.toString()}`)
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
      >
        <circle cx="11" cy="11" r="6.5" stroke="#8A8E9E" strokeWidth="1.8" />
        <path d="m20 20-4-4" stroke="#8A8E9E" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full bg-white py-3 pl-10 pr-4 text-sm text-ink-950 shadow-card ring-1 ring-ink-950/[0.06] placeholder:text-ink-950/40 focus:outline-none focus:ring-2 focus:ring-gold-400"
      />
    </form>
  )
}
