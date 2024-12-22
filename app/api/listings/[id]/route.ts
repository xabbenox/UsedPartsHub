import { NextResponse } from 'next/server'
import { queryDB } from '@/lib/db'
import { getServerSideUser } from '@/lib/auth-utils'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const serverUser = await getServerSideUser()
  if (!serverUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await queryDB(
    'DELETE FROM parts WHERE id = ? AND user_id = ?',
    [params.id, serverUser.userId]
  )

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

