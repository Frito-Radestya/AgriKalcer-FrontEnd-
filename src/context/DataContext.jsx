import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { storage } from '@/lib/storage'
import { addDays } from '@/lib/utils'
import { DataContext } from './dataContext'
import { PLANT_TYPES } from './plantTypes'

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [plants, setPlants] = useState([])
  const [maintenance, setMaintenance] = useState([])
  const [harvests, setHarvests] = useState([])
  const [finances, setFinances] = useState([])
  const [lands, setLands] = useState([])
  const [notifications, setNotifications] = useState([])
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4001'

  // Helper function to refresh notifications
  const refreshNotifications = async () => {
    const token = storage.get('TOKEN')
    if (!token) return
    
    try {
      const notificationsRes = await fetch(`${API_BASE}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (notificationsRes.ok) {
        const response = await notificationsRes.json()
        const data = Array.isArray(response) ? response : (response.data || [])
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error refreshing notifications:', error)
    }
  }

  // Load data from API only
  // Reload when USER changes (login/logout)
  useEffect(() => {
    const userId = user?.id || null
    const token = storage.get('TOKEN')

    // Only load data if user is authenticated
    if (token && userId) {
      // Fetch all data from API
      const loadFromAPI = async () => {
        try {
          // Fetch maintenance, harvests, finances, notifications, plants
          const [maintenanceRes, harvestsRes, financesRes, notificationsRes, plantsRes] = await Promise.all([
            fetch(`${API_BASE}/api/maintenance`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE}/api/harvests`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE}/api/finances`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE}/api/notifications`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE}/api/plants`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ])

          // Check harvests response
          console.log('DEBUG - Harvests response status:', harvestsRes.status)
          if (!harvestsRes.ok) {
            const errorText = await harvestsRes.text()
            console.error('DEBUG - Harvests error:', errorText)
          }

          // Handle maintenance
          if (maintenanceRes.ok) {
            const response = await maintenanceRes.json()
            const data = Array.isArray(response) ? response : (response.data || [])
            setMaintenance(data)
          } else {
            setMaintenance([])
          }

          // Handle harvests
          if (harvestsRes.ok) {
            const response = await harvestsRes.json()
            const data = Array.isArray(response) ? response : (response.data || [])
            console.log('DEBUG - Harvests data received:', data)
            setHarvests(data)
          } else {
            console.error('DEBUG - Harvests failed with status:', harvestsRes.status)
            setHarvests([])
          }

          // Handle finances
          if (financesRes.ok) {
            const response = await financesRes.json()
            const data = Array.isArray(response) ? response : (response.data || [])
            setFinances(data)
          } else {
            setFinances([])
          }

          // Handle notifications
          if (notificationsRes.ok) {
            const response = await notificationsRes.json()
            const data = Array.isArray(response) ? response : (response.data || [])
            setNotifications(data)
          } else {
            setNotifications([])
          }

          // Handle plants
          if (plantsRes.ok) {
            const response = await plantsRes.json()
            const data = Array.isArray(response) ? response : (response.data || [])
            const mapped = data.map(p => {
              const typeById = PLANT_TYPES.find(pt => pt.id === p.plant_type?.id)
              const typeByName = p.plant_type?.name ? PLANT_TYPES.find(t => t.name.toLowerCase() === p.plant_type.name.toLowerCase()) : null
              const resolvedType = typeById || typeByName || null
              // Parse notes untuk seedType/seedAmount
              let seedType = ''
              let seedAmount = ''
              if (p.notes) {
                const parts = p.notes.split(' ').filter(Boolean)
                if (parts.length >= 2) {
                  seedAmount = parts[0]
                  seedType = parts.slice(1).join(' ')
                } else if (parts.length === 1) {
                  if (/^\d/.test(parts[0])) {
                    seedAmount = parts[0]
                  } else {
                    seedType = parts[0]
                  }
                }
              }
              return {
                id: p.id,
                plantType: resolvedType?.id || '',
                plantName: p.name,
                plantDate: p.planting_date ? String(p.planting_date).slice(0,10) : '',
                landArea: p.land?.area_size ?? '',
                landName: p.land?.name ?? '',
                seedType,
                seedAmount,
                status: p.status || 'active',
                estimatedHarvestDate: p.estimated_harvest_date 
                  ? String(p.estimated_harvest_date).slice(0,10) 
                  : (() => {
                    if (!resolvedType?.harvestDays) return ''
                    const plantDate = new Date(p.planting_date)
                    const harvestDate = new Date(plantDate)
                    harvestDate.setDate(harvestDate.getDate() + resolvedType.harvestDays)
                    return harvestDate.toISOString().slice(0,10)
                  })(),
                createdAt: p.created_at,
              }
            })
            setPlants(mapped)
          } else {
            setPlants([])
          }
        } catch (error) {
          console.error('Error loading data from API:', error)
          // Set empty arrays if API fails
          setMaintenance([])
          setHarvests([])
          setFinances([])
          setNotifications([])
          setPlants([])
        }
      }

      loadFromAPI()
      
      // Fetch lands from API
      fetch(`${API_BASE}/api/lands`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Gagal mengambil data lahan')
          return res.json()
        })
        .then((response) => {
          const data = Array.isArray(response) ? response : (response.data || [])
          const mapped = data.map((l) => ({
            id: l.id,
            landName: l.name,
            landArea: l.area_size ?? '',
            location: l.location ?? '',
            createdAt: l.created_at,
          }))
          setLands(mapped)
        })
        .catch(() => {
          setLands([])
        })

      } else {
      // Not authenticated - set empty arrays
      setMaintenance([])
      setHarvests([])
      setFinances([])
      setNotifications([])
      setLands([])
      setPlants([])
    }

    // Listen for storage changes to reload data when user logs in/out
    const handleStorageChange = () => {
      const newUser = storage.get('USER')
      const newUserId = newUser?.id || null
      const changeToken = storage.get('TOKEN')
      
      // If user changed and we have a token, reload all data from API
      if (changeToken && newUserId) {
        loadFromAPI()
      } else {
        // Not authenticated - set empty arrays
        setMaintenance([])
        setHarvests([])
        setFinances([])
        setNotifications([])
        setLands([])
        setPlants([])
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically for user changes (for same-tab login/logout)
    const intervalId = setInterval(() => {
      const currentUser = storage.get('USER')
      const currentUserId = currentUser?.id || null
      // Skip userId comparison since userId is not in scope
    }, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(intervalId)
    }
  }, [user, API_BASE])

  // Plants CRUD
  const addPlant = async (plant) => {
    const token = storage.get('TOKEN')

    if (!token) {
      throw new Error('Authentication required')
    }

    // Find or create land by name
    let landIdFromName = null
    if (plant.landId) {
      landIdFromName = plant.landId
    } else if (plant.newLandName && plant.newLandArea) {
      // Create new land
      const newLand = await addLand({ landName: plant.newLandName, landArea: plant.newLandArea, location: '', latitude: plant.newLat, longitude: plant.newLng })
      landIdFromName = newLand.id
    }

    // Find plant_type_id by name (PLANT_TYPES name -> plant_types.name)
    const plantTypeFromFrontend = PLANT_TYPES.find(p => p.id === plant.plantType)
    let plantTypeIdFromName = null
    if (plantTypeFromFrontend) {
      try {
        const resTypes = await fetch(`${API_BASE}/api/plant-types?name=${encodeURIComponent(plantTypeFromFrontend.name)}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (resTypes.ok) {
          const types = await resTypes.json()
          if (Array.isArray(types) && types.length) {
            plantTypeIdFromName = types[0].id
          }
        }
      } catch (_) {
        const resAll = await fetch(`${API_BASE}/api/plant-types`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (resAll.ok) {
          const all = await resAll.json()
          const found = Array.isArray(all) ? all.find(t => t.name === plantTypeFromFrontend.name) : null
          if (found) plantTypeIdFromName = found.id
        }
      }
    }

    const res = await fetch(`${API_BASE}/api/plants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: plant.plantName,
        planting_date: plant.plantDate,
        status: plant.status || 'active',
        notes: [plant.seedAmount, plant.seedType].filter(Boolean).join(' '),
        land_id: landIdFromName || plant.landId,
        plant_type_id: plantTypeIdFromName,
      }),
    })
    
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Gagal menambah tanaman')
    }
    
    const created = await res.json()
    
    const typeById = PLANT_TYPES.find(p => p.id === plant.plantType)
    const typeByName = created.plant_type?.name ? PLANT_TYPES.find(t => t.name.toLowerCase() === created.plant_type.name.toLowerCase()) : null
    const resolvedType = typeById || typeByName || null
    const plantTypeId = resolvedType ? resolvedType.id : ''
    const plantDate = created.planting_date ? String(created.planting_date).slice(0,10) : plant.plantDate
    
    // Use estimated_harvest_date from backend if available, otherwise calculate locally
    const estimatedHarvestDate = created.estimated_harvest_date 
      ? new Date(created.estimated_harvest_date)
      : addDays(plantDate, resolvedType?.harvestDays ?? 60)
    
    const mapped = {
      id: created.id,
      plantType: plantTypeId,
      plantName: created.name,
      plantDate,
      landArea: created.land?.area_size ?? '',
      landName: created.land?.name ?? '',
      seedType: plant.seedType || '',
      seedAmount: plant.seedAmount || '',
      status: created.status || 'active',
      estimatedHarvestDate,
      notes: created.notes || '',
    }
    
    const updated = [mapped, ...plants]
    setPlants(updated)

    // Refresh notifications after adding plant to get new plant notifications
    await refreshNotifications()

    return mapped
  }

  const updatePlant = async (id, updates) => {
    const token = storage.get('TOKEN')

    if (!token) {
      throw new Error('Authentication required')
    }
    const body = {
      name: updates.plantName,
      planting_date: updates.plantDate,
      status: updates.status,
      notes: [updates.seedAmount, updates.seedType].filter(Boolean).join(' '),
      land_id: null,
      plant_type_id: null,
    }
    const res = await fetch(`${API_BASE}/api/plants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('Gagal memperbarui tanaman')
    const updatedServer = await res.json()
    const typeByName = updatedServer.plant_type ? PLANT_TYPES.find(t => t.name.toLowerCase() === updatedServer.plant_type.name.toLowerCase()) : null
    const plantType = typeByName ? typeByName.id : updates.plantType || ''
    const plantDate = updatedServer.planting_date ? String(updatedServer.planting_date).slice(0,10) : updates.plantDate
    
    // Use estimated_harvest_date from backend if available, otherwise calculate locally
    const estimatedHarvestDate = updatedServer.estimated_harvest_date 
      ? new Date(updatedServer.estimated_harvest_date)
      : addDays(plantDate, typeByName?.harvestDays ?? 60)
    
    const mapped = {
      id: updatedServer.id,
      plantType,
      plantName: updatedServer.name,
      plantDate,
      landArea: updatedServer.land?.area_size ?? '',
      landName: updatedServer.land?.name ?? '',
      seedType: updates.seedType || '',
      seedAmount: updates.seedAmount || '',
      status: updatedServer.status || 'active',
      estimatedHarvestDate,
    }
    const updatedArr = plants.map(p => p.id === id ? mapped : p)
    setPlants(updatedArr)
    
    // Refresh notifications after updating plant (might trigger new reminders)
    await refreshNotifications()
  }

  const deletePlant = async (id) => {
    const token = storage.get('TOKEN')

    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      const res = await fetch(`${API_BASE}/api/plants/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Gagal menghapus tanaman')
      const updated = plants.filter(p => p.id !== id)
      setPlants(updated)
      
      // Refresh notifications after deleting plant (removes related notifications)
      await refreshNotifications()
    } catch (e) {
      console.error('Error deleting plant:', e)
      throw e
    }
  }

  // Maintenance CRUD
  const addMaintenance = async (maintenanceData) => {
    const token = storage.get('TOKEN')
    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      const res = await fetch(`${API_BASE}/api/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          plantId: maintenanceData.plantId,
          type: maintenanceData.type,
          date: maintenanceData.date,
          notes: maintenanceData.notes,
          cost: maintenanceData.cost || 0,
        }),
      })
      if (!res.ok) throw new Error('Gagal menambah perawatan')
      const created = await res.json()
      
      // Add to maintenance list
      const updated = [created, ...maintenance]
      setMaintenance(updated)
      
      // Refresh notifications after adding maintenance to get new maintenance notifications
      await refreshNotifications()
      
      // Add to finances if there's a cost
      if (maintenanceData.cost > 0) {
        await addFinance({
          type: 'expense',
          category: maintenanceData.type,
          amount: maintenanceData.cost,
          description: maintenanceData.notes,
          date: maintenanceData.date,
          plantId: maintenanceData.plantId,
        })
      }
      
      return created
    } catch (e) {
      console.error('Error adding maintenance:', e)
      throw e
    }
  }

  const updateMaintenance = async (id, updates) => {
    const token = storage.get('TOKEN')
    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      const res = await fetch(`${API_BASE}/api/maintenance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          plantId: updates.plantId,
          type: updates.type,
          date: updates.date,
          notes: updates.notes,
          cost: updates.cost,
        }),
      })
      if (!res.ok) throw new Error('Gagal memperbarui perawatan')
      const updatedServer = await res.json()
      
      const updatedArr = maintenance.map(m => m.id === id ? updatedServer : m)
      setMaintenance(updatedArr)
      
      return updatedServer
    } catch (e) {
      console.error('Error updating maintenance:', e)
      throw e
    }
  }

  const deleteMaintenance = async (id) => {
    const token = storage.get('TOKEN')
    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      await fetch(`${API_BASE}/api/maintenance/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const updated = maintenance.filter(m => m.id !== id)
      setMaintenance(updated)
    } catch (e) {
      console.error('Error deleting maintenance:', e)
      throw e
    }
  }

  // Harvests CRUD
  const addHarvest = async (harvestData) => {
    const token = storage.get('TOKEN')
    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      const res = await fetch(`${API_BASE}/api/harvests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          plantId: harvestData.plantId,
          date: harvestData.date,
          amount: harvestData.amount,
          pricePerKg: harvestData.pricePerKg,
          quality: harvestData.quality,
          notes: harvestData.notes,
        }),
      })
      if (!res.ok) throw new Error('Gagal menambah panen')
      const created = await res.json()
      
      const updated = [created, ...harvests]
      setHarvests(updated)
      
      // Update plant status to 'harvested'
      await updatePlant(harvestData.plantId, { status: 'harvested' })
      
      // Refresh all data to ensure UI is updated
      const plantsRes = await fetch(`${API_BASE}/api/plants`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (plantsRes.ok) {
        const plantsResponse = await plantsRes.json()
        const plantsData = Array.isArray(plantsResponse) ? plantsResponse : (plantsResponse.data || [])
        console.log('DEBUG - Refreshed plants data:', plantsData)
        setPlants(plantsData)
      }
      
      // Also refresh harvests to get latest data with plant info
      const harvestsRes = await fetch(`${API_BASE}/api/harvests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (harvestsRes.ok) {
        const harvestsResponse = await harvestsRes.json()
        const harvestsData = Array.isArray(harvestsResponse) ? harvestsResponse : (harvestsResponse.data || [])
        console.log('DEBUG - Refreshed harvests data:', harvestsData)
        setHarvests(harvestsData)
      }
      
      // Refresh notifications after adding harvest to get new harvest notifications
      await refreshNotifications()
      
      // Add to finances
      await addFinance({
        type: 'income',
        category: 'harvest',
        amount: created.revenue,
        description: `Panen ${harvestData.plantName || 'Tanaman'}`,
        date: harvestData.date,
        plantId: harvestData.plantId,
      })
      
      return created
    } catch (e) {
      console.error('Error adding harvest:', e)
      throw e
    }
  }

  const updateHarvest = async (id, updates) => {
    const token = storage.get('TOKEN')
    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      const res = await fetch(`${API_BASE}/api/harvests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          plantId: updates.plantId,
          date: updates.date,
          amount: updates.amount,
          pricePerKg: updates.pricePerKg,
          quality: updates.quality,
          notes: updates.notes,
        }),
      })
      if (!res.ok) throw new Error('Gagal memperbarui panen')
      const updatedServer = await res.json()
      
      const updatedArr = harvests.map(h => h.id === id ? updatedServer : h)
      setHarvests(updatedArr)
    } catch (e) {
      console.error('Error updating harvest:', e)
      throw e
    }
  }

  const deleteHarvest = async (id) => {
    const token = storage.get('TOKEN')
    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      await fetch(`${API_BASE}/api/harvests/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const updated = harvests.filter(h => h.id !== id)
      setHarvests(updated)
    } catch (e) {
      console.error('Error deleting harvest:', e)
      throw e
    }
  }

  // Finances CRUD
  const addFinance = async (financeData) => {
    const token = storage.get('TOKEN')
    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      const res = await fetch(`${API_BASE}/api/finances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          type: financeData.type,
          category: financeData.category,
          amount: financeData.amount,
          description: financeData.description,
          date: financeData.date,
          plantId: financeData.plantId,
        }),
      })
      if (!res.ok) throw new Error('Gagal menambah keuangan')
      const created = await res.json()
      
      const updated = [created, ...finances]
      setFinances(updated)
      
      // Refresh notifications after adding finance (might trigger financial alerts)
      await refreshNotifications()
      return created
    } catch (e) {
      console.error('Error adding finance:', e)
      // Still update local state even if API fails
      const currentUser = storage.get('USER')
      const userId = currentUser?.id || null
      const newFinance = {
        ...financeData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      }
      const updated = [...finances, newFinance]
      setFinances(updated)
      return newFinance
    }
  }

  const updateFinance = async (id, updates) => {
    const token = storage.get('TOKEN')
    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      const res = await fetch(`${API_BASE}/api/finances/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          type: updates.type,
          category: updates.category,
          amount: updates.amount,
          description: updates.description,
          date: updates.date,
          plantId: updates.plantId,
        }),
      })
      if (!res.ok) throw new Error('Gagal memperbarui keuangan')
      const updatedServer = await res.json()
      
      const updatedArr = finances.map(f => f.id === id ? updatedServer : f)
      setFinances(updatedArr)
    } catch (e) {
      console.error('Error updating finance:', e)
      throw e
    }
  }

  const deleteFinance = async (id) => {
    const token = storage.get('TOKEN')
    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      await fetch(`${API_BASE}/api/finances/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const updated = finances.filter(f => f.id !== id)
      setFinances(updated)
    } catch (e) {
      console.error('Error deleting finance:', e)
      throw e
    }
  }

  // Lands CRUD
  const addLand = async (landData) => {
    const token = storage.get('TOKEN')

    if (!token) {
      throw new Error('Authentication required')
    }
    const res = await fetch(`${API_BASE}/api/lands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: landData.landName || landData.name, location: landData.location, area_size: landData.landArea, latitude: landData.latitude, longitude: landData.longitude }),
    })
    if (!res.ok) throw new Error('Gagal menambah lahan')
    const created = await res.json()
    const mapped = { id: created.id, landName: created.name, landArea: created.area_size ?? '', location: created.location ?? '', createdAt: created.created_at }
    const updated = [mapped, ...lands]
    setLands(updated)
    return mapped
  }

  const updateLand = async (id, updates) => {
    const token = storage.get('TOKEN')

    if (!token) {
      throw new Error('Authentication required')
    }
    const res = await fetch(`${API_BASE}/api/lands/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: updates.landName, location: updates.location, area_size: updates.landArea }),
    })
    if (!res.ok) throw new Error('Gagal memperbarui lahan')
    const updatedLand = await res.json()
    const mapped = { id: updatedLand.id, landName: updatedLand.name, landArea: updatedLand.area_size ?? '', location: updatedLand.location ?? '', createdAt: updatedLand.created_at }
    const updatedArr = lands.map(l => l.id === id ? mapped : l)
    setLands(updatedArr)
  }

  const deleteLand = async (id) => {
    const token = storage.get('TOKEN')

    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      const res = await fetch(`${API_BASE}/api/lands/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Gagal menghapus lahan')
      const updated = lands.filter(l => l.id !== id)
      setLands(updated)
    } catch (e) {
      console.error('Error deleting land:', e)
      throw e
    }
  }

  // Notifications
  const addNotification = async (notificationData) => {
    const token = storage.get('TOKEN')
    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      const res = await fetch(`${API_BASE}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type,
          plantId: notificationData.plantId,
        }),
      })
      if (!res.ok) throw new Error('Gagal menambah notifikasi')
      const created = await res.json()
      
      const updated = [created, ...notifications]
      setNotifications(updated)
      return created
    } catch (e) {
      console.error('Error adding notification:', e)
      throw e
    }
  }

  const markNotificationAsRead = async (id) => {
    const token = storage.get('TOKEN')
    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      const res = await fetch(`${API_BASE}/api/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ read: true }),
      })
      if (!res.ok) throw new Error('Gagal memperbarui notifikasi')
      const updatedServer = await res.json()
      
      // Merge with existing notification to preserve createdAt if missing
      const existingNotification = notifications.find(n => n.id === id)
      const mergedNotification = {
        ...existingNotification,
        ...updatedServer,
        createdAt: updatedServer.createdAt || existingNotification?.createdAt || updatedServer.created_at
      }
      
      const updatedArr = notifications.map(n => n.id === id ? mergedNotification : n)
      setNotifications(updatedArr)
    } catch (e) {
      console.error('Error updating notification:', e)
      throw e
    }
  }

  const markAllNotificationsAsRead = async () => {
    const token = storage.get('TOKEN')
    console.log('DEBUG: markAllNotificationsAsRead called, token exists:', !!token)
    
    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      console.log('DEBUG: Using individual updates workaround...')
      
      // Get current notifications
      const unreadNotifications = notifications.filter(n => !n.read)
      console.log('DEBUG: Unread notifications to update:', unreadNotifications.length)
      
      if (unreadNotifications.length === 0) {
        console.log('DEBUG: No unread notifications to update')
        return { updated: 0 }
      }
      
      // Update each notification individually using existing working endpoint
      const updatePromises = unreadNotifications.map(async (notification) => {
        console.log('DEBUG: Updating notification ID:', notification.id)
        
        const res = await fetch(`${API_BASE}/api/notifications/${notification.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ read: true }),
        })
        
        if (!res.ok) {
          const errorText = await res.text()
          console.error('DEBUG: Failed to update notification:', notification.id, errorText)
          throw new Error(`Failed to update notification ${notification.id}: ${errorText}`)
        }
        
        const result = await res.json()
        console.log('DEBUG: Successfully updated notification:', notification.id)
        return result
      })
      
      const results = await Promise.all(updatePromises)
      console.log('DEBUG: All individual updates completed, results:', results.length)
      
      // Update local state while preserving createdAt
      setNotifications(prev => {
        console.log('DEBUG: Updating local state, prev count:', prev.length)
        const updated = prev.map(n => ({ ...n, read: true, is_read: true }))
        console.log('DEBUG: Updated notifications count:', updated.length)
        return updated
      })
      
      return { updated: results.length, notifications: results }
    } catch (e) {
      console.error('DEBUG: Error in markAllNotificationsAsRead:', e)
      throw e
    }
  }

  const deleteNotification = async (id) => {
    const token = storage.get('TOKEN')
    if (!token) {
      throw new Error('Authentication required')
    }

    try {
      await fetch(`${API_BASE}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const updated = notifications.filter(n => n.id !== id)
      setNotifications(updated)
    } catch (e) {
      console.error('Error deleting notification:', e)
      throw e
    }
  }

  // Ensure all values are arrays (safety check)
  const value = {
    plants: Array.isArray(plants) ? plants : [],
    addPlant,
    updatePlant,
    deletePlant,
    maintenance: Array.isArray(maintenance) ? maintenance : [],
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    harvests: Array.isArray(harvests) ? harvests : [],
    addHarvest,
    updateHarvest,
    deleteHarvest,
    finances: Array.isArray(finances) ? finances : [],
    addFinance,
    updateFinance,
    deleteFinance,
    lands: Array.isArray(lands) ? lands : [],
    addLand,
    updateLand,
    deleteLand,
    notifications: Array.isArray(notifications) ? notifications : [],
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
