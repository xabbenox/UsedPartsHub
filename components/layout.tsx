import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Logo } from './logo'

interface LayoutProps {
  children: React.ReactNode
  error?: string
  user?: { userId: number; isAdmin: boolean } | null
}

export default function Layout({ children, error, user }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Logo className="h-10 w-auto" />
            </Link>
            <div className="flex gap-4">
              <Link href="/search" className="text-sm font-medium hover:underline">
                Teile suchen
              </Link>
              {user ? (
                <>
                  <Link href="/new" className="text-sm font-medium hover:underline">
                    Artikel aufgeben
                  </Link>
                  <Link href="/members" className="text-sm font-medium hover:underline">
                    Mein Bereich
                  </Link>
                  <Link href="/api/logout" className="text-sm font-medium hover:underline">
                    Abmelden
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium hover:underline">
                    Anmelden
                  </Link>
                  <Link href="/register" className="text-sm font-medium hover:underline">
                    Registrieren
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {children}
      </main>
      
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2024 UsedPartsHub
        </div>
      </footer>
    </div>
  )
}

