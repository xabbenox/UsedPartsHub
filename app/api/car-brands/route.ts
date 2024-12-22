import { NextResponse } from 'next/server'
import { getCarBrandsAndModels } from '@/lib/db'

export async function GET() {
  const { brandsWithModels, error } = await getCarBrandsAndModels()

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ brandsWithModels })
}

