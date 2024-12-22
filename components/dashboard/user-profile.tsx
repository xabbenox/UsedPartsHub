'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function UserProfile({ user, setUser }: { user: any; setUser: (user: any) => void }) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phoneNumber: user.phone_number,
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    if (response.ok) {
      const updatedUser = await response.json()
      setUser(updatedUser)
      toast("Benutzerdaten wurden aktualisiert.", { type: "success" })
    } else {
      toast("Benutzerdaten konnten nicht aktualisiert werden.", { type: "error" })
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      const response = await fetch('/api/user', { method: 'DELETE' })
      if (response.ok) {
        toast("Ihr Konto wurde gelöscht.", { type: "success" })
        router.push('/')
      } else {
        toast("Konto konnte nicht gelöscht werden.", { type: "error" })
      }
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Benutzerprofil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Benutzername</Label>
          <Input id="username" name="username" value={formData.username} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="email">E-Mail</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="firstName">Vorname</Label>
          <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="lastName">Nachname</Label>
          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Telefonnummer</Label>
          <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
        </div>
        <Button type="submit">Aktualisieren</Button>
      </form>
      <div className="pt-6 border-t">
        <h3 className="text-xl font-bold mb-2">Konto löschen</h3>
        <p className="mb-4">Diese Aktion kann nicht rückgängig gemacht werden.</p>
        <Button variant="destructive" onClick={handleDeleteAccount}>Konto löschen</Button>
      </div>
    </div>
  )
}

