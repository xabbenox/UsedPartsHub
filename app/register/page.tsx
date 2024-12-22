'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/toast"
import { GoogleSignInButton } from "@/components/google-sign-in-button"
import { z } from "zod"

const registerSchema = z.object({
  username: z.string().min(3, "Benutzername muss mindestens 3 Zeichen lang sein"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
  confirmPassword: z.string(),
  firstName: z.string().min(2, "Vorname muss mindestens 2 Zeichen lang sein"),
  lastName: z.string().min(2, "Nachname muss mindestens 2 Zeichen lang sein"),
  phoneNumber: z.string().min(10, "Telefonnummer muss mindestens 10 Zeichen lang sein"),
  userType: z.enum(["private", "business"]),
  companyName: z.string().optional(),
  vatNumber: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, "Sie müssen die Nutzungsbedingungen akzeptieren")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [formData, setFormData] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    userType: 'private',
    companyName: '',
    vatNumber: '',
    termsAccepted: false,
  })
  const [errors, setErrors] = useState<Partial<RegisterForm>>({})
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      userType: value as 'private' | 'business'
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    try {
      registerSchema.parse(formData)
      setErrors({})

      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data.error) {
        toast("Registrierung fehlgeschlagen", {
          description: data.error,
        })
      } else {
        toast("Registrierung erfolgreich", {
          description: "Sie können sich jetzt anmelden.",
        })
        router.push('/login')
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors)
      }
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
        toast("Registrierung fehlgeschlagen", {
          description: data.error,
        })
      } else {
        toast("Registrierung erfolgreich", {
          description: "Sie sind jetzt angemeldet.",
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
        <h1 className="mb-6 text-3xl font-bold">Bei UsedPartsHub registrieren</h1>
        <p className="mb-6 text-muted-foreground">
          Willkommen bei UsedPartsHub! Registrieren Sie sich, um Autoteile zu kaufen und zu verkaufen.
        </p>
        <GoogleSignInButton 
          onSuccess={handleGoogleSuccess} 
          onError={handleGoogleError}
          text="Mit Google registrieren"
        />
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">oder</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Benutzername</Label>
            <Input 
              id="username" 
              name="username" 
              value={formData.username}
              onChange={handleInputChange}
              required 
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Passwort</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              value={formData.password}
              onChange={handleInputChange}
              required 
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required 
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="firstName">Vorname</Label>
            <Input 
              id="firstName" 
              name="firstName" 
              value={formData.firstName}
              onChange={handleInputChange}
              required 
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lastName">Nachname</Label>
            <Input 
              id="lastName" 
              name="lastName" 
              value={formData.lastName}
              onChange={handleInputChange}
              required 
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">Telefonnummer</Label>
            <Input 
              id="phoneNumber" 
              name="phoneNumber" 
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required 
            />
            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="userType">Kontotyp</Label>
            <Select name="userType" onValueChange={handleSelectChange} value={formData.userType}>
              <SelectTrigger>
                <SelectValue placeholder="Wählen Sie einen Kontotyp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Privat</SelectItem>
                <SelectItem value="business">Geschäftlich</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.userType === 'business' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="companyName">Firmenname</Label>
                <Input 
                  id="companyName" 
                  name="companyName" 
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="vatNumber">Umsatzsteuer-ID</Label>
                <Input 
                  id="vatNumber" 
                  name="vatNumber" 
                  value={formData.vatNumber}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="termsAccepted" 
              name="termsAccepted"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, termsAccepted: checked as boolean }))
              }
            />
            <label
              htmlFor="termsAccepted"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Ich akzeptiere die Nutzungsbedingungen
            </label>
          </div>
          {errors.termsAccepted && <p className="text-sm text-red-500">{errors.termsAccepted}</p>}
          
          <Button type="submit" size="lg" className="w-full">
            Registrieren
          </Button>
        </form>
      </div>
    </Layout>
  )
}

