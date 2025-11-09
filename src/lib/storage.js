// LocalStorage helper functions
const STORAGE_KEYS = {
  USER: 'lumbung_tani_user',
  PLANTS: 'lumbung_tani_plants',
  MAINTENANCE: 'lumbung_tani_maintenance',
  HARVESTS: 'lumbung_tani_harvests',
  FINANCES: 'lumbung_tani_finances',
  LANDS: 'lumbung_tani_lands',
  NOTIFICATIONS: 'lumbung_tani_notifications',
}

export const storage = {
  get(key) {
    try {
      const item = localStorage.getItem(STORAGE_KEYS[key])
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error)
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting ${key} to storage:`, error)
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(STORAGE_KEYS[key])
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error)
    }
  },

  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  }
}

// Initialize default data
export function initializeDefaultData() {
  // Default users
  if (!storage.get('USER')) {
    const defaultUsers = [
      {
        id: 1,
        name: 'Admin Sistem',
        email: 'admin@lumbungtani.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        id: 2,
        name: 'Ketua Kelompok Tani',
        email: 'ketua@lumbungtani.com',
        password: 'ketua123',
        role: 'ketua'
      },
      {
        id: 3,
        name: 'Petani Budi',
        email: 'petani@lumbungtani.com',
        password: 'petani123',
        role: 'petani'
      }
    ]
    localStorage.setItem('lumbung_tani_users', JSON.stringify(defaultUsers))
  }

  // Initialize empty arrays if not exists
  if (!storage.get('PLANTS')) storage.set('PLANTS', [])
  if (!storage.get('MAINTENANCE')) storage.set('MAINTENANCE', [])
  if (!storage.get('HARVESTS')) storage.set('HARVESTS', [])
  if (!storage.get('FINANCES')) storage.set('FINANCES', [])
  if (!storage.get('LANDS')) storage.set('LANDS', [])
  if (!storage.get('NOTIFICATIONS')) storage.set('NOTIFICATIONS', [])
}
