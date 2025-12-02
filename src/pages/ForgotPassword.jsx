import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001'

export function ForgotPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const isReset = !!token

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage(data.message)
        if (data.resetLink) {
          setMessage(`${data.message}. Reset link: ${data.resetLink}`)
        }
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (newPassword !== confirmPassword) {
      setError('Password tidak cocok')
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage(data.message)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (isReset) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#0b130f] text-[#f7f3eb]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1592924397982-881a0b0459b2?auto=format&fit=crop&w=1920&q=80"
            alt="Latar agrikultur"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#08130d] via-[#0b130f]/90 to-[#1c2f22]/85 rounded-l-3xl" />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-2xl text-white shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
            <CardHeader className="space-y-3 pb-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ffe457]/20">
                <CheckCircle className="h-7 w-7 text-[#ffe457]" />
              </div>
              <CardTitle className="text-2xl font-semibold text-center text-white">Reset Password</CardTitle>
              <CardDescription className="text-center text-[#d3c9b6]">
                Masukkan password baru Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle className="h-7 w-7 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Berhasil!</h3>
                  <p className="text-[#d3c9b6]">{message}</p>
                </div>
                <Link to="/login">
                  <Button className="w-full h-12 rounded-full bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] font-semibold shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
                    Kembali ke Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-[#d3c9b6]">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Masukkan password baru"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="h-12 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-[#ffe457] focus-visible:border-white/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#d3c9b6]">Konfirmasi Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Konfirmasi password baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-[#ffe457] focus-visible:border-white/30"
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full h-12 rounded-full bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] font-semibold shadow-[0_15px_35px_rgba(0,0,0,0.35)]" disabled={loading}>
                  {loading ? 'Memproses...' : 'Reset Password'}
                </Button>

                <Link to="/login" className="block text-center">
                  <Button variant="ghost" className="w-full h-12 rounded-full text-[#c4bbab] hover:text-white hover:bg-white/5">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Login
                  </Button>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b130f] text-[#f7f3eb]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1592924397982-881a0b0459b2?auto=format&fit=crop&w=1920&q=80"
          alt="Latar agrikultur"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#08130d] via-[#0b130f]/90 to-[#1c2f22]/85 rounded-l-3xl" />
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-2xl text-white shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
          <CardHeader className="space-y-3 pb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ffe457]/20">
              <Mail className="h-7 w-7 text-[#ffe457]" />
            </div>
            <CardTitle className="text-2xl font-semibold text-center text-white">Lupa Password</CardTitle>
            <CardDescription className="text-center text-[#d3c9b6]">
              Masukkan email Anda untuk menerima link reset password
            </CardDescription>
          </CardHeader>
          <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle className="h-7 w-7 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Link Terkirim!</h3>
                <p className="text-[#d3c9b6]">{message}</p>
              </div>
              <Link to="/login">
                <Button className="w-full h-12 rounded-full bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] font-semibold shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
                  Kembali ke Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#d3c9b6]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-[#ffe457] focus-visible:border-white/30"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}

              {message && (
                <div className="text-green-400 text-sm text-center bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                  {message}
                </div>
              )}

              <Button type="submit" className="w-full h-12 rounded-full bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] font-semibold shadow-[0_15px_35px_rgba(0,0,0,0.35)]" disabled={loading}>
                {loading ? 'Memproses...' : 'Kirim Link Reset'}
              </Button>

              <Link to="/login" className="block text-center">
                <Button variant="ghost" className="w-full h-12 rounded-full text-[#c4bbab] hover:text-white hover:bg-white/5">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Login
                </Button>
              </Link>
            </form>
          )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
