import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  metadataBase: new URL('https://nuvem-ai.com'),
  title: 'Nuvem-aí — Inteligência artificial para conversar, criar e aprender',
  description:
    'Nuvem-aí é um assistente de inteligência artificial gratuito em português. Tire dúvidas, escreva textos, crie ideias e programe conversando com a IA.',
  keywords: ['Nuvem-aí', 'nuvem ai', 'inteligência artificial', 'IA', 'chat IA', 'assistente virtual', 'chatbot em português'],
  applicationName: 'Nuvem-aí',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Nuvem-aí — Inteligência artificial',
    description: 'Converse com a IA da Nuvem-aí: respostas rápidas, textos, ideias e código.',
    url: 'https://nuvem-ai.com',
    siteName: 'Nuvem-aí',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Nuvem-aí — Inteligência artificial',
    description: 'Converse com a IA da Nuvem-aí: respostas rápidas, textos, ideias e código.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b0e14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${geistMono.variable} bg-background`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
