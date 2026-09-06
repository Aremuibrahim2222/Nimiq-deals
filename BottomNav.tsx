'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'

const TABS = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/explore', label: 'Explore', icon: SearchIcon },
  { href: '/cart', label: 'Cart', icon: CartIcon },
  { href: '/rewards', label: 'Rewards', icon: GiftIcon },
  { href: '/profile', label: 'Profile', icon: UserIcon },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) return null

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md items-stretch justify-between border-t border-ink-950/8 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+6px)] pt-2 backdrop-blur"
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="relative flex flex-1 flex-col items-center gap-1 rounded-sq py-1.5 text-[11px] font-medium"
          >
            <span className="relative">
              <Icon active={active} />
              {href === '/cart' && totalItems > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-semibold text-ink-950">
                  {totalItems}
                </span>
              )}
            </span>
            <span className={active ? 'text-ink-950' : 'text-ink-950/45'}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-8.5Z"
        stroke={active ? '#0F1222' : '#8A8E9E'}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? '#FFDD85' : 'none'}
      />
    </svg>
  )
}
function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke={active ? '#0F1222' : '#8A8E9E'} strokeWidth="1.8" />
      <path d="m20 20-4-4" stroke={active ? '#0F1222' : '#8A8E9E'} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function CartIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 8h16l-1.5 10.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5L4 8Z"
        stroke={active ? '#0F1222' : '#8A8E9E'}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? '#FFDD85' : 'none'}
      />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke={active ? '#0F1222' : '#8A8E9E'} strokeWidth="1.8" />
    </svg>
  )
}
function GiftIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="9" width="16" height="11" rx="1.2" stroke={active ? '#0F1222' : '#8A8E9E'} strokeWidth="1.8" fill={active ? '#FFDD85' : 'none'} />
      <path d="M4 9h16v3H4V9Z" stroke={active ? '#0F1222' : '#8A8E9E'} strokeWidth="1.8" />
      <path d="M12 9v11M12 9c-1.7 0-4-1-4-3s2.3-3 4 0c1.7-3 4-3 4 0s-2.3 3-4 3Z" stroke={active ? '#0F1222' : '#8A8E9E'} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}
function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8.2" r="3.4" stroke={active ? '#0F1222' : '#8A8E9E'} strokeWidth="1.8" fill={active ? '#FFDD85' : 'none'} />
      <path d="M5 20c1-3.6 4-5.4 7-5.4s6 1.8 7 5.4" stroke={active ? '#0F1222' : '#8A8E9E'} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
