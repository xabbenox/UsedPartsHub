'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Layout from "@/components/layout"
import { ActiveListings } from "@/components/dashboard/active-listings"
import { UserProfile } from "@/components/dashboard/user-profile"
import { ProfilePicture } from "@/components/dashboard/profile-picture"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"

export default function Dashboard() {
  const { user, setUser, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && !user) {
      toast("Bitte melden Sie sich an, um auf das Dashboard zuzugreifen.", { type: "error" })
      router.push('/login')
    }
  }, [user, loading, router, toast])

  if (loading) {
    return <Layout>Laden...</Layout>
  }

  if (!user) {
    return null // This will prevent any flickering, as the useEffect will redirect
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">Meine Inserate</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="picture">Profilbild</TabsTrigger>
        </TabsList>
        <TabsContent value="listings">
          <ActiveListings userId={user.id} />
        </TabsContent>
        <TabsContent value="profile">
          <UserProfile user={user} setUser={setUser} />
        </TabsContent>
        <TabsContent value="profile">
          <ProfilePicture user={user} setUser={setUser} />
        </TabsContent>
      </Tabs>
    </Layout>
  )
}

