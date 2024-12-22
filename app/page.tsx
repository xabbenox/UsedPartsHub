import { queryDB } from "@/lib/db"
import Layout from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"
import { SearchIcon, TrendingUpIcon, ShieldCheckIcon, TruckIcon } from 'lucide-react'
import { getServerSideUser } from '@/lib/auth-utils'

export default async function Home() {
  const serverUser = getServerSideUser()

  const { data: featuredParts, error: featuredError } = await queryDB(`
    SELECT * FROM parts 
    WHERE featured = 1
    ORDER BY created_at DESC 
    LIMIT 4
  `)

  const { data: recentParts, error: recentError } = await queryDB(`
    SELECT * FROM parts 
    ORDER BY created_at DESC 
    LIMIT 8
  `)

  const { data: categories, error: categoriesError } = await queryDB(`
    SELECT DISTINCT category FROM parts
  `)

  const error = featuredError || recentError || categoriesError

  return (
    <Layout error={error}>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-xl">
          <h1 className="text-5xl font-bold mb-6">Willkommen bei UsedPartsHub</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Ihr vertrauenswürdiger Marktplatz für gebrauchte Autoteile. Finden Sie genau das Teil, das Sie brauchen!
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/search">
              <Button size="lg" variant="secondary">Teile suchen</Button>
            </Link>
            <Link href="/new">
              <Button size="lg" variant="outline">Inserat aufgeben</Button>
            </Link>
          </div>
        </section>

        {/* Quick Search Section */}
        <section className="bg-muted p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Schnellsuche</h2>
          <form className="flex gap-4 flex-wrap">
            <Input placeholder="Suchbegriff eingeben" className="flex-grow" />
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Kategorie wählen" />
              </SelectTrigger>
              <SelectContent>
                {categories && categories.map((cat: any) => (
                  <SelectItem key={cat.category} value={cat.category}>
                    {cat.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Suchen</Button>
          </form>
        </section>

        {/* Featured Parts Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6">Ausgewählte Teile</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredParts && featuredParts.map((part: any) => (
              <Card key={part.id} className="flex flex-col">
                <CardHeader className="p-0">
                  {part.photos && JSON.parse(part.photos).length > 0 && (
                    <div className="relative h-48">
                      <Image
                        src={JSON.parse(part.photos)[part.main_photo_index]}
                        alt={part.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="mb-2">{part.title}</CardTitle>
                  <div className="text-2xl font-bold mb-2">€{part.price}</div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{part.description}</p>
                </CardContent>
                <CardFooter className="bg-muted p-4">
                  <Link href={`/part/${part.id}`} className="w-full">
                    <Button variant="secondary" size="sm" className="w-full">Details ansehen</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Listings Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6">Neueste Angebote</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {recentParts && recentParts.map((part: any) => (
              <Card key={part.id} className="flex flex-col">
                <CardHeader className="p-0">
                  {part.photos && JSON.parse(part.photos).length > 0 && (
                    <div className="relative h-48">
                      <Image
                        src={JSON.parse(part.photos)[part.main_photo_index]}
                        alt={part.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="mb-2">{part.title}</CardTitle>
                  <div className="text-2xl font-bold mb-2">€{part.price}</div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{part.description}</p>
                </CardContent>
                <CardFooter className="bg-muted p-4">
                  <Link href={`/part/${part.id}`} className="w-full">
                    <Button variant="secondary" size="sm" className="w-full">Details ansehen</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/search">
              <Button size="lg">Alle Angebote ansehen</Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <SearchIcon className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Einfache Suche</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Finden Sie schnell und einfach das richtige Teil für Ihr Fahrzeug.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUpIcon className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Große Auswahl</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tausende von Teilen für verschiedene Marken und Modelle.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <ShieldCheckIcon className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Sicher & Vertrauenswürdig</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Geprüfte Verkäufer und sichere Transaktionen für Ihre Sicherheit.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <TruckIcon className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Flexible Lieferung</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Versand oder Abholung - Sie haben die Wahl.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  )
}

