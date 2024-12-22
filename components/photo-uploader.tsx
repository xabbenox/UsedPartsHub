import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PhotoUploaderProps {
  photos: string[]
  setPhotos: (photos: string[]) => void
  mainPhotoIndex: number
  setMainPhotoIndex: (index: number) => void
}

export function PhotoUploader({ photos, setPhotos, mainPhotoIndex, setMainPhotoIndex }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true)
      const newPhotos = [...photos]

      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i]
        const formData = new FormData()
        formData.append('file', file)

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            newPhotos.push(data.url)
          } else {
            console.error('Fehler beim Hochladen des Fotos')
          }
        } catch (error) {
          console.error('Fehler beim Hochladen des Fotos', error)
        }
      }

      setPhotos(newPhotos)
      setUploading(false)
    }
  }

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    if (index === mainPhotoIndex) {
      setMainPhotoIndex(0)
    } else if (index < mainPhotoIndex) {
      setMainPhotoIndex(mainPhotoIndex - 1)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative">
            <Image
              src={photo}
              alt={`Foto ${index + 1}`}
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
            <button
              onClick={() => handleRemovePhoto(index)}
              className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white"
            >
              X
            </button>
            <button
              onClick={() => setMainPhotoIndex(index)}
              className={`absolute bottom-1 left-1 rounded-full p-1 text-white ${
                index === mainPhotoIndex ? 'bg-green-500' : 'bg-gray-500'
              }`}
            >
              {index === mainPhotoIndex ? 'Hauptfoto' : 'Als Hauptfoto setzen'}
            </button>
          </div>
        ))}
      </div>
      <div>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Label htmlFor="file-upload" className="mt-2 block text-sm text-gray-600">
          {uploading ? 'Fotos werden hochgeladen...' : 'Wählen Sie eine oder mehrere Dateien aus'}
        </Label>
      </div>
    </div>
  )
}

