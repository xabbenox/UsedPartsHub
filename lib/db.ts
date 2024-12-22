'use server'

import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

export async function createConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })
    return connection
  } catch (error) {
    console.error('Database connection error:', error)
    return null
  }
}

export async function queryDB(query: string, params: any[] = []): Promise<{ data?: any; error?: string }> {
  const connection = await createConnection()
  if (!connection) {
    return { error: 'Datenbankverbindung konnte nicht hergestellt werden' }
  }

  try {
    const [results] = await connection.execute(query, params) as [any[], mysql.FieldPacket[]];
    await connection.end()
    return { data: results }
  } catch (error) {
    console.error('Database query error:', error)
    await connection.end()
    return { error: 'Datenbankfehler aufgetreten' }
  }
}

export async function createUser(
  username: string, 
  email: string, 
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  userType: 'private' | 'business',
  companyName: string | null,
  vatNumber: string | null,
  profilePicture: string | null
) {
  const params = [
    username, 
    email, 
    password, 
    firstName, 
    lastName, 
    phoneNumber, 
    userType, 
    companyName || null, 
    vatNumber || null, 
    profilePicture || null
  ];

  return queryDB(
    `INSERT INTO users (
      username, 
      email, 
      password, 
      first_name, 
      last_name, 
      phone_number, 
      user_type, 
      company_name, 
      vat_number,
      profile_picture,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    params
  )
}

export async function getUserByEmail(email: string) {
  const { data, error } = await queryDB('SELECT * FROM users WHERE email = ?', [email])
  if (error) return { error }
  return { user: Array.isArray(data) ? data[0] : null }
}

export async function getUserById(id: number) {
  const { data, error } = await queryDB('SELECT * FROM users WHERE id = ?', [id])
  if (error) return { error }
  return { user: Array.isArray(data) ? data[0] : null }
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}

export async function getCarBrandsAndModels() {
  const { data, error } = await queryDB('SELECT DISTINCT automarke FROM Automarken ORDER BY automarke')
  if (error) return { error }

  const brands = Array.isArray(data) ? data as { automarke: string }[] : []
  const brandsWithModels = await Promise.all(
    brands.map(async (brand) => {
      const { data: models } = await queryDB('SELECT automodell FROM Automarken WHERE automarke = ? ORDER BY automodell', [brand.automarke])
      return {
        brand: brand.automarke,
        models: Array.isArray(models) ? (models as { automodell: string }[]).map(model => model.automodell) : []
      }
    })
  )

  return { brandsWithModels }
}

