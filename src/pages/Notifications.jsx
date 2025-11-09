import { useData } from '@/context/DataContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { getOverdueReminders, getUpcomingReminders } from '@/lib/reminderSystem'
import { Bell, Check, Trash2, Calendar, Droplets, Sprout, AlertTriangle, Bug } from 'lucide-react'

const NOTIFICATION_ICONS = {
  harvest: Calendar,
  watering: Droplets,
  fertilizing: Sprout,
  weeding: Sprout,
  pesticide: Bug,
  general: Bell,
}

export function Notifications() {
  const { notifications, markNotificationAsRead, deleteNotification } = useData()

  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)
  const overdueReminders = getOverdueReminders(notifications)
  const upcomingReminders = getUpcomingReminders(notifications)

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id)
  }

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus notifikasi ini?')) {
      deleteNotification(id)
    }
  }

  const handleMarkAllAsRead = () => {
    unreadNotifications.forEach(n => markNotificationAsRead(n.id))
  }

  const renderNotification = (notification) => {
    const Icon = NOTIFICATION_ICONS[notification.type] || Bell
    
    return (
      <div
        key={notification.id}
        className={`flex items-start gap-4 p-4 rounded-lg ${
          notification.read ? 'bg-muted' : 'bg-primary/10 border-l-4 border-primary'
        }`}
      >
        <div className={`p-2 rounded-lg ${
          notification.read ? 'bg-background' : 'bg-primary/20'
        }`}>
          <Icon className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{notification.title}</h4>
            {!notification.read && (
              <Badge variant="info" className="text-xs">Baru</Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            {notification.message}
          </p>
          
          <p className="text-xs text-muted-foreground">
            {formatDate(notification.date)}
          </p>
        </div>

        <div className="flex gap-2">
          {!notification.read && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleMarkAsRead(notification.id)}
              title="Tandai sudah dibaca"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(notification.id)}
            title="Hapus"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notifikasi & Pengingat</h2>
          <p className="text-muted-foreground">
            {unreadNotifications.length} notifikasi belum dibaca
          </p>
        </div>
        {unreadNotifications.length > 0 && (
          <Button onClick={handleMarkAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Tandai Semua Sudah Dibaca
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Notifikasi</p>
                <p className="text-3xl font-bold mt-2">{notifications.length}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Belum Dibaca</p>
                <p className="text-3xl font-bold mt-2">{unreadNotifications.length}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sudah Dibaca</p>
                <p className="text-3xl font-bold mt-2">{readNotifications.length}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Belum ada notifikasi. Notifikasi akan muncul untuk pengingat panen dan aktivitas lainnya.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overdue Reminders - URGENT */}
          {overdueReminders.length > 0 && (
            <Card className="border-red-500 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Pengingat Jatuh Tempo ({overdueReminders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overdueReminders.map(renderNotification)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Reminders */}
          {upcomingReminders.length > 0 && (
            <Card className="border-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <Bell className="h-5 w-5" />
                  Pengingat Mendatang (1-3 Hari)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingReminders.map(renderNotification)}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Unread Notifications */}
          {unreadNotifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Belum Dibaca</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {unreadNotifications.map(renderNotification)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sudah Dibaca</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {readNotifications.map(renderNotification)}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
