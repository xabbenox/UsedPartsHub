import { NextResponse } from 'next/server'
import { queryDB } from '@/lib/db'
import { getServerSideUser } from '@/lib/auth-utils'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  const serverUser = await getServerSideUser()
  
  if (!serverUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `${serverUser.userId}-${Date.now()}${path.extname(file.name)}`
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

  await writeFile(filepath, buffer)
  const profilePicturePath = `/uploads/${filename}`

  const { error } = await queryDB(
    'UPDATE users SET profile_picture = ? WHERE id = ?',
    [profilePicturePath, serverUser.userId]
  )

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  const { data: updatedUser, error: fetchError } = await queryDB(
    'SELECT * FROM users WHERE id = ?',
    [serverUser.userId]
  )

  if (fetchError) {
    return NextResponse.json({ error: fetchError }, { status: 500 })
  }

  return NextResponse.json(updatedUser[0])
}

