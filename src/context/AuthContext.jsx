import { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '@/lib/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = storage.get('USER')
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('lumbung_tani_users') || '[]')
    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const userWithoutPassword = { ...foundUser }
      delete userWithoutPassword.password
      setUser(userWithoutPassword)
      storage.set('USER', userWithoutPassword)
      return { success: true, user: userWithoutPassword }
    }
    
    return { success: false, error: 'Email atau password salah' }
  }

  const logout = () => {
    setUser(null)
    storage.remove('USER')
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
