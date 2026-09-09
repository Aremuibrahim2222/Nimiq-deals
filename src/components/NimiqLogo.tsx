'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function NimiqLogo({ size = 28 }: { size?: number }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    // Fallback so a missing/misdeployed asset never shows a broken-image
    // icon — renders a plain gold hexagon-brand-colored swatch instead.
    return (
      <div
        aria-label="Nimiq"
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-[6px] bg-gradient-to-br from-gold-300 to-gold-500"
      />
    )
  }

  return (
    <Image
      src="/logo/nimiq-logo.jpg"
      alt="Nimiq"
      width={size}
      height={size}
      className="rounded-[6px]"
      priority
      onError={() => setFailed(true)}
    />
  )
}
