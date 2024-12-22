'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '@/lib/auth'
import { PhotoUploader } from "@/components/photo-uploader"

export default function NewListing() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { user } = useAuth()
  const [photos, setPhotos] = useState<string[]>([])
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0)
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    const response = await fetch('/api/parts', {
      method: 'POST',
      body: JSON.stringify({
        title: formData.get('title'),
        category: formData.get('category'),
        description: formData.get('description'),
        price: formData.get('price'),
        contact: formData.get('contact'),
        condition: formData.get('condition'),
        shippingOptions: formData.get('shippingOptions'),
        photos,
        mainPhotoIndex,
        userId: user?.id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    if (data.error) {
      setError(data.error)
    } else {
      router.push('/')
    }
  }
  
  if (!user) {
    return (
      <Layout error="Sie müssen angemeldet sein, um eine Anzeige aufzugeben.">
        <div className="text-center">
          <Button onClick={() => router.push('/login')}>Zum Login</Button>
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout error={error}>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">Neues Autoteil auf UsedPartsHub inserieren</h1>
        <p className="mb-6 text-muted-foreground">
          Beschreiben Sie Ihr Autoteil genau, um potenzielle Käufer anzusprechen.
        </p>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Titel</Label>
            <Input id="title" name="title" required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Kategorie</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Wähle eine Kategorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motor">Motor</SelectItem>
                <SelectItem value="karosserie">Karosserie</SelectItem>
                <SelectItem value="innenausstattung">Innenausstattung</SelectItem>
                <SelectItem value="elektronik">Elektronik</SelectItem>
                <SelectItem value="fahrwerk">Fahrwerk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea id="description" name="description" required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="price">Preis (€)</Label>
            <Input id="price" name="price" type="number" min="0" step="0.01" required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="condition">Zustand</Label>
            <Select name="condition" required>
              <SelectTrigger>
                <SelectValue placeholder="Wähle einen Zustand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neu">Neu</SelectItem>
                <SelectItem value="gebraucht">Gebraucht</SelectItem>
                <SelectItem value="generalüberholt">Generalüberholt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="shippingOptions">Versandoptionen</Label>
            <Select name="shippingOptions" required>
              <SelectTrigger>
                <SelectValue placeholder="Wähle Versandoptionen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="versand">Versand</SelectItem>
                <SelectItem value="abholung">Nur Abholung</SelectItem>
                <SelectItem value="beides">Versand und Abholung</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="contact">Kontakt</Label>
            <Input id="contact" name="contact" type="email" required />
          </div>
          
          <div className="grid gap-2">
            <Label>Fotos</Label>
            <PhotoUploader
              photos={photos}
              setPhotos={setPhotos}
              mainPhotoIndex={mainPhotoIndex}
              setMainPhotoIndex={setMainPhotoIndex}
            />
          </div>
          
          <Button type="submit" size="lg">
            Inserieren
          </Button>
        </form>
      </div>
    </Layout>
  )
}

