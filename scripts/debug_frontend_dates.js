// Debug frontend date parsing
console.log('=== FRONTEND DATE DEBUG ===\n')

// Simulate data dari backend
const mockBackendData = {
  planting_date: '2025-11-23',
  estimated_harvest_date: '2025-11-23'
}

console.log('Backend Data:', mockBackendData)

// Test 1: Parsing plantDate (DataContext method)
const plantDate1 = mockBackendData.planting_date ? String(mockBackendData.planting_date).slice(0,10) : ''
console.log('Method 1 - String.slice:', plantDate1)

// Test 2: Parsing dengan new Date (problematic)
const plantDate2 = mockBackendData.planting_date ? new Date(mockBackendData.planting_date).toISOString().slice(0,10) : ''
console.log('Method 2 - new Date (OLD):', plantDate2)

// Test 3: Parsing dengan toISOString (another problematic)
const plantDate3 = mockBackendData.planting_date ? new Date(mockBackendData.planting_date + 'T00:00:00').toISOString().slice(0,10) : ''
console.log('Method 3 - with T00:00:00:', plantDate3)

// Test 4: Parsing dengan local date
const plantDate4 = mockBackendData.planting_date ? new Date(mockBackendData.planting_date).toLocaleDateString('en-CA') : ''
console.log('Method 4 - toLocaleDateString:', plantDate4)

// Test 5: Manual parsing
const manualDate = new Date(mockBackendData.planting_date)
const year = manualDate.getFullYear()
const month = String(manualDate.getMonth() + 1).padStart(2, '0')
const day = String(manualDate.getDate()).padStart(2, '0')
const plantDate5 = `${year}-${month}-${day}`
console.log('Method 5 - Manual:', plantDate5)

// Test estimatedHarvestDate parsing
console.log('\n=== ESTIMATED HARVEST DATE ===')
const estDate1 = mockBackendData.estimated_harvest_date ? new Date(mockBackendData.estimated_harvest_date) : null
console.log('Backend estimated_harvest_date:', mockBackendData.estimated_harvest_date)
console.log('Frontend Date object:', estDate1)
console.log('Frontend ISO string:', estDate1 ? estDate1.toISOString().slice(0,10) : 'null')
console.log('Frontend Local string:', estDate1 ? estDate1.toLocaleDateString('en-CA') : 'null')

// Test formatDate function
function formatDate(date) {
  const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj)
}

console.log('\n=== FORMAT FUNCTION ===')
console.log('Format plantDate1:', formatDate(plantDate1))
console.log('Format estDate1:', formatDate(estDate1))

// Debug current date
console.log('\n=== CURRENT DATE DEBUG ===')
const now = new Date()
console.log('Current time:', now.toString())
console.log('Current ISO:', now.toISOString())
console.log('Current Local:', now.toLocaleDateString('en-CA'))
console.log('Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone)

// Test specific date creation
console.log('\n=== SPECIFIC DATE CREATION ===')
const specificDate = new Date('2025-11-23')
console.log('new Date("2025-11-23"):', specificDate.toString())
console.log('new Date("2025-11-23").toISOString():', specificDate.toISOString())
console.log('new Date("2025-11-23").toLocaleDateString():', specificDate.toLocaleDateString())
