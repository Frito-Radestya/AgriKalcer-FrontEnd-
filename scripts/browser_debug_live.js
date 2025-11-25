// Copy paste ini ke browser console saat di halaman Maintenance atau Finances
console.log('=== LIVE BROWSER DEBUG ===')

// 1. Check React state
console.log('=== REACT STATE CHECK ===')
try {
  // Coba akses React DevTools
  const reactRoot = document.querySelector('#root')
  console.log('React root found:', !!reactRoot)
  
  // Check untuk error boundaries
  const errorElements = document.querySelectorAll('[data-react-error-boundary]')
  console.log('Error boundaries found:', errorElements.length)
  
  // Check untuk white screen
  const bodyContent = document.body.innerHTML
  console.log('Body content length:', bodyContent.length)
  console.log('Body contains "Maintenance":', bodyContent.includes('Maintenance'))
  console.log('Body contains "Keuangan":', bodyContent.includes('Keuangan'))
  
} catch (error) {
  console.log('❌ React state error:', error.message)
}

// 2. Check URL dan routing
console.log('\n=== ROUTING CHECK ===')
console.log('Current URL:', window.location.href)
console.log('Current path:', window.location.pathname)
console.log('Hash:', window.location.hash)

// 3. Check untuk maintenance data
console.log('\n=== MAINTENANCE DATA CHECK ===')
try {
  // Check localStorage
  const maintenanceStorage = localStorage.getItem('maintenance')
  console.log('Maintenance in localStorage:', !!maintenanceStorage)
  
  if (maintenanceStorage) {
    const parsed = JSON.parse(maintenanceStorage)
    console.log('Maintenance data type:', typeof parsed)
    console.log('Maintenance data length:', parsed.length)
    console.log('Sample maintenance item:', parsed[0])
  }
  
  // Check network
  fetch('/api/maintenance', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => {
    console.log('Maintenance API status:', res.status)
    return res.json()
  }).then(data => {
    console.log('Maintenance API data:', data)
    console.log('Maintenance data type:', typeof data)
    console.log('Is array:', Array.isArray(data))
  }).catch(error => {
    console.log('❌ Maintenance API error:', error.message)
  })
  
} catch (error) {
  console.log('❌ Maintenance data check error:', error.message)
}

// 4. Check untuk finances data
console.log('\n=== FINANCES DATA CHECK ===')
try {
  // Check localStorage
  const financesStorage = localStorage.getItem('finances')
  console.log('Finances in localStorage:', !!financesStorage)
  
  if (financesStorage) {
    const parsed = JSON.parse(financesStorage)
    console.log('Finances data type:', typeof parsed)
    console.log('Finances data length:', parsed.length)
    console.log('Sample finance item:', parsed[0])
  }
  
  // Check network
  fetch('/api/finances', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => {
    console.log('Finances API status:', res.status)
    return res.json()
  }).then(data => {
    console.log('Finances API data:', data)
    console.log('Finances data type:', typeof data)
    console.log('Is array:', Array.isArray(data))
  }).catch(error => {
    console.log('❌ Finances API error:', error.message)
  })
  
} catch (error) {
  console.log('❌ Finances data check error:', error.message)
}

// 5. Check untuk component rendering
console.log('\n=== COMPONENT RENDERING CHECK ===')
try {
  // Check untuk maintenance elements
  const maintenanceElements = document.querySelectorAll('*')
  const maintenanceRelated = Array.from(maintenanceElements).filter(el => 
    el.textContent.includes('Perawatan') || 
    el.textContent.includes('Maintenance') ||
    el.className.includes('maintenance')
  )
  console.log('Maintenance related elements:', maintenanceRelated.length)
  
  // Check untuk finances elements
  const financesRelated = Array.from(maintenanceElements).filter(el => 
    el.textContent.includes('Keuangan') || 
    el.textContent.includes('Finances') ||
    el.className.includes('finance')
  )
  console.log('Finances related elements:', financesRelated.length)
  
  // Check untuk white screen indicators
  const hasContent = document.body.querySelector('h1, h2, h3, .card, button')
  console.log('Page has content elements:', !!hasContent)
  
} catch (error) {
  console.log('❌ Component rendering error:', error.message)
}

// 6. Check untuk CSS loading
console.log('\n=== CSS LOADING CHECK ===')
try {
  const stylesheets = Array.from(document.styleSheets)
  console.log('Stylesheets loaded:', stylesheets.length)
  
  // Check untuk main CSS
  const mainCSS = stylesheets.find(sheet => sheet.href && sheet.href.includes('index.css'))
  console.log('Main CSS loaded:', !!mainCSS)
  
  // Check untuk component CSS
  const componentCSS = stylesheets.find(sheet => sheet.href && sheet.href.includes('components'))
  console.log('Component CSS loaded:', !!componentCSS)
  
} catch (error) {
  console.log('❌ CSS loading error:', error.message)
}

// 7. Manual force render test
console.log('\n=== MANUAL FORCE RENDER TEST ===')
try {
  // Coba trigger manual render
  const event = new Event('resize')
  window.dispatchEvent(event)
  
  // Coba scroll ke trigger render
  window.scrollTo(0, 0)
  
  console.log('✅ Manual render triggers sent')
  
} catch (error) {
  console.log('❌ Manual render error:', error.message)
}

console.log('\n=== DEBUGGING COMPLETE ===')
console.log('Copy this output and send to developer')
console.log('If page is still white, try:')
console.log('1. Hard refresh (Ctrl+Shift+R)')
console.log('2. Clear browser cache')
console.log('3. Check browser console for errors')
console.log('4. Check Network tab for failed requests')
