import { NextResponse } from "next/server"
import { queryDB } from "@/lib/db"
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(request: Request) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  try {
    const decoded = verify(token, JWT_SECRET) as { userId: number }
    const { title, category, description, price, contact, condition, shippingOptions, photos, mainPhotoIndex, userId } = await request.json()
    
    const { error } = await queryDB(`
      INSERT INTO parts (
        title,
        category,
        description,
        price,
        contact,
        condition,
        shipping_options,
        photos,
        main_photo_index,
        user_id,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      title,
      category,
      description,
      price,
      contact,
      condition,
      shippingOptions,
      JSON.stringify(photos),
      mainPhotoIndex,
      decoded.userId
    ])
    
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Ungültiger Token' }, { status: 401 })
  }
}

