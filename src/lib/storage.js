// LocalStorage helper functions
const STORAGE_KEYS = {
  USER: 'lumbung_tani_user',
  TOKEN: 'lumbung_tani_token',
  PLANTS: 'lumbung_tani_plants',
  MAINTENANCE: 'lumbung_tani_maintenance',
  HARVESTS: 'lumbung_tani_harvests',
  FINANCES: 'lumbung_tani_finances',
  LANDS: 'lumbung_tani_lands',
  NOTIFICATIONS: 'lumbung_tani_notifications',
}

// Get user-specific key
function getUserKey(baseKey, userId) {
  if (!userId) return STORAGE_KEYS[baseKey]
  return `${STORAGE_KEYS[baseKey]}_user_${userId}`
}

export const storage = {
  get(key, userId = null) {
    try {
      const storageKey = getUserKey(key, userId)
      const item = localStorage.getItem(storageKey)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error)
      return null
    }
  },

  set(key, value, userId = null) {
    try {
      const storageKey = getUserKey(key, userId)
      localStorage.setItem(storageKey, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting ${key} to storage:`, error)
    }
  },

  remove(key, userId = null) {
    try {
      const storageKey = getUserKey(key, userId)
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error)
    }
  },

  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
        // Also clear all user-specific keys
        Object.keys(localStorage).forEach(localKey => {
          if (localKey.startsWith(key + '_user_')) {
            localStorage.removeItem(localKey)
          }
        })
      })
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  },

  // Clear user-specific data
  clearUserData(userId) {
    try {
      ['PLANTS', 'MAINTENANCE', 'HARVESTS', 'FINANCES', 'LANDS', 'NOTIFICATIONS'].forEach(key => {
        const storageKey = getUserKey(key, userId)
        localStorage.removeItem(storageKey)
      })
    } catch (error) {
      console.error('Error clearing user data:', error)
    }
  }
}

// Initialize default data (only for users list, not user-specific data)
export function initializeDefaultData() {
  // Default users - stored globally, not per-user
  if (!localStorage.getItem('lumbung_tani_users')) {
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

  // Note: User-specific data (plants, finances, etc.) will be initialized 
  // when user logs in or registers, not here
}
