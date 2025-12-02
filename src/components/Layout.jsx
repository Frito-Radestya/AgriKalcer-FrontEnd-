import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'
import { useData } from '@/context/useData'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { WeatherWidget } from './WeatherWidget'
import { ProfileModal } from './ProfileModal'
import { HelpModal } from './HelpModal'
import {
  LayoutDashboard,
  Sprout,
  Droplets,
  Calendar,
  TrendingUp,
  MapPin,
  Bell,
  LogOut,
  Menu,
  X,
  User,
  DollarSign,
  HelpCircle,
  ChevronDown,
  Bot,
} from 'lucide-react'
import LogoWeb from '../../assets/iconlogo1.png'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Data Tanam', href: '/plants', icon: Sprout },
  { name: 'Perawatan', href: '/maintenance', icon: Droplets },
  { name: 'Panen', href: '/harvests', icon: Calendar },
  { name: 'Keuangan', href: '/finances', icon: DollarSign },
  { name: 'Analisis', href: '/analytics', icon: TrendingUp },
  { name: 'Lahan', href: '/lands', icon: MapPin },
  { name: 'AI Assistant', href: '/ai-chat', icon: Bot },
  { name: 'Notifikasi', href: '/notifications', icon: Bell },
]

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { notifications } = useData()

  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const currentPage = navigation.find(n => n.href === location.pathname)

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b130f] text-[#f7f3eb]">
      <div className="pointer-events-none absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80"
          alt="Latar lahan pertanian"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#08130d] via-[#0b130f]/90 to-[#1c2f22]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(205,229,125,0.15),transparent_55%)]" />
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 h-screen w-72 border-r border-[#1c281f]/70 bg-[#0f1913]/95 shadow-2xl shadow-black/40 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full text-[#d3c9b6]">
            {/* Logo */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <Link to="/dashboard" className="flex items-center gap-3 group">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm overflow-hidden border-2 border-green-500">
                <img src={LogoWeb} alt="Logo" className="h-14 w-14 object-cover rounded-full scale-110" />
              </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#9db892]">Agri Kalcer</p>
                  <p className="text-lg font-semibold text-white">Lumbung Tani</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:text-[#ffe457]"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <h3 className="px-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#7d8773] mb-3">
                  Menu Utama
                </h3>
                <div className="space-y-1">
                  {navigation.slice(0, 7).map((item) => {
                    const isActive = location.pathname === item.href
                    const Icon = item.icon
                    const showBadge = item.name === 'Notifikasi' && unreadCount > 0

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-2xl border ${
                          isActive
                            ? 'border-white/20 bg-white/10 text-white shadow-[0_15px_40px_rgba(0,0,0,0.35)]'
                            : 'border-transparent text-[#c4bbab] hover:border-white/10 hover:bg-white/5'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            isActive ? 'text-[#ffe457]' : 'text-[#8a937f] group-hover:text-[#ffe457]'
                          }`}
                        />
                        <span className="flex-1 text-sm font-medium tracking-wide">{item.name}</span>
                        {showBadge && (
                          <Badge variant="danger" className="ml-auto">
                            {unreadCount}
                          </Badge>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="px-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#7d8773] mb-3">
                  Lainnya
                </h3>
                <div className="space-y-1">
                  {navigation.slice(7).map((item) => {
                    const isActive = location.pathname === item.href
                    const Icon = item.icon
                    const showBadge = item.name === 'Notifikasi' && unreadCount > 0

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-2xl border ${
                          isActive
                            ? 'border-white/20 bg-white/10 text-white shadow-[0_15px_40px_rgba(0,0,0,0.35)]'
                            : 'border-transparent text-[#c4bbab] hover:border-white/10 hover:bg-white/5'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            isActive ? 'text-[#ffe457]' : 'text-[#8a937f] group-hover:text-[#ffe457]'
                          }`}
                        />
                        <span className="flex-1 text-sm font-medium tracking-wide">{item.name}</span>
                        {showBadge && (
                          <Badge variant="danger" className="ml-auto">
                            {unreadCount}
                          </Badge>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </nav>

            {/* User info */}
            <div className="p-5 border-t border-white/10 bg-white/5 backdrop-blur">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#ffe457]/20 p-2.5 rounded-2xl">
                  <User className="h-5 w-5 text-[#ffe457]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-[#9db892] capitalize">{user?.role}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-center gap-2 border-white/20 text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:pl-72">
          {/* Top bar */}
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b130f]/90 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 lg:px-6 py-4">
              <div className="flex items-center gap-4 flex-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-white hover:text-[#ffe457]"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>

                <div className="flex-1 lg:max-w-xl">
                  <p className="text-xs uppercase tracking-[0.4em] text-[#9db892]">
                    {currentPage?.name || 'Dashboard'}
                  </p>
                  <h1 className="text-2xl font-semibold text-white">
                    Kanvas {currentPage?.name?.toLowerCase() || 'dashboard'} pertanian
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Weather Widget */}
                <WeatherWidget />
                
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-white hover:text-[#ffe457]"
                  onClick={() => navigate('/notifications')}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#f8c06b] text-[#1b2c1f] text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                {/* Profile */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-white hover:bg-white/5"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <div className="bg-[#ffe457]/30 p-1.5 rounded-full">
                      <User className="h-4 w-4 text-[#ffe457]" />
                    </div>
                    <ChevronDown className="h-4 w-4 text-white/60" />
                  </Button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/10 bg-[#0f1913] text-white shadow-2xl shadow-black/40 py-1 z-50">
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5 w-full text-left"
                        onClick={() => {
                          setProfileOpen(false)
                          setProfileModalOpen(true)
                        }}
                      >
                        <User className="h-4 w-4" />
                        Profil
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5 w-full text-left"
                        onClick={() => {
                          setProfileOpen(false)
                          setHelpModalOpen(true)
                        }}
                      >
                        <HelpCircle className="h-4 w-4" />
                        Bantuan
                      </button>
                      <hr className="my-1 border-white/10" />
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#f8c06b] hover:bg-white/5 w-full text-left"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 lg:p-6 min-h-[calc(100vh-80px)] text-white/90">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Modals */}
      <ProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />
      <HelpModal 
        isOpen={helpModalOpen} 
        onClose={() => setHelpModalOpen(false)} 
      />
    </div>
  )
}
