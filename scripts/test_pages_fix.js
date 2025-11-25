// Test untuk Maintenance dan Finances pages
console.log('=== PAGES FIX TEST ===\n')

// Test data yang mungkin problematic
const problematicData = {
  maintenance: [
    { id: 1, type: 'watering', date: null, plantName: 'Test Plant 1', description: 'Test null date' },
    { id: 2, type: 'fertilizing', date: undefined, plantName: 'Test Plant 1', description: 'Test undefined date' },
    { id: 3, type: 'pesticide', date: '', plantName: 'Test Plant 2', description: 'Test empty date' },
    { id: 4, type: 'weeding', date: 'invalid-date', plantName: null, description: 'Test invalid date and null plant' },
    { id: 5, type: 'watering', date: '2025-11-23', plantName: 'Test Plant 3', description: 'Test valid data' },
  ],
  finances: [
    { id: 1, type: 'income', date: null, amount: 1000, description: 'Test null date' },
    { id: 2, type: 'expense', date: undefined, amount: 500, description: 'Test undefined date' },
    { id: 3, type: 'income', date: '', amount: 2000, description: 'Test empty date' },
    { id: 4, type: 'expense', date: 'invalid-date', amount: 300, description: 'Test invalid date' },
    { id: 5, type: 'income', date: '2025-11-23', amount: 1500, description: 'Test valid data' },
  ]
}

// Test maintenance grouping
console.log('=== MAINTENANCE GROUPING TEST ===')
try {
  const maintenanceByPlant = problematicData.maintenance.reduce((acc, item) => {
    if (!item.plantName) return acc
    if (!acc[item.plantName]) {
      acc[item.plantName] = []
    }
    acc[item.plantName].push(item)
    return acc
  }, {})
  
  console.log('Maintenance grouped by plant:', Object.keys(maintenanceByPlant))
  Object.entries(maintenanceByPlant).forEach(([plantName, items]) => {
    console.log(`  ${plantName}: ${items.length} items`)
  })
  console.log('✅ Maintenance grouping works')
} catch (error) {
  console.log('❌ Maintenance grouping error:', error.message)
}

// Test finances grouping
console.log('\n=== FINANCES GROUPING TEST ===')
try {
  const financesByMonth = problematicData.finances.reduce((acc, finance) => {
    if (!finance.date) return acc
    const month = new Date(finance.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(finance)
    return acc
  }, {})
  
  console.log('Finances grouped by month:', Object.keys(financesByMonth))
  Object.entries(financesByMonth).forEach(([month, finances]) => {
    console.log(`  ${month}: ${finances.length} items`)
  })
  console.log('✅ Finances grouping works')
} catch (error) {
  console.log('❌ Finances grouping error:', error.message)
}

// Test formatDate function
console.log('\n=== FORMATDATE TEST ===')
function formatDate(date) {
  if (!date) return 'Tanggal tidak tersedia'
  
  let dateObj
  try {
    dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
    
    if (isNaN(dateObj.getTime())) {
      return 'Tanggal tidak valid'
    }
  } catch (error) {
    return 'Tanggal error'
  }
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj)
}

problematicData.maintenance.forEach((item, i) => {
  console.log(`Maintenance ${i + 1}: ${formatDate(item.date)}`)
})

problematicData.finances.forEach((item, i) => {
  console.log(`Finance ${i + 1}: ${formatDate(item.date)}`)
})

console.log('\n=== EXPECTED RESULTS ===')
console.log('✅ Maintenance page should not crash')
console.log('✅ Finances page should not crash')
console.log('✅ Invalid dates handled gracefully')
console.log('✅ Grouping works with missing data')

console.log('\n=== NEXT STEPS ===')
console.log('1. Refresh browser (Ctrl+F5)')
console.log('2. Check Maintenance page')
console.log('3. Check Finances page')
console.log('4. Both should load without white screen')
