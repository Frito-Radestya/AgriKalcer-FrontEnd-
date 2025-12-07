import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4001/api'

export default function ForgotPassword() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [token, setToken] = useState('')
  const [step, setStep] = useState('request') // 'request', 'reset', 'success'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const navigate = useNavigate()

  // Check for token in URL
  useEffect(() => {
    const urlToken = searchParams.get('token')
    const urlEmail = searchParams.get('email')
    
    if (urlToken && urlEmail) {
      setToken(urlToken)
      setEmail(decodeURIComponent(urlEmail))
      setStep('reset')
    }
  }, [searchParams])

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: data.message || 'Tautan reset password telah dikirim ke email Anda' 
        })
        setStep('reset')
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Gagal mengirim email reset password' 
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage({ 
        type: 'error', 
        text: 'Terjadi kesalahan. Silakan coba lagi nanti.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (newPassword !== confirmPassword) {
      setMessage({ 
        type: 'error', 
        text: 'Password dan konfirmasi password tidak cocok' 
      })
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setMessage({ 
        type: 'error', 
        text: 'Password minimal 8 karakter' 
      })
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          email,
          newPassword 
        })
      })

      const data = await response.json()

      if (response.ok) {
        setStep('success')
        setMessage({ 
          type: 'success', 
          text: data.message || 'Password berhasil direset. Silakan login dengan password baru Anda.' 
        })
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Gagal mereset password' 
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage({ 
        type: 'error', 
        text: 'Terjadi kesalahan. Silakan coba lagi nanti.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {step === 'success' ? 'Berhasil!' : 'Lupa Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'request' && 'Masukkan email Anda untuk menerima tautan reset password'}
            {step === 'reset' && 'Masukkan password baru Anda'}
            {step === 'success' && 'Password Anda berhasil direset. Silakan login dengan password baru Anda.'}
          </p>
        </div>

        {message.text && (
          <Alert 
            variant={message.type === 'error' ? 'destructive' : 'default'}
            className="mb-4"
          >
            {message.type === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <span>{message.text}</span>
          </Alert>
        )}

        {step === 'success' ? (
          <div className="mt-8 text-center">
            <Button onClick={() => navigate('/login')} className="w-full">
              Kembali ke Login
            </Button>
          </div>
        ) : (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-center">
                {step === 'request' ? 'Reset Password' : 'Buat Password Baru'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form 
                onSubmit={step === 'request' ? handleRequestReset : handleResetPassword} 
                className="mt-8 space-y-6"
              >
                {step === 'request' ? (
                  <div>
                    <div className="mb-4">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder="Password Baru"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full"
                      />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder="Konfirmasi Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Memproses...
                      </>
                    ) : step === 'request' ? (
                      'Kirim Tautan Reset'
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-4 text-center text-sm">
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Kembali ke halaman login
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
