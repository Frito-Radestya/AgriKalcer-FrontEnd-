import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import Pertanian4 from '../../assets/Pertanian4.jpg'
import LogoWeb from '../../assets/iconlogo1.png'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4001'

export default function ForgotPasswordSimple() {
  const [step, setStep] = useState('request') // 'request' | 'verify' | 'success'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const res = await fetch(`${API_BASE}/api/auth/request-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setMessage({
          type: 'error',
          text: data.message || 'Gagal mengirim kode OTP. Silakan coba lagi.',
        })
        return
      }

      setMessage({
        type: 'success',
        text: 'Jika email terdaftar, kode OTP telah dikirim. Silakan cek email Anda.',
      })
      setStep('verify')
    } catch (error) {
      console.error('Error request OTP:', error)
      setMessage({
        type: 'error',
        text: 'Terjadi kesalahan koneksi. Silakan coba lagi.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResetWithOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (!otp || otp.length !== 6) {
      setMessage({ type: 'error', text: 'Kode OTP harus 6 digit.' })
      setLoading(false)
      return
    }

    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password baru minimal 6 karakter.' })
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok.' })
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.success) {
        setMessage({
          type: 'error',
          text: data.message || 'Gagal mereset password. Periksa kembali kode OTP Anda.',
        })
        return
      }

      setMessage({
        type: 'success',
        text: 'Password berhasil direset. Anda bisa login dengan password baru.',
      })
      setStep('success')
    } catch (error) {
      console.error('Error reset password OTP:', error)
      setMessage({
        type: 'error',
        text: 'Terjadi kesalahan koneksi. Silakan coba lagi.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b130f] text-[#f7f3eb]">
      <div className="absolute inset-0">
        <img
          src={Pertanian4}
          alt="Latar agrikultur"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#08130d] via-[#0b130f]/90 to-[#1c2f22]/85 rounded-l-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(205,229,125,0.2),transparent_55%)]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-r-3xl">
          <div className="absolute inset-0">
            <img
              src={Pertanian4}
              alt="Latar agrikultur"
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#08130d] via-[#0b130f]/80 to-[#1c2f22]/70" />
          </div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 py-16">
            <div className="mb-8">
              <img src={LogoWeb} alt="Lumbung Tani" className="h-12 w-auto mb-6" />
              <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
                Lumbung Tani
              </h1>
              <p className="text-xl text-[#d3c9b6] leading-relaxed">
                Platform manajemen pertanian digital untuk meningkatkan produktivitas dan efisiensi pertanian Anda.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#ffe457]/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#ffe457]" />
                </div>
                <span className="text-[#d3c9b6]">Reset password aman dan cepat</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#ffe457]/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#ffe457]" />
                </div>
                <span className="text-[#d3c9b6]">Password baru langsung tersedia</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#ffe457]/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#ffe457]" />
                </div>
                <span className="text-[#d3c9b6]">Tidak perlu konfirmasi email</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-2xl text-white shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
            <CardHeader className="space-y-3 pb-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ffe457]/20">
                <Mail className="h-7 w-7 text-[#ffe457]" />
              </div>
              <CardTitle className="text-2xl font-semibold text-center">
                {step === 'request' && 'Lupa Password?'}
                {step === 'verify' && 'Masukkan Kode OTP'}
                {step === 'success' && 'Password Berhasil Direset'}
              </CardTitle>
              <CardDescription className="text-center text-[#d3c9b6]">
                {step === 'request' && 'Masukkan email Anda untuk menerima kode OTP reset password.'}
                {step === 'verify' && `Kami telah mengirimkan kode OTP ke ${email}. Masukkan kode dan password baru Anda.`}
                {step === 'success' && 'Password Anda telah diperbarui. Silakan login kembali dengan password baru.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 'request' && (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#d3c9b6]">Email</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-[#d3c9b6]" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder-[#d3c9b6] focus:border-[#ffe457] focus:ring-[#ffe457]/20"
                        placeholder="nama@email.com"
                      />
                    </div>
                  </div>

                  {message.text && (
                    <Alert type={message.type === 'success' ? 'success' : 'error'}>
                      <div className="flex items-center">
                        {message.type === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="text-sm">{message.text}</span>
                      </div>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-full bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] font-semibold"
                  >
                    {loading ? 'Mengirim kode...' : 'Kirim Kode OTP'}
                  </Button>
                </form>
              )}

              {step === 'verify' && (
                <form onSubmit={handleResetWithOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[#d3c9b6]">Email</Label>
                    <Input
                      value={email}
                      readOnly
                      className="bg-white/5 border-white/20 text-white text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-[#d3c9b6]">Kode OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className="bg-white/10 border-white/20 text-white placeholder-[#d3c9b6] focus:border-[#ffe457] focus:ring-[#ffe457]/20 tracking-[0.5em] text-center"
                      placeholder="••••••"
                    />
                    {/* Hint agar kolom info tidak terasa kosong */}
                    <p className="text-xs text-[#d3c9b6] mt-1">
                      Kode OTP terdiri dari 6 digit angka yang dikirim ke email Anda. Jika belum terlihat,
                      periksa juga folder spam atau promosi.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-[#d3c9b6]">Password Baru</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-[#d3c9b6] focus:border-[#ffe457] focus:ring-[#ffe457]/20 pr-10"
                        placeholder="Minimal 6 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/70 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[#d3c9b6]">Konfirmasi Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-[#d3c9b6] focus:border-[#ffe457] focus:ring-[#ffe457]/20"
                      placeholder="Ulangi password baru"
                    />
                  </div>

                  {message.text && (
                    <Alert type={message.type === 'success' ? 'success' : 'error'}>
                      <div className="flex items-center">
                        {message.type === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="text-sm">{message.text}</span>
                      </div>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-full bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] font-semibold"
                  >
                    {loading ? 'Memproses...' : 'Reset Password'}
                  </Button>
                </form>
              )}

              {step === 'success' && (
                <div className="space-y-4">
                  {message.text && (
                    <Alert type="success">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm">{message.text}</span>
                      </div>
                    </Alert>
                  )}
                  <Button
                    type="button"
                    className="w-full h-12 rounded-full bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] font-semibold"
                    onClick={() => navigate('/login')}
                  >
                    Kembali ke Login
                  </Button>
                </div>
              )}
              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-[#d3c9b6] hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Kembali ke Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
