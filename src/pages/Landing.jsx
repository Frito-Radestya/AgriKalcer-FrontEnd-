import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Calendar,
  Droplets,
  Facebook,
  Globe,
  HeartHandshake,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sprout,
  Star,
  Users,
  X,
  Youtube,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ImageCarousel } from '@/components/ImageCarousel'
import { BackgroundCarousel } from '@/components/BackgroundCarousel'
import Pertanian1 from '../../assets/Pertanian1.jpg'
import Pertanian2 from '../../assets/Pertanian2.jpg'
import Pertanian3 from '../../assets/Pertanian3.jpg'
import Pertanian4 from '../../assets/Pertanian4.jpg'
import Pertanian5 from '../../assets/Pertanian5.jpg'
import Pertanian6 from '../../assets/Pertanian6.jpg'
import VideoLoading from '../../assets/VideoTani.mp4'
import LogoWeb from '../../assets/iconlogo1.png'

const heroStats = [
  { value: '240+', label: 'Hektar termonitor', detail: '38 blok produksi aktif' },
  { value: '12%', label: 'Efisiensi air', detail: 'hemat rata-rata per musim' },
  { value: '32%', label: 'Kenaikan panen', detail: 'setelah 2 siklus tanam' },
]

const backgroundImages = [
  Pertanian1,
  Pertanian2,
  Pertanian3,
  Pertanian4,
  Pertanian5,
  Pertanian6,
]

const strategicPillars = [
  {
    title: 'Perencanaan Musim',
    description: 'Simulasikan rotasi komoditas, jadwal tanam, dan kebutuhan input per blok.',
    icon: Calendar,
  },
  {
    title: 'Monitoring Lahan',
    description: 'Integrasi sensor, cuaca, dan inspeksi lapangan dalam satu kanvas taktis.',
    icon: ShieldCheck,
  },
  {
    title: 'Kolaborasi Tim',
    description: 'Tugas otomatis, check-list lapangan, serta log aktivitas yang mudah diaudit.',
    icon: Users,
  },
]

const modules = [
  {
    id: 1,
    name: 'Tanam & Varietas',
    description: 'Kelola rencana varietas, kebutuhan bibit, dan status blok.',
    icon: Sprout,
    to: '/plants',
  },
  {
    id: 2,
    name: 'Panen & Distribusi',
    description: 'Pantau target panen, stok gudang, dan jalur distribusi.',
    icon: BarChart3,
    to: '/harvests',
  },
  {
    id: 3,
    name: 'Perawatan & Irigasi',
    description: 'Otomasi jadwal penyiraman, pemupukan, dan proteksi tanaman.',
    icon: Droplets,
    to: '/maintenance',
  },
  {
    id: 4,
    name: 'Keuangan Agribisnis',
    description: 'Bandingkan biaya musiman, proyeksi margin, dan cashflow kebun.',
    icon: Activity,
    to: '/finances',
  },
  {
    id: 5,
    name: 'Peta Lahan Digital',
    description: 'Mapping blok, status tanah, serta kondisi sensor secara real-time.',
    icon: MapPin,
    to: '/lands',
  },
  {
    id: 6,
    name: 'Tim & Mitra',
    description: 'Kelola akses operator, kontraktor, dan koperasi mitra.',
    icon: HeartHandshake,
    to: '/dashboard',
  },
]

const workflowSteps = [
  {
    title: 'Mapping & Baseline',
    detail: 'Digitalkan lahan, profil tanah, serta histori panen sebagai dasar analitik.',
  },
  {
    title: 'Simulasi Musim',
    detail: 'Rancang kalender tanam hingga kebutuhan input secara otomatis.',
  },
  {
    title: 'Eksekusi Lapangan',
    detail: 'Tugaskan tim, catat progres, dan integrasikan IoT/monitor cuaca.',
  },
  {
    title: 'Review & Insight',
    detail: 'Bandingkan realisasi vs target untuk keputusan musim berikutnya.',
  },
]

const testimonials = [
  {
    name: 'Siti Manik',
    role: 'Manajer Operasional Kebun Stroberi',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    quote:
      'Dashboard musim membantu kami menjaga ketersediaan buah premium tanpa over-budget. Data lengkap, tim lebih sigap.',
    rating: 5,
  },
  {
    name: 'Rohman Dwi',
    role: 'Ketua Koperasi Tani',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    quote:
      'Sistem ini memudahkan kami memantau 17 kelompok tanam sekaligus dan menutup selisih biaya hingga 15%.',
    rating: 5,
  },
  {
    name: 'Indah Sari',
    role: 'Petani Organik',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    quote:
      'Catatan perawatan yang rapi bikin audit sertifikasi organik jauh lebih ringan. Semua bukti kerja ada di satu layar.',
    rating: 5,
  },
]

const gallery = [
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80',
  Pertanian4,
  Pertanian5,
  'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80',
]

export function Landing() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [navigateTo, setNavigateTo] = useState(null)

  const handleLoginClick = (destination) => {
    // Reset state untuk memastikan video muncul setiap kali
    setShowLoading(false)
    setNavigateTo(null)
    
    // Small delay untuk reset state
    setTimeout(() => {
      setShowLoading(true)
      setNavigateTo(destination)
      
      // Fade in video setelah muncul
      setTimeout(() => {
        const video = document.querySelector('video')
        if (video) {
          video.style.opacity = '0'
          video.style.transition = 'opacity 0.3s ease-in'
          setTimeout(() => {
            video.style.opacity = '1'
          }, 50)
        }
      }, 100)
    }, 50)
  }

  const handleVideoEnd = () => {
    if (navigateTo) {
      // Fade out video lalu navigasi
      const video = document.querySelector('video')
      if (video) {
        video.style.transition = 'opacity 0.3s ease-out'
        video.style.opacity = '0'
        
        // Navigasi setelah fade out
        setTimeout(() => {
          navigate(navigateTo, { replace: true })
        }, 300)
      } else {
        // Fallback jika video tidak ditemukan
        navigate(navigateTo, { replace: true })
      }
    }
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
    <div className="bg-[#0b130f] text-[#f7f3eb] min-h-screen">
      <nav className="fixed top-0 w-full z-50 border-b border-[#1c281f] bg-[#0b130f]/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm overflow-hidden border-2 border-green-500">
                <img src={LogoWeb} alt="Logo" className="h-14 w-14 object-cover rounded-full scale-110" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#9db892]">Agri Kalcer</p>
                <p className="text-xl font-semibold text-white">Lumbung Tani Platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-[#d3c9b6] hover:text-white transition-colors"
              >
                Overview
              </button>
              <button 
                onClick={() => scrollToSection('solusi')} 
                className="text-[#d3c9b6] hover:text-white transition-colors"
              >
                Solusi
              </button>
              <button 
                onClick={() => scrollToSection('modules')} 
                className="text-[#d3c9b6] hover:text-white transition-colors"
              >
                Modul
              </button>
              <button 
                onClick={() => scrollToSection('insight')} 
                className="text-[#d3c9b6] hover:text-white transition-colors"
              >
                Insight
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-[#d3c9b6] hover:text-white transition-colors"
              >
                Kontak
              </button>
              <Button onClick={() => handleLoginClick('/login')} className="bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] px-5">
                Masuk
              </Button>
            </div>
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1c281f] bg-[#0f1913] px-6 py-4 space-y-3 text-sm">
            {[
              { label: 'Overview', href: 'home' },
              { label: 'Solusi', href: 'solusi' },
              { label: 'Modul', href: 'modules' },
              { label: 'Insight', href: 'insight' },
              { label: 'Kontak', href: 'contact' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left text-[#d3c9b6] hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
            <Button onClick={() => {handleLoginClick('/login'); setMobileMenuOpen(false)}} className="w-full bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f]">Masuk</Button>
          </div>
        )}

      <main className="pt-20">
        <section id="home" className="relative min-h-[480px] overflow-hidden">
          <BackgroundCarousel 
            images={backgroundImages} 
            autoSlide={true}
            slideInterval={5000}
          />
          <div className="relative z-10">
            <div className="max-w-6xl mx-auto px-6 py-6 lg:py-8 grid gap-16 lg:grid-cols-[1.15fr,0.85fr]">
              <div>
                <p className="text-sm uppercase tracking-[0.45em] text-[#ffd12f]">Design 2025</p>
                <h1 className="mt-6 text-4xl md:text-5xl xl:text-[56px] leading-tight font-semibold text-white">
                  Manajemen pertanian terpadu untuk tim lapangan hingga boardroom
                </h1>
                <p className="mt-6 text-lg text-[#e0d6c6] max-w-2xl">
                  Dashboard modern dengan gaya natural earth-tone, menggabungkan perencanaan musim,
                  pelaksanaan lapangan, sampai insight finansial dalam satu kanvas yang elegan.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => handleLoginClick('/register')} className="w-full sm:w-auto bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] px-8 py-6 text-lg rounded-full font-semibold">
                    Jadwalkan Demo
                  </Button>
                  <Button onClick={() => handleLoginClick('/login')} variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full font-semibold">
                    Jelajahi Dashboard
                  </Button>
                </div>
                <div className="mt-12 grid gap-6 sm:grid-cols-3">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-3xl border border-white/10 bg-white/5 px-4 py-6 backdrop-blur"
                    >
                      <p className="text-3xl font-semibold text-white">{stat.value}</p>
                      <p className="mt-1 text-sm uppercase tracking-[0.3em] text-[#d3c9b6]">{stat.label}</p>
                      <p className="mt-3 text-xs text-[#b8af9f]">{stat.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[32px] border border-white/15 bg-white/5 p-8 backdrop-blur-lg">
                <p className="text-xs uppercase tracking-[0.45em] text-[#ffd12f]">Snapshot Musim</p>
                <h3 className="mt-4 text-3xl text-white font-semibold">Panen Q1 · Kebun Lembang</h3>
                <div className="mt-6 space-y-4 text-sm text-[#e8dfcf]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span>Target produksi</span>
                    <span className="font-semibold text-white">42,5 ton</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span>Tingkat kesehatan tanaman</span>
                    <span className="font-semibold text-white">93%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Alert irigasi</span>
                    <span className="font-semibold text-[#f8c06b]">2 blok perlu tindakan</span>
                  </div>
                </div>
                <div className="mt-8 rounded-2xl bg-[#ffe457]/10 p-4 text-[#ffe457] flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em]">Next Action</p>
                    <p className="text-white mt-1">Penyesuaian nutrisi blok B-12</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-white" />
                </div>
                <div className="mt-8 text-xs text-[#a8a090]">
                  Data tersinkron otomatis dari sensor cuaca, catatan tim, dan modul finansial.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="solusi" className="py-20 border-t border-[#142117] bg-[#0f1913]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-[#ffd12f]">Solusi 360°</p>
                <h2 className="mt-4 text-3xl text-white font-semibold">
                  Strategi terpadu dari perencanaan hingga pasca panen
                </h2>
              </div>
              <Button className="self-start rounded-full bg-white/10 text-white hover:bg-white/20">
                Lihat Studi Kasus
              </Button>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {strategicPillars.map((pillar) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={pillar.title}
                    className="rounded-[28px] border border-[#1f2c22] bg-gradient-to-b from-[#152218] to-[#0e1812] p-7 text-[#dfd6c3]"
                  >
                    <Icon className="h-10 w-10 text-[#ffd12f]" />
                    <h3 className="mt-6 text-xl text-white font-semibold">{pillar.title}</h3>
                    <p className="mt-3 text-sm text-[#b8af9f] leading-relaxed">{pillar.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#f6f2e9] text-[#1f261f] py-20">
          <div className="max-w-6xl mx-auto px-6 grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-[#ffe457]/30 blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80"
                alt="Tim lapangan"
                className="relative rounded-[32px] shadow-2xl border border-white"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#6c7f63]">Operasional lapangan</p>
              <h2 className="mt-4 text-3xl font-semibold text-[#1c2a1f]">
                Rhythm kerja yang sinkron antara agronom, operator, dan manajemen
              </h2>
              <p className="mt-5 text-lg text-[#4b574d]">
                Mode tampilan split-panel memudahkan Anda membandingkan progres lapangan dengan
                rencana awal tanpa meninggalkan halaman. Warna bumi yang tegas menjaga fokus tim.
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {[
                  { title: 'Checklist Taktis', detail: 'Template SOP yang bisa disesuaikan per komoditas.' },
                  { title: 'Integrasi Cuaca', detail: 'Alert mikroklimat langsung ke modul tugas.' },
                  { title: 'Log Bukti Kerja', detail: 'Foto & catatan lapangan otomatis tersimpan.' },
                  { title: 'Mode Offline', detail: 'Tetap input data ketika jaringan minim.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-[#d8d0c0] p-5 bg-white/70">
                    <p className="text-sm uppercase tracking-[0.3em] text-[#86907f]">{item.title}</p>
                    <p className="mt-2 text-sm text-[#4b574d]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="modules" className="py-20 bg-[#0f1913] border-t border-[#142117]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs uppercase tracking-[0.45em] text-[#ffd12f]">Modul Produktivitas</p>
              <h2 className="mt-4 text-3xl text-white font-semibold">
                Semua komponen utama agribisnis dalam layout modern
              </h2>
              <p className="mt-3 text-[#b8af9f]">
                Pilih modul sesuai prioritas dan aktifkan hanya yang dibutuhkan. Tampilan konsisten,
                mudah dibaca, dan siap dipakai tim lintas divisi.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => {
                const Icon = module.icon
                return (
                  <div
                    key={module.id}
                    className="rounded-[26px] border border-white/5 bg-gradient-to-br from-white/5 to-white/0 p-6 hover:border-[#ffd12f]/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="rounded-2xl bg-[#18241b] p-3">
                        <Icon className="h-8 w-8 text-[#ffd12f]" />
                      </div>
                      <Link to="/login">
                        <Button className="rounded-full bg-white/15 text-white hover:bg-white/25 px-4 py-1 text-sm">
                          Buka
                        </Button>
                      </Link>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-white">{module.name}</h3>
                    <p className="mt-3 text-sm text-[#b8af9f]">{module.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="insight" className="py-20 bg-[#f6f2e9] text-[#1f261f]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[#768065]">Insight Berlapis</p>
                <h2 className="mt-3 text-3xl font-semibold text-[#1c251c]">Workflow empat fase</h2>
                <p className="mt-3 text-[#4b574d]">
                  Visual ala timeline horizontal memberi gambaran jelas terhadap status musim. Setiap
                  kartu punya warna aksen berbeda agar mudah dikenali.
                </p>
              </div>
              <Button className="rounded-full bg-[#1b2c1f] text-[#ffe457] hover:bg-[#142117]">
                Ekspor Laporan
              </Button>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-4">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative rounded-[26px] border border-[#d8d0c0] bg-white p-6 shadow-lg"
                >
                  <div className="text-xs font-semibold tracking-[0.35em] text-[#88937d]">STEP 0{index + 1}</div>
                  <h3 className="mt-4 text-xl text-[#1c251c] font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm text-[#4b574d] leading-relaxed">{step.detail}</p>
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden lg:block absolute right-[-28px] top-1/2 h-0.5 w-7 bg-[#d8d0c0]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="py-20 bg-[#0f1913]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.45em] text-[#ffd12f]">Visual Lapangan</p>
              <h2 className="text-3xl text-white font-semibold">Katalog dokumentasi musim 2025</h2>
            </div>
            <div className="mt-10 h-[400px] md:h-[500px]">
              <ImageCarousel 
                images={gallery} 
                autoSlide={true}
                slideInterval={4000}
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f6f2e9] text-[#1f261f]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs uppercase tracking-[0.4em] text-[#6c7f63]">Testimoni</p>
              <h2 className="mt-3 text-3xl font-semibold">Dipakai tim agrikultur modern</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="rounded-[28px] border border-[#d8d0c0] bg-white p-8 shadow-md">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, index) => (
                      <Star key={index} className="h-4 w-4 text-[#f3b653] fill-[#f3b653]" />
                    ))}
                  </div>
                  <p className="mt-5 text-[#4b574d] italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="mt-8 flex items-center gap-4">
                    <img src={testimonial.image} alt={testimonial.name} className="h-14 w-14 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-[#6c7f63]">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0f1913]" id="contact">
          <div className="max-w-6xl mx-auto px-6 grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#ffd12f]">Hubungi Kami</p>
              <h2 className="mt-4 text-3xl text-white font-semibold">Kreasi gaya baru untuk operasional Anda</h2>
              <p className="mt-4 text-[#b8af9f]">
                Tim kami siap mendampingi aktivasi modul dan mendesain template kerja menyesuaikan identitas
                koperasi/korporasi Anda.
              </p>
              <div className="mt-8 space-y-5">
                {[
                  { icon: MapPin, label: 'Kantor Operasional', value: 'Lumbung Tani, Kab. Bandung, Jawa Barat' },
                  { icon: Phone, label: 'Hotline Konsultan', value: '+62 812-1234-4567' },
                  { icon: Mail, label: 'Surel', value: 'halo@agrikalcer.id' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex gap-4">
                      <div className="rounded-2xl bg-white/10 p-3">
                        <Icon className="h-5 w-5 text-[#ffd12f]" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-[#8a937f]">{item.label}</p>
                        <p className="mt-1 text-white">{item.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-8 flex gap-4">
                {[Facebook, Instagram, Youtube, Globe].map((Icon) => (
                  <a
                    key={Icon.displayName}
                    href="#"
                    className="rounded-full border border-white/10 p-3 text-white hover:bg-white/10 transition"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
              <h3 className="text-2xl text-white font-semibold">Konsultasi gaya front-end</h3>
              <p className="mt-2 text-sm text-[#d3c9b6]">
                Ceritakan kebutuhan tim, kami bantu terjemahkan ke UI bertema earthy modern seperti inspirasi Anda.
              </p>
              <form className="mt-6 space-y-5">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-[#8a937f]">Nama</label>
                  <input
                    type="text"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffd12f]"
                    placeholder="Tuliskan nama Anda"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-[#8a937f]">Email</label>
                  <input
                    type="email"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffd12f]"
                    placeholder="nama@perusahaan.com"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-[#8a937f]">Catatan</label>
                  <textarea
                    rows="4"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffd12f]"
                    placeholder="Ceritakan gaya UI yang ingin diterapkan"
                  />
                </div>
                <Button className="w-full rounded-full bg-[#ffe457] text-[#1b2c1f] hover:bg-[#ffd12f] py-4 font-semibold">
                  Kirim Brief
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#142117] bg-[#0b130f] text-[#b8af9f]">
        <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm overflow-hidden border-2 border-green-500">
                <img src={LogoWeb} alt="Logo" className="h-14 w-14 object-cover rounded-full scale-110" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#9db892]">Agri Kalcer</p>
                <p className="text-lg text-white font-semibold">Lumbung Tani</p>
              </div>
            </div>
            <p className="mt-4 text-sm">
              Platform manajemen pertanian dengan gaya visual modern, siap mengawal ekspansi operasional Anda.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#ffd12f]">Navigasi</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-white">
                  Overview
                </a>
              </li>
              <li>
                <a href="#solusi" className="hover:text-white">
                  Solusi
                </a>
              </li>
              <li>
                <a href="#modules" className="hover:text-white">
                  Modul
                </a>
              </li>
              <li>
                <a href="#insight" className="hover:text-white">
                  Insight
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#ffd12f]">Kontak</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Lumbung Tani, Bandung</li>
              <li>+62 812-1234-4567</li>
              <li>halo@agrikalcer.id</li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#ffd12f]">Langkah berikutnya</p>
            <p className="mt-4 text-sm">
              Unduh deck gaya visual atau jadwalkan sesi design jam berikutnya.
            </p>
            <Button onClick={() => handleLoginClick('/login')} className="mt-4 w-full rounded-full bg-white/10 text-white hover:bg-white/20">
              Masuk
            </Button>
          </div>
        </div>
        <div className="border-t border-[#142117] py-6 text-center text-xs text-[#7a8573]">
          © {new Date().getFullYear()} Agri Kalcer · All rights reserved.
        </div>
      </footer>
    </div>
    
    {/* Loading Video Modal */}
    {showLoading && (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-100"
        style={{ backgroundColor: 'black' }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <video 
            key={Date.now()} // Force re-render video
            autoPlay 
            muted 
            playsInline
            className="max-w-full max-h-full object-contain scale-125"
            onEnded={handleVideoEnd}
          >
            <source src={VideoLoading} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    )}
    </>
  )
}
