import { NextResponse } from "next/server"
import { sign } from 'jsonwebtoken'
import { getUserByEmail, verifyPassword } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const { user, error } = await getUserByEmail(email)

    if (error || !user) {
      return NextResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 })
    }

    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return NextResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 })
    }

    const token = sign({ userId: user.id, isAdmin: user.is_admin }, JWT_SECRET, { expiresIn: '1h' })

    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, isAdmin: user.is_admin } })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Ein interner Fehler ist aufgetreten' }, { status: 500 })
  }
}

