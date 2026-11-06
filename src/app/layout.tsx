import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jishnu Guha — Software Engineer',
  description: 'Jishnu Guha is a software engineer building practical web products and machine learning tools.',
  openGraph: {
    title: 'Jishnu Guha — Software Engineer',
    description: 'Practical, people-focused products across web and machine learning.',
    type: 'website',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>{children}</body>
    </html>
  )
}
