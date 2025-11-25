// Browser Debug Helper - Copy paste ini ke console browser
console.log('=== BROWSER DEBUG HELPER ===\n')

// 1. Cek current state di DataContext
// Buka browser console dan paste:
/*
// Debug DataContext state
const dataContext = document.querySelector('[data-testid="data-context"]') || window;
console.log('Current plants data:', dataContext.plants?.slice(0, 3));

// Debug specific plant
const firstPlant = dataContext.plants?.[0];
if (firstPlant) {
  console.log('First plant:', {
    id: firstPlant.id,
    plantName: firstPlant.plantName,
    plantDate: firstPlant.plantDate,
    plantDateType: typeof firstPlant.plantDate,
    estimatedHarvestDate: firstPlant.estimatedHarvestDate,
    estimatedHarvestDateType: typeof firstPlant.estimatedHarvestDate,
    estimatedHarvestDateString: firstPlant.estimatedHarvestDate?.toISOString?.().slice(0,10)
  });
}
*/

// 2. Test parsing langsung di browser
console.log('=== DIRECT PARSING TEST ===')
const testBackendData = {
  planting_date: '2025-11-23',
  estimated_harvest_date: '2025-11-23'
}

// Method yang digunakan DataContext
const plantDate = testBackendData.planting_date ? String(testBackendData.planting_date).slice(0,10) : ''
const estimatedHarvestDate = testBackendData.estimated_harvest_date ? new Date(testBackendData.estimated_harvest_date) : null

console.log('Backend planting_date:', testBackendData.planting_date)
console.log('Frontend plantDate:', plantDate)
console.log('Backend estimated_harvest_date:', testBackendData.estimated_harvest_date)
console.log('Frontend estimatedHarvestDate:', estimatedHarvestDate)
console.log('Frontend estimatedHarvestDate ISO:', estimatedHarvestDate?.toISOString?.().slice(0,10))

// 3. Test formatDate
function formatDate(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj)
}

console.log('Formatted plantDate:', formatDate(plantDate))
console.log('Formatted estimatedHarvestDate:', formatDate(estimatedHarvestDate))

// 4. Test current date behavior
console.log('\n=== CURRENT DATE BEHAVIOR ===')
const now = new Date()
console.log('Current time:', now.toString())
console.log('Current ISO:', now.toISOString())
console.log('Current Local (en-CA):', now.toLocaleDateString('en-CA'))
console.log('Current Local (id-ID):', now.toLocaleDateString('id-ID'))
console.log('Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone)

// 5. Test specific date creation
console.log('\n=== SPECIFIC DATE CREATION ===')
const specific = new Date('2025-11-23')
console.log('new Date("2025-11-23"):', specific.toString())
console.log('new Date("2025-11-23").toISOString():', specific.toISOString())
console.log('new Date("2025-11-23").toLocaleDateString("en-CA"):', specific.toLocaleDateString('en-CA'))

console.log('\n=== INSTRUCTIONS ===')
console.log('1. Buka browser dev tools (F12)')
console.log('2. Refresh halaman Plants')
console.log('3. Copy paste script ini ke console')
console.log('4. Lihat hasil dan screenshot jika masih salah')
console.log('5. Perhatikan timezone dan hasil parsing')
