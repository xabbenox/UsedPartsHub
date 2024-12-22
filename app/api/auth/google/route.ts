import { NextResponse } from "next/server"
import { OAuth2Client } from 'google-auth-library'
import { createUser, getUserByEmail } from "@/lib/db"
import { sign } from 'jsonwebtoken'

if (!process.env.GOOGLE_CLIENT_ID) throw new Error('GOOGLE_CLIENT_ID is not set')
if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error('GOOGLE_CLIENT_SECRET is not set')
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function POST(request: Request) {
  try {
    const { credential } = await request.json()

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      throw new Error('Invalid Google token')
    }

    const { email, name, given_name, family_name, picture } = payload

    let { user, error } = await getUserByEmail(email!)

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    if (!user) {
      const createResult = await createUser(
        name!, 
        email!, 
        '', // We don't have a password for Google users
        given_name!,
        family_name!,
        '', // We don't have a phone number from Google
        'private', // Default to private user type
        undefined,
        undefined,
        picture
      )

      if (createResult.error) {
        return NextResponse.json({ error: createResult.error }, { status: 500 })
      }

      ({ user, error } = await getUserByEmail(email!))

      if (error || !user) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }
    }

    const token = sign(
      { userId: user.id, isAdmin: user.is_admin }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1h' }
    )

    const response = NextResponse.json({ success: true })
    response.cookies.set('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    })

    return response
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}

