// Copy paste ini ke browser console untuk debugging
console.log('=== BROWSER CONSOLE DEBUG ===')

// 1. Test formatDate langsung di browser
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

// 2. Test dengan berbagai input
console.log('=== FORMATDATE TEST ===')
console.log('formatDate(null):', formatDate(null))
console.log('formatDate(undefined):', formatDate(undefined))
console.log('formatDate(""):', formatDate(''))
console.log('formatDate("invalid"):', formatDate('invalid'))
console.log('formatDate("2025-11-23"):', formatDate('2025-11-23'))

// 3. Check React state (jika bisa diakses)
try {
  // Coba akses React DevTools
  const reactRoot = document.querySelector('#root')
  if (reactRoot) {
    console.log('React root found:', reactRoot)
  }
} catch (error) {
  console.log('Cannot access React:', error.message)
}

// 4. Check maintenance data di DOM
console.log('=== MAINTENANCE DOM CHECK ===')
const maintenanceElements = document.querySelectorAll('[data-testid*="maintenance"], .maintenance, .activity')
console.log('Maintenance elements found:', maintenanceElements.length)

// 5. Check untuk error elements
console.log('=== ERROR ELEMENTS CHECK ===')
const errorElements = document.querySelectorAll('.error, .error-message, [role="alert"]')
console.log('Error elements found:', errorElements.length)
errorElements.forEach((el, i) => {
  console.log(`Error ${i + 1}:`, el.textContent)
})

// 6. Check Network requests
console.log('=== NETWORK CHECK ===')
if (window.performance && window.performance.getEntriesByType) {
  const resources = window.performance.getEntriesByType('resource')
  const apiCalls = resources.filter(r => r.name.includes('/api/'))
  console.log('API calls found:', apiCalls.length)
  apiCalls.forEach((call, i) => {
    console.log(`API ${i + 1}:`, call.name, call.status || 'N/A')
  })
}

// 7. Test maintenance data parsing
console.log('=== MAINTENANCE DATA PARSING ===')
const mockMaintenanceItems = [
  { id: 1, type: 'watering', date: null, description: 'Test null' },
  { id: 2, type: 'fertilizing', date: '2025-11-23', description: 'Test valid' },
  { id: 3, type: 'pesticide', date: 'invalid-date', description: 'Test invalid' }
]

mockMaintenanceItems.forEach((item, i) => {
  try {
    const formatted = formatDate(item.date)
    console.log(`Mock ${i + 1}: ${item.description} -> ${formatted}`)
  } catch (error) {
    console.log(`Mock ${i + 1}: ${item.description} -> ERROR: ${error.message}`)
  }
})

console.log('\n=== DEBUGGING COMPLETE ===')
console.log('Jika masih error, screenshot hasil ini dan beri tahu developer')
