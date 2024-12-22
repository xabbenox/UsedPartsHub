import { NextResponse } from 'next/server'
import { queryDB } from '@/lib/db'
import { getServerSideUser } from '@/lib/auth-utils'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const serverUser = await getServerSideUser()
  if (!serverUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await queryDB(
    'UPDATE parts SET expires_at = DATE_ADD(expires_at, INTERVAL 30 DAY) WHERE id = ? AND user_id = ?',
    [params.id, serverUser.userId]
  )

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  const { data: updatedListing, error: fetchError } = await queryDB(
    'SELECT * FROM parts WHERE id = ?',
    [params.id]
  )

  if (fetchError) {
    return NextResponse.json({ error: fetchError }, { status: 500 })
  }

  return NextResponse.json(updatedListing[0])
}

