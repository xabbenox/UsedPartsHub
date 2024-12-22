import { NextRequest, NextResponse } from 'next/server'
import { queryDB } from '@/lib/db'
import { getServerSideUser } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  const serverUser = await getServerSideUser()
  if (!serverUser || serverUser.userId.toString() !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await queryDB(
    'SELECT * FROM parts WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  )

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}

