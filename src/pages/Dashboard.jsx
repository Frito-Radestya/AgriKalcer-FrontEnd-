import { useData } from '@/context/useData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate, calculateDaysDifference } from '@/lib/utils'
import { Sprout, Calendar, TrendingUp, DollarSign, MapPin, AlertCircle, Bell } from 'lucide-react'

export function Dashboard() {
  const { plants, harvests, finances, lands, notifications } = useData()

  // Ensure all data are arrays (safety check)
  const plantsArray = Array.isArray(plants) ? plants : []
  const harvestsArray = Array.isArray(harvests) ? harvests : []
  const financesArray = Array.isArray(finances) ? finances : []
  const landsArray = Array.isArray(lands) ? lands : []
  const notificationsArray = Array.isArray(notifications) ? notifications : []

  const activePlants = plantsArray.filter(p => p.status === 'active')
  const totalHarvests = harvestsArray.length
  const totalLands = landsArray.length

  // Calculate financial summary
  const income = financesArray
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + f.amount, 0)
  const expenses = financesArray
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0)
  const profit = income - expenses

  // Upcoming harvests (within 7 days)
  const upcomingHarvests = activePlants.filter(plant => {
    const daysUntilHarvest = calculateDaysDifference(
      new Date(),
      new Date(plant.estimatedHarvestDate)
    )
    return daysUntilHarvest <= 7 && daysUntilHarvest >= 0
  })

  // Recent notifications
  const recentNotifications = notificationsArray
    .filter(n => !n.read)
    .slice(0, 5)

  const stats = [
    {
      title: 'Tanaman Aktif',
      value: activePlants.length,
      icon: Sprout,
    },
    {
      title: 'Total Panen',
      value: totalHarvests,
      icon: Calendar,
    },
    {
      title: 'Laba Bersih',
      value: formatCurrency(profit),
      icon: DollarSign,
    },
    {
      title: 'Lahan Terdaftar',
      value: totalLands,
      icon: MapPin,
    },
  ]

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {/* Dashboard Header */}
      <div className="mb-1 md:mb-2">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
          Dashboard Utama
        </h2>
        <p className="text-xs md:text-sm text-[#c4bbab]">
          Pantau ringkasan aktivitas, keuangan, dan kondisi lahan pertanian Anda dalam satu tampilan.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="hover:-translate-y-1 transition-all duration-300"
            >
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#b8af9f]">
                      {stat.title}
                    </p>
                    <p className="text-lg md:text-xl font-semibold mt-3 md:mt-4 text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-2 md:p-3 text-[#ffe457] shadow-inner shadow-black/30">
                    <Icon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Unread Notifications Alert */}
      {recentNotifications.length > 0 && (
        <Card className="brand-header-gradient border-white/15">
          <CardHeader className="border-0 p-3 md:p-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="h-4 w-4 md:h-5 md:w-5 text-[#ffe457]" />
              <span className="text-sm md:text-base">{recentNotifications.length} Notifikasi Baru</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="max-h-36 md:max-h-48 overflow-y-auto space-y-1.5">
              {recentNotifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center gap-1.5 p-1.5 md:p-2 rounded-lg border border-white/5 bg-white/5"
                >
                  <AlertCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#ffe457]" />
                  <span className="text-xs md:text-sm font-medium text-white">{notification.title}</span>
                  <span className="text-[10px] md:text-xs text-[#b8af9f]">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'Tanggal tidak tersedia'}
                  </span>
                </div>
              ))}
              {recentNotifications.length > 10 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  +{recentNotifications.length - 10} notifikasi lainnya
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
        {/* Upcoming Harvests */}
        <Card>
          <CardHeader className="brand-header-gradient border-0 p-3 md:p-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-4 w-4 md:h-5 md:w-5 text-[#ffe457]" />
              <span className="text-sm md:text-base">Panen Mendatang (7 Hari)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-3 md:p-4">
            {upcomingHarvests.length === 0 ? (
              <p className="text-[#b8af9f] text-center py-4 md:py-6 text-sm">
                Tidak ada panen dalam 7 hari ke depan
              </p>
            ) : (
              <div className="max-h-48 md:max-h-64 overflow-y-auto space-y-2">
                {upcomingHarvests.map((plant) => {
                  const daysLeft = calculateDaysDifference(
                    new Date(),
                    new Date(plant.estimatedHarvestDate)
                  )
                  return (
                  <div
                    key={plant.id}
                    className="flex items-center justify-between p-2 md:p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition"
                  >
                    <div>
                      <p className="font-medium text-sm md:text-base text-white">{plant.plantName}</p>
                      <p className="text-xs md:text-sm text-[#b8af9f]">
                        Lahan: {plant.landName}
                      </p>
                    </div>
                    <Badge
                      variant={daysLeft <= 3 ? 'warning' : 'info'}
                      className="font-semibold"
                    >
                      {daysLeft} hari lagi
                    </Badge>
                  </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Plants */}
        <Card>
          <CardHeader className="brand-header-gradient border-0 p-3 md:p-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Sprout className="h-4 w-4 md:h-5 md:w-5 text-[#ffe457]" />
              <span className="text-sm md:text-base">Tanaman Aktif</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-3 md:p-4">
            {activePlants.length === 0 ? (
              <p className="text-[#b8af9f] text-center py-4 md:py-6 text-sm">
                Belum ada tanaman aktif
              </p>
            ) : (
              <div className="max-h-48 md:max-h-64 overflow-y-auto space-y-2">
                {activePlants.slice(0, 10).map((plant) => (
                  <div
                    key={plant.id}
                    className="flex items-center justify-between p-2 md:p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition"
                  >
                    <div>
                      <p className="font-medium text-sm md:text-base text-white">{plant.plantName}</p>
                      <p className="text-xs md:text-sm text-[#b8af9f]">
                        Ditanam: {formatDate(plant.plantDate)}
                      </p>
                    </div>
                    <Badge className="font-semibold" variant="success">
                      Aktif
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Summary - Full Width */}
        <Card className="lg:col-span-2">
          <CardHeader className="brand-header-gradient border-0 p-3 md:p-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-[#ffe457]" />
              <span className="text-sm md:text-base">Ringkasan Keuangan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-3 md:p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
              <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3 md:p-4">
                <span className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#b8af9f]">Pendapatan</span>
                <span className="text-lg md:text-xl font-semibold text-[#d9f87d]">
                  {formatCurrency(income)}
                </span>
              </div>
              <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3 md:p-4">
                <span className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#b8af9f]">Pengeluaran</span>
                <span className="text-lg md:text-xl font-semibold text-[#f18b8b]">
                  {formatCurrency(expenses)}
                </span>
              </div>
              <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3 md:p-4">
                <span className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#b8af9f]">Laba Bersih</span>
                <span className={`text-lg md:text-xl font-semibold ${profit >= 0 ? 'text-[#d9f87d]' : 'text-[#f18b8b]'}`}>
                  {formatCurrency(profit)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
