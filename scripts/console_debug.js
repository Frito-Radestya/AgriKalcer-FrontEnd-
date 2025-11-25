// Copy paste ini ke browser console
console.log('=== BROWSER CONSOLE DEBUG ===')

// Test parsing
const testBackendData = { planting_date: '2025-11-23', estimated_harvest_date: '2025-11-23' }
const plantDate = testBackendData.planting_date ? String(testBackendData.planting_date).slice(0,10) : ''
const estimatedHarvestDate = testBackendData.estimated_harvest_date ? new Date(testBackendData.estimated_harvest_date) : null

console.log('Backend planting_date:', testBackendData.planting_date)
console.log('Frontend plantDate:', plantDate)
console.log('Backend estimated_harvest_date:', testBackendData.estimated_harvest_date)
console.log('Frontend estimatedHarvestDate:', estimatedHarvestDate)
console.log('Frontend ISO:', estimatedHarvestDate?.toISOString?.().slice(0,10))

// Test formatDate
function formatDate(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(dateObj)
}

console.log('Formatted plantDate:', formatDate(plantDate))
console.log('Formatted estimatedHarvestDate:', formatDate(estimatedHarvestDate))
console.log('Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone)

// Check React state
const plantsData = document.querySelector('[data-plant-id]')?.__reactProps$?.children?.props?.plants
if (plantsData) {
  console.log('React plants data:', plantsData.slice(0, 3))
}
