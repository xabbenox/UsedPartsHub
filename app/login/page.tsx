'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import { GoogleSignInButton } from "@/components/google-sign-in-button"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data.error) {
        toast("Anmeldung fehlgeschlagen", {
          description: data.error,
        })
      } else {
        toast("Anmeldung erfolgreich", {
          description: "Sie sind jetzt eingeloggt.",
        })
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error during login:', error)
      toast("Fehler", {
        description: "Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
      })
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.access_token }),
      })

      const data = await response.json()

      if (data.error) {
        toast("Anmeldung fehlgeschlagen", {
          description: data.error,
        })
      } else {
        toast("Anmeldung erfolgreich", {
          description: "Sie sind jetzt eingeloggt.",
        })
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error)
      toast("Fehler", {
        description: "Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
      })
    }
  }

  const handleGoogleError = () => {
    toast("Fehler", {
      description: "Google Sign-In fehlgeschlagen. Bitte versuchen Sie es später erneut.",
    })
  }

  return (
    <Layout>
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-3xl font-bold">Bei UsedPartsHub anmelden</h1>
        <p className="mb-6 text-muted-foreground">
          Willkommen zurück bei UsedPartsHub! Melden Sie sich an, um Ihre Anzeigen zu verwalten.
        </p>
        <GoogleSignInButton 
          onSuccess={handleGoogleSuccess} 
          onError={handleGoogleError}
          text="Mit Google anmelden"
        />
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">oder</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Passwort</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <Button type="submit" size="lg">
            Anmelden
          </Button>
        </form>
      </div>
    </Layout>
  )
}

