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
        {/* Header-Inhalt bleibt unverändert */}
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

