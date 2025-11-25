// Deep debugging untuk menemukan root cause
console.log('=== DEEP DEBUG - ROOT CAUSE ANALYSIS ===\n')

// 1. Test semua kemungkinan parsing method
const testDate = '2025-11-23'
console.log('Input:', testDate)

console.log('\n=== ALL PARSING METHODS ===')
console.log('1. String.slice:', String(testDate).slice(0,10))
console.log('2. new Date().toISOString():', new Date(testDate).toISOString().slice(0,10))
console.log('3. new Date().toLocaleDateString("en-CA"):', new Date(testDate).toLocaleDateString('en-CA'))
console.log('4. new Date().toLocaleDateString("id-ID"):', new Date(testDate).toLocaleDateString('id-ID'))
console.log('5. Manual:', new Date(testDate).getFullYear() + '-' + String(new Date(testDate).getMonth() + 1).padStart(2, '0') + '-' + String(new Date(testDate).getDate()).padStart(2, '0'))

// 2. Test dengan timestamp
console.log('\n=== TIMESTAMP ANALYSIS ===')
const dateObj = new Date(testDate)
console.log('Date object:', dateObj.toString())
console.log('Date object ISO:', dateObj.toISOString())
console.log('Date object locale:', dateObj.toLocaleDateString())
console.log('Date object en-CA:', dateObj.toLocaleDateString('en-CA'))
console.log('Date object id-ID:', dateObj.toLocaleDateString('id-ID'))

// 3. Test timezone behavior
console.log('\n=== TIMEZONE BEHAVIOR ===')
console.log('Current timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone)
console.log('UTC offset:', dateObj.getTimezoneOffset())
console.log('UTC hours:', dateObj.getUTCHours())
console.log('Local hours:', dateObj.getHours())

// 4. Test dengan waktu berbeda
console.log('\n=== DIFFERENT TIME TESTS ===')
const tests = [
  '2025-11-23',
  '2025-11-23T00:00:00',
  '2025-11-23T12:00:00',
  '2025-11-23T23:59:59',
  '2025-11-24',
  '2025-11-22'
]

tests.forEach(test => {
  const d = new Date(test)
  console.log(`${test} -> ISO: ${d.toISOString().slice(0,10)} | Local: ${d.toLocaleDateString('en-CA')} | ID: ${d.toLocaleDateString('id-ID')}`)
})

// 5. Test React input behavior simulation
console.log('\n=== REACT INPUT SIMULATION ===')
const simulatedInput = {
  value: '2025-11-23',
  type: 'date'
}

// Simulasi onChange event
const simulatedOnChange = (e) => {
  const value = e.target.value
  console.log('Input value:', value)
  console.log('Input type:', typeof value)
  console.log('Parsed with String.slice:', String(value).slice(0,10))
  console.log('Parsed with new Date:', new Date(value).toISOString().slice(0,10))
}

simulatedOnChange({ target: { value: simulatedInput.value } })

// 6. Test backend API simulation
console.log('\n=== BACKEND API SIMULATION ===')
const simulatedApiResponse = {
  planting_date: '2025-11-23',
  estimated_harvest_date: '2025-11-23'
}

// Simulasi DataContext parsing
const simulatedPlants = simulatedApiResponse.data || [simulatedApiResponse]
const mapped = simulatedPlants.map(p => ({
  plantDate: p.planting_date ? String(p.planting_date).slice(0,10) : '',
  estimatedHarvestDate: p.estimated_harvest_date ? new Date(p.estimated_harvest_date) : null
}))

console.log('Simulated mapped data:', mapped)

console.log('\n=== POSSIBLE ROOT CAUSES ===')
console.log('1. Browser timezone setting')
console.log('2. React input date picker behavior')
console.log('3. API response format')
console.log('4. Server timezone configuration')
console.log('5. Client-side caching')

console.log('\n=== NEXT DEBUG STEPS ===')
console.log('1. Check browser timezone settings')
console.log('2. Check actual API response in Network tab')
console.log('3. Check React state in DevTools')
console.log('4. Check server timezone')
