import Layout from "@/components/layout"
import { queryDB } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getServerSideUser } from "@/lib/auth-utils"
import { redirect } from 'next/navigation'

export default async function MembersArea() {
  const user = await getServerSideUser()

  if (!user) {
    redirect('/login')
  }

  const { data: parts, error } = await queryDB(`
    SELECT * FROM parts 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `, [user.userId])

  return (
    <Layout error={error} user={user}>
      <h1 className="mb-6 text-3xl font-bold">Meine Anzeigen</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {parts && parts.length > 0 ? (
          parts.map((part: any) => (
            <Card key={part.id}>
              <CardHeader>
                <CardTitle>{part.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="text-2xl font-bold">€{part.price}</div>
                  <div className="text-sm text-muted-foreground">{part.description}</div>
                  <div className="text-sm text-muted-foreground">
                    Kategorie: {part.category}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            Keine Anzeigen gefunden
          </div>
        )}
      </div>
    </Layout>
  )
}

