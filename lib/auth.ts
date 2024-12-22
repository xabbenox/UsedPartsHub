import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Hier würden wir normalerweise einen API-Aufruf machen, um den Benutzer zu authentifizieren
    // Für dieses Beispiel simulieren wir es mit localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/')
  }

  return { user, login, logout }
}

