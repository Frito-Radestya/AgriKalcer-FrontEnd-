import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Sprout, AlertCircle } from 'lucide-react'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const result = await login(email, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b130f] text-[#f7f3eb]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80"
          alt="Latar agrikultur"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#08130d] via-[#0b130f]/90 to-[#1c2f22]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(205,229,125,0.2),transparent_55%)]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80"
              alt="Farm"
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#08130d] via-[#0b130f]/80 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col justify-center px-14 py-20 text-white space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-[#ffd12f]">Agri Kalcer</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="bg-[#ffe457] text-[#1b2c1f] p-3 rounded-2xl shadow-2xl">
                  <Sprout className="h-8 w-8" />
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
              <div className="bg-[#ffe457] text-[#1b2c1f] p-3 rounded-2xl shadow-xl">
                <Sprout className="h-8 w-8" />
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
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-[#ffe457] focus-visible:border-white/30"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm text-[#c4bbab]">
                    <label className="flex items-center gap-2">
                      <input
                        id="remember"
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/30 bg-transparent text-[#ffe457] focus:ring-[#ffe457]"
                      />
                      Ingat saya
                    </label>
                    <a href="#" className="text-[#ffe457] hover:text-white transition-colors">
                      Lupa password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-full bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] font-semibold shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
                    size="lg"
                  >
                    Masuk
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-[#c4bbab]">
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
