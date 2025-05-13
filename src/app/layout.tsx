import type { Metadata } from 'next'
import { Dosis } from 'next/font/google'
import './globals.css'

const openSans = Dosis({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Inventory System',
  description: 'Inventory management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={openSans.className}>
        {children}
      </body>
    </html>
  )
}
