import { NextResponse } from 'next/server'
import { getServerSideUser } from '@/lib/auth-utils'
import { queryDB, getUserById } from '@/lib/db'

export async function GET() {
  const serverUser = await getServerSideUser()

  if (!serverUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const result = await getUserById(serverUser.userId)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 404 })
  }
  const user = result.user

  // Remove sensitive information
  const { password, ...safeUser } = user

  return NextResponse.json(safeUser)
}

export async function PUT(request: Request) {
  const serverUser = await getServerSideUser()
  if (!serverUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { username, email, firstName, lastName, phoneNumber } = await request.json()

  const { error } = await queryDB(
    `UPDATE users SET 
      username = ?, 
      email = ?, 
      first_name = ?, 
      last_name = ?, 
      phone_number = ? 
    WHERE id = ?`,
    [username, email, firstName, lastName, phoneNumber, serverUser.userId]
  )

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  const result = await getUserById(serverUser.userId)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
  const updatedUser = result.user

  return NextResponse.json(updatedUser)
}

export async function DELETE(request: Request) {
  const serverUser = await getServerSideUser()
  if (!serverUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await queryDB('DELETE FROM users WHERE id = ?', [serverUser.userId])

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

