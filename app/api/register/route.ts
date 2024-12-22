import { NextResponse } from "next/server"
import { createUser } from "@/lib/db"
import { hash } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { 
      username, 
      email, 
      password, 
      firstName, 
      lastName, 
      phoneNumber, 
      userType, 
      companyName, 
      vatNumber 
    } = await request.json()

    // Überprüfe, ob alle erforderlichen Felder vorhanden sind
    if (!username || !email || !password || !firstName || !lastName || !phoneNumber || !userType) {
      return NextResponse.json({ error: 'Alle Pflichtfelder müssen ausgefüllt sein.' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 12)

    const { error } = await createUser(
      username, 
      email, 
      hashedPassword, 
      firstName, 
      lastName, 
      phoneNumber, 
      userType, 
      companyName || null,
      vatNumber || null,
      null // profilePicture ist momentan nicht Teil des Registrierungsprozesses
    )

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Ein Fehler ist bei der Registrierung aufgetreten.' }, { status: 500 })
  }
}

