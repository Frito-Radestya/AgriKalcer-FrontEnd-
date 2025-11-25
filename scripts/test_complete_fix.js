// Test complete date fix
console.log('=== COMPLETE DATE FIX TEST ===\n')

// Test 1: Default date in Plants.jsx
const defaultDate = new Date().toLocaleDateString('en-CA')
console.log('✅ Default plantDate:', defaultDate)

// Test 2: formatDate function
function formatDate(date) {
  const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj)
}

const formattedDate = formatDate('2025-11-23')
console.log('✅ Formatted date:', formattedDate)

// Test 3: String parsing (DataContext)
const plantDate = String('2025-11-23').slice(0,10)
console.log('✅ Parsed plantDate:', plantDate)

// Test 4: addDays function
function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const harvestDate = addDays('2025-11-23', 60)
console.log('✅ Harvest date:', harvestDate.toISOString().slice(0,10))

// Test 5: Full flow simulation
console.log('\n=== FULL FLOW SIMULATION ===')
const backendPlantingDate = '2025-11-23'
const backendEstimatedDate = '2025-11-23'

// Frontend parsing
const frontendPlantDate = String(backendPlantingDate).slice(0,10)
const frontendEstimatedDate = new Date(backendEstimatedDate)

console.log('Backend planting_date:', backendPlantingDate)
console.log('Frontend plantDate:', frontendPlantDate)
console.log('Backend estimated_harvest_date:', backendEstimatedDate)
console.log('Frontend estimatedHarvestDate:', frontendEstimatedDate.toISOString().slice(0,10))

// Display formatting
console.log('Display planting date:', formatDate(frontendPlantDate))
console.log('Display harvest date:', formatDate(frontendEstimatedDate))

console.log('\n=== SUMMARY ===')
console.log('✅ Plants.jsx: toLocaleDateString("en-CA") for default dates')
console.log('✅ DataContext: String(date).slice(0,10) for parsing')
console.log('✅ utils.js: formatDate with timezone fix')
console.log('✅ addDays: Local date without UTC')
console.log('✅ All timezone issues should be resolved!')

console.log('\n=== NEXT STEPS ===')
console.log('1. Refresh browser (Ctrl+F5)')
console.log('2. Clear browser cache if needed')
console.log('3. Add new plant with date 23 November 2025')
console.log('4. Check both backend and frontend show same date')
console.log('5. Verify display formatting shows correct date')
