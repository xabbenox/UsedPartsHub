'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import Image from 'next/image'

export function ProfilePicture({ user, setUser }: { user: any; setUser: (user: any) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/user/profile-picture', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      const updatedUser = await response.json()
      setUser(updatedUser)
      toast("Profilbild wurde aktualisiert.", { type: "success" })
    } else {
      toast("Profilbild konnte nicht aktualisiert werden.", { type: "error" })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Profilbild</h2>
      {user.profile_picture && (
        <div className="mb-4">
          <Image src={user.profile_picture} alt="Profilbild" width={100} height={100} className="rounded-full" />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="profile-picture">Neues Profilbild auswählen</Label>
          <Input id="profile-picture" type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <Button type="submit" disabled={!file}>Profilbild aktualisieren</Button>
      </form>
    </div>
  )
}

