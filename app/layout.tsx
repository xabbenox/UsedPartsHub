import { Inter } from 'next/font/google'
import './globals.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from "@/components/ui/toast"

const inter = Inter({ subsets: ['latin'] })

const googleClientId = process.env.GOOGLE_CLIENT_ID || '';

export const metadata = {
  title: 'UsedPartsHub - Gebrauchte Autoteile Marktplatz',
  description: 'Finden und verkaufen Sie gebrauchte Autoteile auf UsedPartsHub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <GoogleOAuthProvider clientId={googleClientId}>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </GoogleOAuthProvider>
    </html>
  )
}

