import type { Metadata } from 'next'
import { Nunito} from 'next/font/google'
import './globals.css'
import {YMapLoader} from "@/app/components/mapLoader";

const inter = Nunito({ subsets: ['cyrillic'] })

export const metadata: Metadata = {
  title: 'Умная парковка',
  description: 'Очеееееееень умная парковка',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
