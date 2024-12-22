import { Layout } from "@/components/layout"
import { queryDB } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function AdminPanel() {
  const { data: users, error: usersError } = await queryDB('SELECT * FROM users')
  const { data: parts, error: partsError } = await queryDB('SELECT * FROM parts')

  const error = usersError || partsError

  return (
    <Layout error={error}>
      <h1 className="mb-6 text-3xl font-bold">Admin Panel</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Benutzer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {users && users.length > 0 ? (
                users.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <span>{user.username} ({user.email})</span>
                    <Button variant="destructive" size="sm">Löschen</Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  Keine Benutzer gefunden
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Anzeigen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {parts && parts.length > 0 ? (
                parts.map((part: any) => (
                  <div key={part.id} className="flex items-center justify-between">
                    <span>{part.title}</span>
                    <Button variant="destructive" size="sm">Löschen</Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  Keine Anzeigen gefunden
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

