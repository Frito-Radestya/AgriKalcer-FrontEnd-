import { addDays } from './utils'

// Jadwal perawatan default berdasarkan jenis tanaman
export const MAINTENANCE_SCHEDULE = {
  padi: {
    watering: { interval: 2, description: 'Penyiraman sawah' },
    fertilizing: { days: [7, 21, 35, 49], description: 'Pemupukan' },
    weeding: { days: [14, 28, 42], description: 'Penyiangan gulma' },
    pesticide: { days: [30, 60, 90], description: 'Aplikasi pestisida' },
  },
  jagung: {
    watering: { interval: 3, description: 'Penyiraman' },
    fertilizing: { days: [7, 21, 35], description: 'Pemupukan' },
    weeding: { days: [14, 28], description: 'Penyiangan gulma' },
    pesticide: { days: [25, 50], description: 'Aplikasi pestisida' },
  },
  cabai: {
    watering: { interval: 1, description: 'Penyiraman harian' },
    fertilizing: { days: [7, 14, 21, 28, 35, 42, 49, 56], description: 'Pemupukan' },
    weeding: { days: [10, 20, 30, 40, 50], description: 'Penyiangan gulma' },
    pesticide: { days: [15, 30, 45, 60], description: 'Aplikasi pestisida' },
  },
  tomat: {
    watering: { interval: 1, description: 'Penyiraman' },
    fertilizing: { days: [7, 14, 21, 28, 35, 42], description: 'Pemupukan' },
    weeding: { days: [10, 20, 30, 40], description: 'Penyiangan gulma' },
    pesticide: { days: [20, 40, 60], description: 'Aplikasi pestisida' },
  },
  bawang: {
    watering: { interval: 2, description: 'Penyiraman' },
    fertilizing: { days: [7, 21, 35], description: 'Pemupukan' },
    weeding: { days: [14, 28], description: 'Penyiangan gulma' },
    pesticide: { days: [25, 45], description: 'Aplikasi pestisida' },
  },
  kacang: {
    watering: { interval: 3, description: 'Penyiraman' },
    fertilizing: { days: [10, 30, 50], description: 'Pemupukan' },
    weeding: { days: [15, 35, 55], description: 'Penyiangan gulma' },
    pesticide: { days: [30, 60], description: 'Aplikasi pestisida' },
  },
  singkong: {
    watering: { interval: 7, description: 'Penyiraman' },
    fertilizing: { days: [30, 90, 150], description: 'Pemupukan' },
    weeding: { days: [30, 60, 90, 120, 150, 180], description: 'Penyiangan gulma' },
    pesticide: { days: [60, 120, 180], description: 'Aplikasi pestisida' },
  },
  kangkung: {
    watering: { interval: 1, description: 'Penyiraman harian' },
    fertilizing: { days: [5, 10, 15, 20], description: 'Pemupukan' },
    weeding: { days: [7, 14, 21], description: 'Penyiangan gulma' },
    pesticide: { days: [15], description: 'Aplikasi pestisida' },
  },
}

// Generate reminders untuk tanaman baru
export function generateRemindersForPlant(plant, plantType) {
  const reminders = []
  const schedule = MAINTENANCE_SCHEDULE[plant.plantType] || MAINTENANCE_SCHEDULE.padi
  const plantDate = new Date(plant.plantDate)
  const today = new Date()
  
  // Reminder penyiraman berkala
  if (schedule.watering) {
    const { interval, description } = schedule.watering
    let nextWateringDate = new Date(plantDate)
    
    // Generate reminder penyiraman untuk 30 hari ke depan
    for (let i = 0; i < 30; i += interval) {
      nextWateringDate = addDays(plantDate, i)
      if (nextWateringDate > today) {
        reminders.push({
          type: 'watering',
          title: `Pengingat Penyiraman`,
          message: `${description} untuk ${plant.plantName} di lahan ${plant.landName}`,
          date: nextWateringDate.toISOString(),
          plantId: plant.id,
          plantName: plant.plantName,
          dueDate: nextWateringDate.toISOString(),
        })
      }
    }
  }
  
  // Reminder pemupukan
  if (schedule.fertilizing && schedule.fertilizing.days) {
    schedule.fertilizing.days.forEach(day => {
      const fertDate = addDays(plantDate, day)
      if (fertDate > today) {
        reminders.push({
          type: 'fertilizing',
          title: `Pengingat Pemupukan`,
          message: `${schedule.fertilizing.description} untuk ${plant.plantName} (Hari ke-${day})`,
          date: fertDate.toISOString(),
          plantId: plant.id,
          plantName: plant.plantName,
          dueDate: fertDate.toISOString(),
        })
      }
    })
  }
  
  // Reminder penyiangan
  if (schedule.weeding && schedule.weeding.days) {
    schedule.weeding.days.forEach(day => {
      const weedDate = addDays(plantDate, day)
      if (weedDate > today) {
        reminders.push({
          type: 'weeding',
          title: `Pengingat Penyiangan`,
          message: `${schedule.weeding.description} untuk ${plant.plantName} (Hari ke-${day})`,
          date: weedDate.toISOString(),
          plantId: plant.id,
          plantName: plant.plantName,
          dueDate: weedDate.toISOString(),
        })
      }
    })
  }
  
  // Reminder pestisida
  if (schedule.pesticide && schedule.pesticide.days) {
    schedule.pesticide.days.forEach(day => {
      const pestDate = addDays(plantDate, day)
      if (pestDate > today) {
        reminders.push({
          type: 'pesticide',
          title: `Pengingat Pestisida`,
          message: `${schedule.pesticide.description} untuk ${plant.plantName} (Hari ke-${day})`,
          date: pestDate.toISOString(),
          plantId: plant.id,
          plantName: plant.plantName,
          dueDate: pestDate.toISOString(),
        })
      }
    })
  }
  
  return reminders
}

// Check reminder yang sudah jatuh tempo (hari ini atau sebelumnya)
export function getOverdueReminders(notifications) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return notifications.filter(notif => {
    if (!notif.dueDate || notif.read) return false
    const dueDate = new Date(notif.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate <= today
  })
}

// Check reminder yang akan datang (1-3 hari ke depan)
export function getUpcomingReminders(notifications) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const threeDaysLater = addDays(today, 3)
  
  return notifications.filter(notif => {
    if (!notif.dueDate || notif.read) return false
    const dueDate = new Date(notif.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate > today && dueDate <= threeDaysLater
  })
}

// Calculate productivity (kg/m²)
export function calculateProductivity(harvest, plant) {
  if (!harvest || !plant || !plant.landArea) return 0
  return (harvest.amount / plant.landArea).toFixed(2)
}

// Calculate average productivity for all harvests
export function calculateAverageProductivity(harvests, plants) {
  if (harvests.length === 0) return 0
  
  let totalProductivity = 0
  let count = 0
  
  harvests.forEach(harvest => {
    const plant = plants.find(p => p.id === harvest.plantId)
    if (plant && plant.landArea) {
      totalProductivity += parseFloat(calculateProductivity(harvest, plant))
      count++
    }
  })
  
  return count > 0 ? (totalProductivity / count).toFixed(2) : 0
}

// Get productivity by plant type
export function getProductivityByPlantType(harvests, plants) {
  const productivityMap = {}
  
  harvests.forEach(harvest => {
    const plant = plants.find(p => p.id === harvest.plantId)
    if (plant && plant.landArea) {
      const productivity = parseFloat(calculateProductivity(harvest, plant))
      if (!productivityMap[plant.plantType]) {
        productivityMap[plant.plantType] = {
          total: 0,
          count: 0,
          plantTypeName: plant.plantType
        }
      }
      productivityMap[plant.plantType].total += productivity
      productivityMap[plant.plantType].count++
    }
  })
  
  // Calculate averages
  Object.keys(productivityMap).forEach(type => {
    const data = productivityMap[type]
    productivityMap[type].average = (data.total / data.count).toFixed(2)
  })
  
  return productivityMap
}
