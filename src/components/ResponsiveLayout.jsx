import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { useData } from '@/context/useData';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { WeatherWidget } from './WeatherWidget';
import { ProfileModal } from './ProfileModal';
import { HelpModal } from './HelpModal';
import {
  LayoutDashboard as DashboardIcon,
  Sprout as PlantIcon,
  Droplets as WaterIcon,
  Calendar as CalendarIcon,
  TrendingUp as AnalyticsIcon,
  MapPin as LandIcon,
  Bell as BellIcon,
  LogOut as LogoutIcon,
  Menu as MenuIcon,
  X as XIcon,
  User as UserIcon,
  DollarSign as FinanceIcon,
  HelpCircle as HelpIcon,
  ChevronDown as ChevronDownIcon,
  Bot as BotIcon,
  Mail as MailIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Plus as PlusIcon
} from 'lucide-react';
import LogoWeb from '../../assets/iconlogo1.png';

const navigation = [
  { name: 'Beranda', href: '/dashboard', icon: HomeIcon },
  { name: 'Lahan', href: '/lands', icon: LandIcon },
  { name: 'Tanaman', href: '/plants', icon: PlantIcon },
  { name: 'Perawatan', href: '/maintenance', icon: WaterIcon },
  { name: 'Panen', href: '/harvests', icon: CalendarIcon },
  { name: 'Keuangan', href: '/finances', icon: FinanceIcon },
  { name: 'Analisis', href: '/analytics', icon: AnalyticsIcon },
  { name: 'AI Assistant', href: '/ai-chat', icon: BotIcon },
  { name: 'Notifikasi', href: '/notifications', icon: BellIcon },
  {
    name: 'Admin',
    icon: SettingsIcon,
    children: [
      { name: 'Pengaturan Email', href: '/admin/email-settings', icon: MailIcon },
    ],
  },
];

export function ResponsiveLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useData();

  // Handle scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const filteredNavigation = navigation.filter((item) => {
    if (mobileMenuOpen && item.desktopOnly) return false;
    if (!mobileMenuOpen && item.mobileOnly) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 shadow-sm h-12 md:h-14">
        <div className="flex items-center justify-between h-full px-3 md:px-4 max-w-7xl mx-auto">
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 md:p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <XIcon size={20} className="md:hidden" /> : <MenuIcon size={20} className="md:hidden" />}
              {mobileMenuOpen ? <XIcon size={24} className="hidden md:block" /> : <MenuIcon size={24} className="hidden md:block" />}
            </button>
            <h1 className="ml-1.5 md:ml-2 text-lg md:text-xl font-bold text-green-700 dark:text-green-400">AgriFarm</h1>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 md:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon size={18} className="md:hidden" /> : <MoonIcon size={18} className="md:hidden" />}
              {darkMode ? <SunIcon size={20} className="hidden md:block" /> : <MoonIcon size={20} className="hidden md:block" />}
            </button>
            <button className="p-1.5 md:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
              <BellIcon size={18} className="md:hidden text-gray-600 dark:text-gray-300" />
              <BellIcon size={20} className="hidden md:block text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
            <button
              onClick={() => setProfileModalOpen(true)}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center"
            >
              <UserIcon size={14} className="md:hidden text-green-600 dark:text-green-400" />
              <UserIcon size={16} className="hidden md:block text-green-600 dark:text-green-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
            <div className="h-full overflow-y-auto">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Menu</h2>
              </div>
              <nav className="p-2">
                {filteredNavigation.map((item, index) => (
                  <div key={item.name} className="mb-1">
                    {!item.children ? (
                      <Link
                        to={item.href}
                        className={`flex items-center px-3 py-2 rounded text-sm font-medium ${
                          location.pathname === item.href
                            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon size={18} className="mr-3" />
                        <span className="truncate">{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <div>
                        <button
                          onClick={() => toggleSubmenu(index)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium ${
                            activeSubmenu === index ? 'bg-gray-50 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            <item.icon size={18} className="mr-3" />
                            <span className="truncate">{item.name}</span>
                          </div>
                          <ChevronDownIcon
                            size={14}
                            className={`transition-transform ${
                              activeSubmenu === index ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>
                        {activeSubmenu === index && (
                          <div className="mt-1 ml-8 space-y-0.5">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className={`block px-2.5 py-1.5 text-xs rounded ${
                                  location.pathname === child.href
                                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 mt-2 text-sm font-medium text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <LogoutIcon size={16} className="mr-2.5" />
                  Keluar
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex flex-col flex-1 h-0">
            <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-white dark:bg-gray-800">
              <h1 className="text-xl font-bold text-green-700 dark:text-green-400">AgriFarm</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {filteredNavigation.map((item) => (
                  <div key={item.name}>
                    {!item.children ? (
                      <Link
                        to={item.href}
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                          location.pathname === item.href
                            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <item.icon
                          size={18}
                          className={`mr-3 ${
                            location.pathname === item.href
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                          }`}
                        />
                        {item.name}
                        {item.badge && (
                          <span className="ml-auto bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <div className="space-y-1">
                        <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {item.name}
                        </div>
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                              location.pathname === child.href
                                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <child.icon
                              size={16}
                              className={`mr-3 ${
                                location.pathname === child.href
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                              }`}
                            />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <UserIcon size={18} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user?.name || 'Pengguna'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Petani</p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <SunIcon size={18} className="text-yellow-500" />
                  ) : (
                    <MoonIcon size={18} className="text-gray-600 dark:text-gray-300" />
                  )}
                </button>
              </div>
              <button
                onClick={() => {
                  logout();
                }}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogoutIcon size={16} className="mr-2" />
                Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto focus:outline-none pt-12 md:pt-14 lg:pt-6">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-6">
              {children}
            </div>
          </main>
        </div>

        {/* Modals */}
        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={user}
        />

        <HelpModal
          isOpen={helpModalOpen}
          onClose={() => setHelpModalOpen(false)}
        />
      </div>
    </div>
  );
}
