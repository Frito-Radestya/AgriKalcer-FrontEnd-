import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { AlertCircle, ArrowLeft, User, Mail, Lock, Check } from 'lucide-react'

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok')
      return
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      if (result.success) {
        setRegistrationSuccess(true)
      } else {
        setError(result.error || 'Terjadi kesalahan saat mendaftar')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi nanti.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (registrationSuccess) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#0b130f] text-[#f7f3eb]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80"
            alt="Latar agrikultur"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#08130d] via-[#0b130f]/90 to-[#1c2f22]/85" />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-2xl text-white shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
            <CardHeader className="space-y-3 pb-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ffe457]/20">
                <Check className="h-7 w-7 text-[#ffe457]" />
              </div>
              <CardTitle className="text-2xl font-semibold text-center">Pendaftaran Berhasil!</CardTitle>
              <CardDescription className="text-center text-[#d3c9b6]">
                Akun Anda berhasil dibuat. Silakan masuk untuk memulai orkestrasi musim.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                onClick={() => navigate('/login')}
                className="w-full h-12 rounded-full bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] font-semibold"
              >
                Masuk Sekarang
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
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80"
          alt="Latar agrikultur"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#08130d] via-[#0b130f]/90 to-[#1c2f22]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(248,192,107,0.2),transparent_55%)]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80"
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
                  <User className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-semibold">Aktifkan Workspace Lumbung Tani</h1>
              </div>
            </div>
            <p className="text-lg text-[#e0d6c6] leading-relaxed max-w-xl">
              Daftarkan tim untuk menyatukan tanaman, keuangan, dan jadwal lapangan dengan gaya dashboard earthy modern.
            </p>
            <div className="space-y-4">
              {[
                'Kelola seluruh blok produksi dengan template SOP siap pakai.',
                'Koordinasikan agronom, operator, dan koperasi dalam satu panel.',
                'Sinkronkan catatan lapangan, sensor, dan analitik margin.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="rounded-full bg-[#ffe457]/20 text-[#ffe457] p-2 mt-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-[#d3c9b6]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <Button
              variant="ghost"
              className="mb-6 px-0 text-[#c4bbab] hover:text-white hover:bg-transparent"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>

            {/* Mobile Logo */}
            <div className="lg:hidden flex flex-col items-center text-center mb-8 space-y-3">
              <div className="bg-[#ffe457] text-[#1b2c1f] p-3 rounded-2xl shadow-xl">
                <User className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-[#ffd12f]">Agri Kalcer</p>
                <h1 className="text-3xl font-semibold text-white mt-2">Daftar Workspace</h1>
              </div>
            </div>

            <Card className="border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.35)] text-white">
              <CardHeader className="space-y-3 pb-6">
                <p className="text-xs uppercase tracking-[0.45em] text-[#ffd12f] text-center">Registrasi</p>
                <CardTitle className="text-2xl font-semibold text-center">Buat Akun Baru</CardTitle>
                <CardDescription className="text-center text-[#d3c9b6]">
                  Isi data untuk mengaktifkan akses dashboard
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
                    <Label htmlFor="name" className="text-sm font-medium text-[#d3c9b6]">
                      Nama Lengkap
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/60">
                        <User className="h-4 w-4" />
                      </div>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Nama lengkap"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-12 rounded-2xl pl-12 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-[#ffe457]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-[#d3c9b6]">
                      Email
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/60">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="nama@koperasi.id"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-12 rounded-2xl pl-12 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-[#ffe457]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-[#d3c9b6]">
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/60">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="h-12 rounded-2xl pl-12 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-[#ffe457]"
                      />
                    </div>
                    <p className="text-xs text-[#b8af9f] mt-1">Minimal 6 karakter</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#d3c9b6]">
                      Konfirmasi Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/60">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="h-12 rounded-2xl pl-12 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-[#ffe457]"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-full bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] font-semibold shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-[#c4bbab]">
                  Sudah punya akun?{' '}
                  <Link to="/login" className="font-semibold text-[#ffe457] hover:text-white">
                    Masuk disini
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
