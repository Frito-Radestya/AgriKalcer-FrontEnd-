import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react'
import Pertanian4 from '../../assets/Pertanian4.jpg'
import LogoWeb from '../../assets/iconlogo1.png'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid')
      return
    }

    const result = await login(email, password)
    if (result.success) {
      setLoginSuccess(true)
    } else {
      // Pesan error spesifik
      if (result.error?.includes('credentials') || result.error?.includes('Invalid')) {
        setError('Email atau password salah')
      } else if (result.error?.includes('email')) {
        setError('Email tidak ditemukan')
      } else if (result.error?.includes('password')) {
        setError('Password salah')
      } else {
        setError(result.error || 'Terjadi kesalahan. Silakan coba lagi.')
      }
    }
  }

  if (loginSuccess) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#0b130f] text-[#f7f3eb]">
        <div className="absolute inset-0">
          <img
            src={Pertanian4}
            alt="Latar agrikultur"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#08130d] via-[#0b130f]/90 to-[#1c2f22]/85 rounded-l-3xl" />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 md:py-16">
          <Card className="w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-2xl text-white shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
            <CardHeader className="space-y-3 pb-4 md:pb-6">
              <div className="mx-auto flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#ffe457]/20">
                <Check className="h-6 w-6 md:h-7 md:w-7 text-[#ffe457]" />
              </div>
              <CardTitle className="text-xl md:text-2xl font-semibold text-center">Selamat Datang Kembali!</CardTitle>
              <CardDescription className="text-center text-[#d3c9b6] text-sm md:text-base">
                Login berhasil. Selamat datang di Lumbung Tani Platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full h-10 md:h-12 rounded-full bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] font-semibold text-sm md:text-base"
              >
                Masuk ke Dashboard
              </Button>
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
              className="h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#08130d] via-[#0b130f]/80 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col justify-center px-14 py-20 text-white space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-[#ffd12f]">Agri Kalcer</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm overflow-hidden border-2 border-green-500">
                <img src={LogoWeb} alt="Logo" className="h-14 w-14 object-cover rounded-full scale-110" />
              </div>
                <h1 className="text-4xl font-semibold">Lumbung Tani Platform</h1>
              </div>
            </div>
            <p className="text-lg text-[#e0d6c6] leading-relaxed max-w-xl">
              Kelola blok produksi, jadwal lapangan, dan insight finansial dalam satu kanvas bernuansa earthy.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Petani Aktif', value: '500+' },
                { label: 'Hektar Termonitor', value: '1000+' },
                { label: 'Komoditas', value: '50+' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/15 bg-white/5 p-4 backdrop-blur text-center"
                >
                  <div className="text-3xl font-semibold text-white">{item.value}</div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#b8af9f] mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex flex-col items-center text-center mb-8 space-y-3">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm overflow-hidden border-2 border-green-500">
                <img src={LogoWeb} alt="Logo" className="h-14 w-14 object-cover rounded-full scale-110" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-[#ffd12f]">Agri Kalcer</p>
                <h1 className="text-3xl font-semibold text-white mt-2">Lumbung Tani Platform</h1>
              </div>
            </div>

            <Card className="border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.35)] text-white">
              <CardHeader className="space-y-3 pb-6">
                <p className="text-xs uppercase tracking-[0.45em] text-[#ffd12f] text-center">Masuk</p>
                <CardTitle className="text-2xl font-semibold text-center">Selamat Datang Kembali</CardTitle>
                <CardDescription className="text-center text-[#d3c9b6]">
                  Masuk ke akun Anda untuk melanjutkan orkestrasi lapangan
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-[#2a1414] border border-[#f18b8b]/40 text-[#ffbbbb] px-4 py-3 rounded-2xl flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-[#d3c9b6]">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@koperasi.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-[#ffe457] focus-visible:border-white/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-[#d3c9b6]">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-[#ffe457] focus-visible:border-white/30 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-[#c4bbab]">
                    <label className="flex items-center gap-2">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-white/30 bg-transparent text-[#ffe457] focus:ring-[#ffe457]"
                      />
                      Ingat saya
                    </label>
                    <Link to="/forgot-password" className="text-[#ffe457] hover:text-white transition-colors">
                      Lupa password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-full bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] font-semibold shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
                    size="lg"
                  >
                    Masuk
                  </Button>
                </form>

                <div className="mt-4 text-center text-sm text-[#c4bbab]">
                  Belum punya akun?{' '}
                  <Link to="/register" className="font-semibold text-[#ffe457] hover:text-white">
                    Daftar sekarang
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-xs text-[#9db892] tracking-[0.3em] uppercase">
              2025 · Agri Kalcer Collective
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
