import { useData } from '@/context/useData'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Bell, Check, Trash2, Calendar, Droplets, Sprout, Bug } from 'lucide-react'

const NOTIFICATION_ICONS = {
  harvest: Calendar,
  watering: Droplets,
  fertilizing: Sprout,
  weeding: Sprout,
  pesticide: Bug,
  general: Bell,
  'ai-recommendation': Bell, // AI notifications use Bell icon
}

function NotificationItem({ notification, onMarkAsRead, onDelete }) {
  const Icon = NOTIFICATION_ICONS[notification.type] || Bell
  
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg ${
        notification.read ? 'bg-muted' : 'bg-primary/10 border-l-4 border-primary'
      }`}
    >
      <div className="flex-shrink-0">
        <div className="p-2 rounded-full bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{notification.title}</h3>
          <span className="text-xs text-muted-foreground">
            {notification.createdAt || notification.created_at ? 
              new Date(notification.createdAt || notification.created_at).toLocaleString('id-ID') : 
              'Tanggal tidak tersedia'
            }
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {notification.message}
        </p>
      </div>
      <div className="flex gap-2">
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMarkAsRead(notification.id)}
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(notification.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function Notifications() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useData()

  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  const handleMarkAsRead = async (id) => {
    console.log(' Mark as read clicked for notification ID:', id)
    try {
      console.log(' Calling markNotificationAsRead...')
      await markNotificationAsRead(id)
      console.log(' Mark as read successful')
    } catch (error) {
      console.error(' Error marking notification as read:', error)
      alert('Gagal menandai notifikasi: ' + error.message)
    }
  }

  const handleMarkAllAsRead = async () => {
    console.log('DEBUG: handleMarkAllAsRead called')
    console.log('DEBUG: unreadNotifications count:', unreadNotifications.length)
    
    try {
      console.log('DEBUG: Calling markAllNotificationsAsRead...')
      const result = await markAllNotificationsAsRead()
      console.log('DEBUG: markAllNotificationsAsRead result:', result)
    } catch (error) {
      console.error('DEBUG: Error in handleMarkAllAsRead:', error)
      alert('Gagal menandai semua notifikasi: ' + error.message)
    }
  }

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus notifikasi ini?')) {
      deleteNotification(id)
    }
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight brand-title">Notifikasi</h2>
          <p className="text-muted-foreground">
            {unreadNotifications.length} notifikasi belum dibaca
          </p>
        </div>
        {unreadNotifications.length > 0 && (
          <Button onClick={handleMarkAllAsRead} className="brand-btn">
            <Check className="h-4 w-4 mr-2" />
            Tandai Semua Sudah Dibaca
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Notifikasi</p>
                <p className="text-3xl font-bold mt-2">{notifications.length}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-green-700" />
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
                <Bell className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Belum ada notifikasi. Notifikasi akan muncul untuk pengingat panen dan aktivitas lainnya.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {unreadNotifications.length > 0 && (
            <Card>
              <CardHeader className="brand-header-gradient">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-500" />
                  Notifikasi Belum Dibaca ({unreadNotifications.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {unreadNotifications.map(notification => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {readNotifications.length > 0 && (
            <Card>
              <CardHeader className="brand-header-gradient">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Notifikasi Terbaca ({readNotifications.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {readNotifications.map(notification => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}