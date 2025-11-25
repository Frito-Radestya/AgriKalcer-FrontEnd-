// Copy paste ini ke browser console untuk force clear cache dan reload
console.log('=== FORCE CLEAR AND RELOAD ===')

// 1. Clear all storage
try {
  localStorage.clear()
  sessionStorage.clear()
  console.log('✅ Storage cleared')
} catch (error) {
  console.log('❌ Storage clear failed:', error.message)
}

// 2. Clear service worker cache
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))
      .then(() => console.log('✅ Service worker cache cleared'))
  })
}

// 3. Clear application cache
if ('applicationCache' in window) {
  try {
    window.applicationCache.update()
    console.log('✅ Application cache updated')
  } catch (error) {
    console.log('❌ Application cache error:', error.message)
  }
}

// 4. Force reload dengan timestamp
console.log('🔄 Forcing reload with cache bust...')
const timestamp = new Date().getTime()
const currentUrl = window.location.href
const urlWithTimestamp = currentUrl.includes('?') 
  ? `${currentUrl}&t=${timestamp}` 
  : `${currentUrl}?t=${timestamp}`

console.log('Loading:', urlWithTimestamp)

// 5. Redirect ke URL baru setelah 2 detik
setTimeout(() => {
  window.location.href = urlWithTimestamp
}, 2000)

// 6. Test formatDate setelah reload
console.log('=== TESTING FORMATDATE AFTER RELOAD ===')

// Test formatDate function
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

// Test cases
const testCases = [
  null,
  undefined, 
  '',
  'invalid-date',
  '2025-11-23'
]

console.log('FormatDate tests:')
testCases.forEach((testCase, i) => {
  console.log(`  Test ${i + 1}:`, testCase, '->', formatDate(testCase))
})

console.log('\n=== INSTRUCTIONS ===')
console.log('1. Script ini akan otomatis reload halaman dalam 2 detik')
console.log('2. Setelah reload, halaman Maintenance dan Finances seharusnya normal')
console.log('3. Jika masih error, close browser dan buka baru')

console.log('\n=== ALTERNATIF MANUAL ===')
console.log('Jika auto-reload tidak bekerja:')
console.log('1. Close browser completely (Ctrl+Shift+Q)')
console.log('2. Open new browser window')
console.log('3. Go to: http://localhost:5174')
console.log('4. Login dan cek Maintenance/Finances')
