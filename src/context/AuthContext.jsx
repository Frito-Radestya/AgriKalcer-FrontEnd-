import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const API = import.meta.env.VITE_API_URL || 'https://agrikalcer-backend-production.up.railway.app'

  useEffect(() => {
    const currentUser = storage.get('USER')
    const token = storage.get('TOKEN')
    if (currentUser && token) setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return { success: false, error: err.message || 'Email atau password salah' }
      }
      const data = await res.json()
      storage.set('TOKEN', data.token)
      storage.set('USER', data.user)
      setUser(data.user)
      return { success: true, user: data.user }
    } catch (e) {
      return { success: false, error: 'Gagal terhubung ke server' }
    }
  }

  const logout = () => {
    setUser(null)
    storage.remove('USER')
    storage.remove('TOKEN')
  }

  const register = async (userData) => {
    try {
      if (!userData.name || !userData.email || !userData.password) {
        return { success: false, error: 'Semua field harus diisi' }
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userData.email)) {
        return { success: false, error: 'Format email tidak valid' }
      }

      if (userData.password.length < 6) {
        return { success: false, error: 'Password minimal 6 karakter' }
      }
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userData.name, email: userData.email, password: userData.password }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return { success: false, error: err.message || 'Gagal mendaftar' }
      }
      const data = await res.json()
      storage.set('TOKEN', data.token)
      storage.set('USER', data.user)
      setUser(data.user)
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi nanti.' }
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// useAuth moved to '@/context/useAuth'
