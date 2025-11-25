// Copy paste ini ke browser console untuk debugging
console.log('=== BROWSER CONSOLE DEBUG ===')

// 1. Check React DevTools dan component errors
console.log('=== REACT COMPONENT CHECK ===')
try {
  // Check jika ada React errors
  const reactRoot = document.querySelector('#root')
  if (reactRoot) {
    console.log('✅ React root found')
    console.log('Root innerHTML length:', reactRoot.innerHTML.length)
    
    // Check untuk error boundaries
    const errorElements = reactRoot.querySelectorAll('[data-reactroot], [data-react-check-sum]')
    console.log('React elements found:', errorElements.length)
  } else {
    console.log('❌ React root not found')
  }
} catch (error) {
  console.log('❌ React check error:', error.message)
}

// 2. Check untuk JavaScript errors
console.log('\n=== ERROR CHECK ===')
console.log('Current errors:', window.console.error || 'No console.error available')

// 3. Check untuk maintenance dan finances data
console.log('\n=== DATA CHECK ===')
try {
  // Check localStorage
  const maintenanceData = localStorage.getItem('maintenance')
  const financesData = localStorage.getItem('finances')
  
  console.log('Maintenance in localStorage:', maintenanceData ? 'YES' : 'NO')
  console.log('Finances in localStorage:', financesData ? 'YES' : 'NO')
  
  if (maintenanceData) {
    try {
      const parsed = JSON.parse(maintenanceData)
      console.log('Maintenance data length:', parsed.length)
      console.log('Sample maintenance item:', parsed[0])
    } catch (e) {
      console.log('❌ Maintenance data parse error:', e.message)
    }
  }
  
  if (financesData) {
    try {
      const parsed = JSON.parse(financesData)
      console.log('Finances data length:', parsed.length)
      console.log('Sample finance item:', parsed[0])
    } catch (e) {
      console.log('❌ Finances data parse error:', e.message)
    }
  }
} catch (error) {
  console.log('❌ Data check error:', error.message)
}

// 4. Check untuk CSS loading
console.log('\n=== CSS CHECK ===')
const stylesheets = Array.from(document.styleSheets)
console.log('Stylesheets loaded:', stylesheets.length)
stylesheets.forEach((sheet, i) => {
  try {
    console.log(`Sheet ${i + 1}: ${sheet.href || 'inline'}`)
  } catch (e) {
    console.log(`Sheet ${i + 1}: Error accessing - ${e.message}`)
  }
})

// 5. Check untuk network requests
console.log('\n=== NETWORK CHECK ===')
if (window.performance && window.performance.getEntriesByType) {
  const resources = window.performance.getEntriesByType('resource')
  const apiCalls = resources.filter(r => r.name.includes('/api/'))
  console.log('API calls found:', apiCalls.length)
  
  apiCalls.forEach((call, i) => {
    console.log(`API ${i + 1}: ${call.name} - Status: ${call.status || 'N/A'}`)
  })
}

// 6. Test manual rendering
console.log('\n=== MANUAL RENDERING TEST ===')
try {
  // Test formatDate function
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
  
  console.log('formatDate test:', formatDate('2025-11-23'))
  console.log('formatDate null test:', formatDate(null))
  
  // Test grouping functions
  const testMaintenance = [
    { plantName: 'Test Plant', type: 'watering', date: '2025-11-23' }
  ]
  
  const maintenanceByPlant = testMaintenance.reduce((acc, item) => {
    if (!item.plantName) return acc
    if (!acc[item.plantName]) acc[item.plantName] = []
    acc[item.plantName].push(item)
    return acc
  }, {})
  
  console.log('Maintenance grouping test:', Object.keys(maintenanceByPlant))
  console.log('✅ Manual rendering tests passed')
  
} catch (error) {
  console.log('❌ Manual rendering test error:', error.message)
}

// 7. Check untuk specific error patterns
console.log('\n=== SPECIFIC ERROR PATTERNS ===')
console.log('Checking for common issues:')
console.log('- formatDate function exists:', typeof formatDate !== 'undefined')
console.log('- React exists:', typeof React !== 'undefined')
console.log('- ReactDOM exists:', typeof ReactDOM !== 'undefined')

console.log('\n=== DEBUGGING COMPLETE ===')
console.log('Copy this output and send to developer if issues persist')
