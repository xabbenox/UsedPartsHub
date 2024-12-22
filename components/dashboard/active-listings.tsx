'use client'

import { useState, useEffect, useCallback } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Link from 'next/link'

interface Listing {
  id: number
  title: string
  price: number
  created_at: string
  expires_at: string
}

function ErrorFallback({error, resetErrorBoundary}: {error: Error; resetErrorBoundary: () => void}) {
  return (
    <div role="alert" className="p-4 bg-red-100 border border-red-400 rounded">
      <h2 className="text-lg font-semibold text-red-800 mb-2">Etwas ist schief gelaufen:</h2>
      <pre className="text-sm text-red-600 mb-4">{error.message}</pre>
      <Button onClick={resetErrorBoundary}>Erneut versuchen</Button>
    </div>
  )
}

function ActiveListingsContent({ userId }: { userId: number }) {
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchListings = useCallback(async () => {
    if (!userId) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/listings?userId=${userId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setListings(data)
    } catch (err) {
      console.error('Error fetching listings:', err)
      setError('Inserate konnten nicht geladen werden. Bitte versuchen Sie es später erneut.')
      toast("Inserate konnten nicht geladen werden.", { type: "error" })
    } finally {
      setIsLoading(false)
    }
  }, [userId, toast])

  useEffect(() => {
    if (userId) {
      fetchListings()
    }
  }, [userId, fetchListings])

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Inserat löschen möchten?')) {
      try {
        const response = await fetch(`/api/listings/${id}`, { method: 'DELETE' })
        if (!response.ok) {
          throw new Error('Fehler beim Löschen des Inserats')
        }
        setListings(prevListings => prevListings.filter(listing => listing.id !== id))
        toast("Inserat wurde gelöscht.", { type: "success" })
      } catch (err) {
        console.error('Error deleting listing:', err)
        toast("Inserat konnte nicht gelöscht werden.", { type: "error" })
      }
    }
  }, [toast])

  const handleExtend = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/listings/${id}/extend`, { method: 'POST' })
      if (!response.ok) {
        throw new Error('Fehler beim Verlängern des Inserats')
      }
      const updatedListing = await response.json()
      setListings(prevListings => prevListings.map(listing => listing.id === id ? updatedListing : listing))
      toast("Inseratslaufzeit wurde verlängert.", { type: "success" })
    } catch (err) {
      console.error('Error extending listing:', err)
      toast("Inseratslaufzeit konnte nicht verlängert werden.", { type: "error" })
    }
  }, [toast])

  if (isLoading) {
    return <div>Laden...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Aktive Inserate</h2>
      {listings.length === 0 ? (
        <p>Sie haben noch keine aktiven Inserate.</p>
      ) : (
        listings.map(listing => (
          <Card key={listing.id}>
            <CardHeader>
              <CardTitle>{listing.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Preis: €{listing.price}</p>
              <p>Erstellt am: {new Date(listing.created_at).toLocaleDateString()}</p>
              <p>Läuft ab am: {new Date(listing.expires_at).toLocaleDateString()}</p>
            </CardContent>
            <CardFooter className="space-x-2">
              <Link href={`/edit/${listing.id}`}>
                <Button variant="outline">Bearbeiten</Button>
              </Link>
              <Button onClick={() => handleExtend(listing.id)}>Verlängern</Button>
              <Button variant="destructive" onClick={() => handleDelete(listing.id)}>Löschen</Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}

export function ActiveListings({ userId }: { userId: number }) {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
      }}
    >
      <ActiveListingsContent userId={userId} />
    </ErrorBoundary>
  )
}

