import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import BottomNav from '@/components/BottomNav'

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
})

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Nimiq Deals',
  description: 'Discover discounted products and pay with NIM through Nimiq Pay.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F1222',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh bg-paper text-ink-950 antialiased">
        <ToastProvider>
          <CartProvider>
            <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-paper">
              <main className="flex-1 pb-safe">{children}</main>
              <BottomNav />
            </div>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
