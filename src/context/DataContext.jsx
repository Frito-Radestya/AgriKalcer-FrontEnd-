import { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { addDays } from '@/lib/utils'
import { generateRemindersForPlant } from '@/lib/reminderSystem'

const DataContext = createContext(null)

// Data tanaman dengan estimasi hari panen
export const PLANT_TYPES = [
  { id: 'padi', name: 'Padi', harvestDays: 120, icon: '🌾' },
  { id: 'jagung', name: 'Jagung', harvestDays: 90, icon: '🌽' },
  { id: 'cabai', name: 'Cabai', harvestDays: 75, icon: '🌶️' },
  { id: 'tomat', name: 'Tomat', harvestDays: 70, icon: '🍅' },
  { id: 'bawang', name: 'Bawang Merah', harvestDays: 60, icon: '🧅' },
  { id: 'kacang', name: 'Kacang Tanah', harvestDays: 100, icon: '🥜' },
  { id: 'singkong', name: 'Singkong', harvestDays: 240, icon: '🥔' },
  { id: 'kangkung', name: 'Kangkung', harvestDays: 30, icon: '🥬' },
]

export function DataProvider({ children }) {
  const [plants, setPlants] = useState([])
  const [maintenance, setMaintenance] = useState([])
  const [harvests, setHarvests] = useState([])
  const [finances, setFinances] = useState([])
  const [lands, setLands] = useState([])
  const [notifications, setNotifications] = useState([])

  // Load data from storage
  useEffect(() => {
    setPlants(storage.get('PLANTS') || [])
    setMaintenance(storage.get('MAINTENANCE') || [])
    setHarvests(storage.get('HARVESTS') || [])
    setFinances(storage.get('FINANCES') || [])
    setLands(storage.get('LANDS') || [])
    setNotifications(storage.get('NOTIFICATIONS') || [])
  }, [])

  // Plants CRUD
  const addPlant = (plant) => {
    const plantType = PLANT_TYPES.find(p => p.id === plant.plantType)
    const estimatedHarvestDate = addDays(plant.plantDate, plantType.harvestDays)
    
    const newPlant = {
      ...plant,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      estimatedHarvestDate: estimatedHarvestDate.toISOString(),
      status: 'active',
    }
    
    const updated = [...plants, newPlant]
    setPlants(updated)
    storage.set('PLANTS', updated)
    
    // Create notification for harvest
    addNotification({
      type: 'harvest',
      title: 'Prediksi Panen',
      message: `Tanaman ${plantType.name} di lahan ${plant.landName} diperkirakan panen pada ${new Date(estimatedHarvestDate).toLocaleDateString('id-ID')}`,
      date: estimatedHarvestDate.toISOString(),
      plantId: newPlant.id,
      dueDate: estimatedHarvestDate.toISOString(),
    })
    
    // Generate automatic reminders for maintenance
    const reminders = generateRemindersForPlant(newPlant, plantType)
    reminders.forEach(reminder => {
      addNotification(reminder)
    })
    
    return newPlant
  }

  const updatePlant = (id, updates) => {
    const updated = plants.map(p => p.id === id ? { ...p, ...updates } : p)
    setPlants(updated)
    storage.set('PLANTS', updated)
  }

  const deletePlant = (id) => {
    const updated = plants.filter(p => p.id !== id)
    setPlants(updated)
    storage.set('PLANTS', updated)
  }

  // Maintenance CRUD
  const addMaintenance = (maintenanceData) => {
    const newMaintenance = {
      ...maintenanceData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
    
    const updated = [...maintenance, newMaintenance]
    setMaintenance(updated)
    storage.set('MAINTENANCE', updated)
    
    // Add to finances if there's a cost
    if (maintenanceData.cost > 0) {
      addFinance({
        type: 'expense',
        category: maintenanceData.type,
        amount: maintenanceData.cost,
        description: maintenanceData.notes,
        date: maintenanceData.date,
        plantId: maintenanceData.plantId,
      })
    }
    
    return newMaintenance
  }

  const updateMaintenance = (id, updates) => {
    const updated = maintenance.map(m => m.id === id ? { ...m, ...updates } : m)
    setMaintenance(updated)
    storage.set('MAINTENANCE', updated)
  }

  const deleteMaintenance = (id) => {
    const updated = maintenance.filter(m => m.id !== id)
    setMaintenance(updated)
    storage.set('MAINTENANCE', updated)
  }

  // Harvests CRUD
  const addHarvest = (harvestData) => {
    const newHarvest = {
      ...harvestData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      revenue: harvestData.amount * harvestData.pricePerKg,
    }
    
    const updated = [...harvests, newHarvest]
    setHarvests(updated)
    storage.set('HARVESTS', updated)
    
    // Update plant status
    updatePlant(harvestData.plantId, { status: 'harvested' })
    
    // Add to finances
    addFinance({
      type: 'income',
      category: 'harvest',
      amount: newHarvest.revenue,
      description: `Panen ${harvestData.plantName}`,
      date: harvestData.date,
      plantId: harvestData.plantId,
    })
    
    return newHarvest
  }

  const updateHarvest = (id, updates) => {
    const updated = harvests.map(h => h.id === id ? { ...h, ...updates } : h)
    setHarvests(updated)
    storage.set('HARVESTS', updated)
  }

  const deleteHarvest = (id) => {
    const updated = harvests.filter(h => h.id !== id)
    setHarvests(updated)
    storage.set('HARVESTS', updated)
  }

  // Finances CRUD
  const addFinance = (financeData) => {
    const newFinance = {
      ...financeData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
    
    const updated = [...finances, newFinance]
    setFinances(updated)
    storage.set('FINANCES', updated)
    return newFinance
  }

  const updateFinance = (id, updates) => {
    const updated = finances.map(f => f.id === id ? { ...f, ...updates } : f)
    setFinances(updated)
    storage.set('FINANCES', updated)
  }

  const deleteFinance = (id) => {
    const updated = finances.filter(f => f.id !== id)
    setFinances(updated)
    storage.set('FINANCES', updated)
  }

  // Lands CRUD
  const addLand = (landData) => {
    const newLand = {
      ...landData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
    
    const updated = [...lands, newLand]
    setLands(updated)
    storage.set('LANDS', updated)
    return newLand
  }

  const updateLand = (id, updates) => {
    const updated = lands.map(l => l.id === id ? { ...l, ...updates } : l)
    setLands(updated)
    storage.set('LANDS', updated)
  }

  const deleteLand = (id) => {
    const updated = lands.filter(l => l.id !== id)
    setLands(updated)
    storage.set('LANDS', updated)
  }

  // Notifications
  const addNotification = (notificationData) => {
    const newNotification = {
      ...notificationData,
      id: Date.now(),
      read: false,
      createdAt: new Date().toISOString(),
    }
    
    const updated = [...notifications, newNotification]
    setNotifications(updated)
    storage.set('NOTIFICATIONS', updated)
    return newNotification
  }

  const markNotificationAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n)
    setNotifications(updated)
    storage.set('NOTIFICATIONS', updated)
  }

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    storage.set('NOTIFICATIONS', updated)
  }

  const value = {
    plants,
    addPlant,
    updatePlant,
    deletePlant,
    maintenance,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    harvests,
    addHarvest,
    updateHarvest,
    deleteHarvest,
    finances,
    addFinance,
    updateFinance,
    deleteFinance,
    lands,
    addLand,
    updateLand,
    deleteLand,
    notifications,
    addNotification,
    markNotificationAsRead,
    deleteNotification,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}
