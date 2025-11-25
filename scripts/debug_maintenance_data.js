// Debug maintenance data yang mungkin menyebabkan error
console.log('=== MAINTENANCE DATA DEBUG ===\n')

// Simulasi maintenance data dari API yang mungkin problematic
const problematicMaintenanceData = [
  { id: 1, type: 'watering', date: null, description: 'Test null date' },
  { id: 2, type: 'fertilizing', date: undefined, description: 'Test undefined date' },
  { id: 3, type: 'pesticide', date: '', description: 'Test empty date' },
  { id: 4, type: 'weeding', date: 'invalid-date', description: 'Test invalid date' },
  { id: 5, type: 'watering', date: '0000-00-00', description: 'Test zero date' },
  { id: 6, type: 'fertilizing', date: '2025-13-45', description: 'Test impossible date' },
  { id: 7, type: 'pesticide', date: '2025-11-23', description: 'Test valid date' },
]

// formatDate function yang sudah diperbaiki
function formatDate(date) {
  // Handle invalid dates and timezone issues
  if (!date) return 'Tanggal tidak tersedia'
  
  let dateObj
  try {
    dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
    
    // Check if date is valid
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

console.log('=== TESTING PROBLEMATIC DATA ===')
problematicMaintenanceData.forEach((item, i) => {
  try {
    const formatted = formatDate(item.date)
    console.log(`Item ${i + 1}: ${item.description} -> ${formatted}`)
  } catch (error) {
    console.log(`Item ${i + 1}: ${item.description} -> ERROR: ${error.message}`)
  }
})

// Test edge cases yang mungkin masih menyebabkan error
console.log('\n=== TESTING EDGE CASES ===')
const edgeCases = [
  '0000-00-00',
  '1900-01-01',
  '2100-12-31',
  '2025-02-30', // Feb doesn't have 30 days
  '2025-04-31', // April doesn't have 31 days
  '2025-11-31', // Nov doesn't have 31 days
  '2025-11-23 25:00:00', // Invalid hour
  '2025-11-23 -05:00', // Negative timezone
  '9999-12-31',
  '0001-01-01',
]

edgeCases.forEach((edgeCase, i) => {
  try {
    const result = formatDate(edgeCase)
    console.log(`Edge ${i + 1}: ${edgeCase} -> ${result}`)
  } catch (error) {
    console.log(`Edge ${i + 1}: ${edgeCase} -> ERROR: ${error.message}`)
  }
})

console.log('\n=== POSSIBLE REMAINING ISSUES ===')
console.log('1. Database memiliki tanggal yang sangat invalid')
console.log('2. Maintenance.jsx masih menggunakan formatDate lama (cache)')
console.log('3. Ada tempat lain yang memanggil formatDate dengan data invalid')
console.log('4. Browser cache yang sangat stubborn')

console.log('\n=== DEBUGGING STEPS ===')
console.log('1. Check browser console untuk exact error line')
console.log('2. Check Network tab untuk API response')
console.log('3. Check React DevTools untuk maintenance state')
console.log('4. Clear browser cache completely')
