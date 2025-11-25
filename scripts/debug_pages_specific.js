// Debug spesifik untuk Maintenance dan Finances pages
console.log('=== SPECIFIC PAGES DEBUG ===\n')

// 1. Test Maintenance component rendering
console.log('=== MAINTENANCE COMPONENT TEST ===')
try {
  // Simulasi maintenance data
  const mockMaintenance = [
    { id: 1, plantName: 'Tomat', type: 'watering', date: '2025-11-23', description: 'Siram tanaman' },
    { id: 2, plantName: 'Tomat', type: 'fertilizing', date: '2025-11-23', description: 'Beri pupuk' },
    { id: 3, plantName: 'Cabai', type: 'pesticide', date: '2025-11-23', description: 'Semprot pestisida' }
  ]
  
  // Test maintenanceByPlant grouping
  const maintenanceByPlant = mockMaintenance.reduce((acc, item) => {
    if (!item.plantName) return acc
    if (!acc[item.plantName]) {
      acc[item.plantName] = []
    }
    acc[item.plantName].push(item)
    return acc
  }, {})
  
  console.log('✅ Maintenance grouping works:', Object.keys(maintenanceByPlant))
  
  // Test rendering simulation
  Object.entries(maintenanceByPlant).forEach(([plantName, items]) => {
    console.log(`  Rendering ${plantName}: ${items.length} items`)
    items.forEach(item => {
      console.log(`    - ${item.type}: ${item.description}`)
    })
  })
  
} catch (error) {
  console.log('❌ Maintenance component error:', error.message)
}

// 2. Test Finances component rendering
console.log('\n=== FINANCES COMPONENT TEST ===')
try {
  // Simulasi finances data
  const mockFinances = [
    { id: 1, type: 'income', amount: 1000, date: '2025-11-23', description: 'Jual tomat' },
    { id: 2, type: 'expense', amount: 500, date: '2025-11-23', description: 'Beli pupuk' },
    { id: 3, type: 'income', amount: 2000, date: '2025-11-23', description: 'Jual cabai' }
  ]
  
  // Test calculations
  const income = mockFinances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0)
  const expenses = mockFinances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0)
  const profit = income - expenses
  
  console.log('✅ Finances calculations:', { income, expenses, profit })
  
  // Test financesByMonth grouping
  const financesByMonth = mockFinances.reduce((acc, finance) => {
    if (!finance.date) return acc
    const month = new Date(finance.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(finance)
    return acc
  }, {})
  
  console.log('✅ Finances grouping:', Object.keys(financesByMonth))
  
} catch (error) {
  console.log('❌ Finances component error:', error.message)
}

// 3. Test common issues
console.log('\n=== COMMON ISSUES CHECK ===')

// Check untuk undefined/null issues
const testCases = [
  { name: 'null plantName', data: { plantName: null, type: 'watering' } },
  { name: 'undefined date', data: { plantName: 'Test', type: 'watering', date: undefined } },
  { name: 'empty array', data: [] },
  { name: 'missing properties', data: { id: 1 } }
]

testCases.forEach(testCase => {
  try {
    if (Array.isArray(testCase.data)) {
      // Test empty array
      const result = testCase.data.reduce((acc, item) => {
        if (!item.plantName) return acc
        if (!acc[item.plantName]) acc[item.plantName] = []
        acc[item.plantName].push(item)
        return acc
      }, {})
      console.log(`✅ ${testCase.name}:`, Object.keys(result).length, 'groups')
    } else {
      // Test single item
      const result = [testCase.data].reduce((acc, item) => {
        if (!item.plantName) return acc
        if (!acc[item.plantName]) acc[item.plantName] = []
        acc[item.plantName].push(item)
        return acc
      }, {})
      console.log(`✅ ${testCase.name}:`, Object.keys(result).length, 'groups')
    }
  } catch (error) {
    console.log(`❌ ${testCase.name}:`, error.message)
  }
})

// 4. Test formatDate extensively
console.log('\n=== FORMATDATE EXTENSIVE TEST ===')
function formatDate(date) {
  if (!date) return 'Tanggal tidak tersedia'
  let dateObj
  try {
    dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
    if (isNaN(dateObj.getTime())) return 'Tanggal tidak valid'
  } catch (error) {
    return 'Tanggal error'
  }
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(dateObj)
}

const dateTests = [
  null, undefined, '', 'invalid', '2025-11-23', '2025-13-45', 
  new Date(), new Date('invalid'), '0000-00-00'
]

dateTests.forEach((date, i) => {
  try {
    const result = formatDate(date)
    console.log(`Date ${i + 1}:`, date, '->', result)
  } catch (error) {
    console.log(`Date ${i + 1}:`, date, '-> ERROR:', error.message)
  }
})

console.log('\n=== DEBUGGING COMPLETE ===')
console.log('If all tests pass, the issue might be:')
console.log('1. Data fetching from API')
console.log('2. Component mounting issues')
console.log('3. CSS/styling problems')
console.log('4. Router/navigation issues')
