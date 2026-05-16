import './globals.css'
import localFont from 'next/font/local'
import type { Metadata } from 'next'

const digital7 = localFont({
  src: './fonts/digital-7-mono-italic.ttf',
  variable: '--font-digital7',
  display: 'swap',
})

const scoremark = localFont({
  src: './fonts/ScoremarkDemo-Regular.otf',
  variable: '--font-scoremark',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Chrono 24h Basket 2026',
  description: 'Chrono 24h Basket 2026',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${digital7.variable} ${scoremark.variable}`}>
      <body>{children}</body>
    </html>
  )
}
