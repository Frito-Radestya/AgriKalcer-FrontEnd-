import { useData } from '@/context/DataContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate, calculateDaysDifference } from '@/lib/utils'
import { getOverdueReminders } from '@/lib/reminderSystem'
import {
  Sprout,
  Calendar,
  TrendingUp,
  DollarSign,
  MapPin,
  Droplets,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react'

export function Dashboard() {
  const { plants, harvests, finances, lands, notifications } = useData()

  const activePlants = plants.filter(p => p.status === 'active')
  const totalHarvests = harvests.length
  const totalLands = lands.length

  // Calculate financial summary
  const income = finances
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + f.amount, 0)
  const expenses = finances
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

  // Overdue reminders
  const overdueReminders = getOverdueReminders(notifications)

  // Recent activities
  const recentNotifications = notifications.slice(0, 5)

  const stats = [
    {
      title: 'Tanaman Aktif',
      value: activePlants.length,
      icon: Sprout,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Total Panen',
      value: totalHarvests,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Laba Bersih',
      value: formatCurrency(profit),
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    },
    {
      title: 'Lahan Terdaftar',
      value: totalLands,
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Overdue Reminders Alert */}
      {overdueReminders.length > 0 && (
        <Card className="border-red-500 border-2 bg-red-50 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Peringatan: {overdueReminders.length} Pengingat Jatuh Tempo!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueReminders.slice(0, 3).map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded"
                >
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">{reminder.title}</span>
                  <span className="text-xs text-muted-foreground">- {reminder.plantName}</span>
                </div>
              ))}
              {overdueReminders.length > 3 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  +{overdueReminders.length - 3} pengingat lainnya
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Harvests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Panen Mendatang (7 Hari)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingHarvests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Tidak ada panen dalam 7 hari ke depan
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingHarvests.map((plant) => {
                  const daysLeft = calculateDaysDifference(
                    new Date(),
                    new Date(plant.estimatedHarvestDate)
                  )
                  return (
                    <div
                      key={plant.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{plant.plantName}</p>
                        <p className="text-sm text-muted-foreground">
                          Lahan: {plant.landName}
                        </p>
                      </div>
                      <Badge variant={daysLeft <= 3 ? 'warning' : 'info'}>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5" />
              Tanaman Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activePlants.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Belum ada tanaman aktif
              </p>
            ) : (
              <div className="space-y-3">
                {activePlants.slice(0, 5).map((plant) => (
                  <div
                    key={plant.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{plant.plantName}</p>
                      <p className="text-sm text-muted-foreground">
                        Ditanam: {formatDate(plant.plantDate)}
                      </p>
                    </div>
                    <Badge variant="success">Aktif</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ringkasan Keuangan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pendapatan</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(income)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pengeluaran</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(expenses)}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Laba Bersih</span>
                  <span className={`font-bold text-lg ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(profit)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Notifikasi Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentNotifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Tidak ada notifikasi
              </p>
            ) : (
              <div className="space-y-3">
                {recentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg ${
                      notif.read ? 'bg-muted' : 'bg-primary/10'
                    }`}
                  >
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
